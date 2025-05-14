// retire-lah-client/src/utils/calculator.js

export const INSTRUMENT_DETAILS = {
    spy: { name: "SPY (S&P 500)", grossReturn: 0.10, expenseRatio: 0.000945 },
    qqq: { name: "QQQ (Tech Focused)", grossReturn: 0.13, expenseRatio: 0.0020 },
};

const SAFE_WITHDRAWAL_RATE = 0.04;

export function calculateRetirement(inputs) {
    const { 
        currentAge, 
        retirementAge, 
        desiredMonthlyLifestyleToday,
        assumedInflationRate, // User inputs this as a percentage value, e.g., 2.5 for 2.5%
        initialInvestment = 0, 
        instrument 
    } = inputs;

    // --- Input Parsing and Validation ---
    const parsedCurrentAge = parseInt(currentAge);
    const parsedRetirementAge = parseInt(retirementAge);
    const parsedLifestyleToday = parseFloat(desiredMonthlyLifestyleToday);
    const parsedInitialInvestment = parseFloat(initialInvestment);
    // The 'assumedInflationRate' from input is directly the percentage (e.g., 2.5 means 2.5%)
    const directInflationInput = parseFloat(assumedInflationRate); 
    // For calculation, convert the percentage input to a decimal (e.g., 2.5 -> 0.025)
    const inflationRateForCalc = directInflationInput / 100;

    if (isNaN(parsedCurrentAge) || parsedCurrentAge < 18 || parsedCurrentAge > 99) {
        throw new Error("Invalid current age. Must be between 18 and 99.");
    }
    if (isNaN(parsedRetirementAge) || parsedRetirementAge > 100 || parsedRetirementAge < (parsedCurrentAge + 1)) {
        throw new Error("Invalid retirement age. Must be greater than current age and at most 100.");
    }
    if (isNaN(parsedLifestyleToday) || parsedLifestyleToday <= 0) {
        throw new Error("Desired monthly lifestyle (today's value) must be a positive number.");
    }
    // Validate the direct percentage input from the user for its sensible range
    if (isNaN(directInflationInput) || directInflationInput < 0 || directInflationInput > 20) { 
        throw new Error("Assumed annual inflation rate must be a number between 0% and 20%.");
    }
    if (isNaN(parsedInitialInvestment) || parsedInitialInvestment < 0) {
        throw new Error("Initial investment must be zero or a positive number.");
    }
    if (!instrument || !INSTRUMENT_DETAILS[instrument.toLowerCase()]) {
        throw new Error("Invalid investment instrument selected.");
    }
    // --- End Input Validation ---

    const investmentHorizonYears = parsedRetirementAge - parsedCurrentAge;
    const investmentHorizonMonths = investmentHorizonYears * 12;

    // 1. Calculate Future Value of Lifestyle Costs using the decimal inflation rate
    const futureMonthlyLifestyleCost = parsedLifestyleToday * Math.pow(1 + inflationRateForCalc, investmentHorizonYears);
    
    // 2. Calculate Target Nest Egg based on future lifestyle cost
    const annualExpensesAtRetirement = futureMonthlyLifestyleCost * 12;
    const targetNestEgg = annualExpensesAtRetirement / SAFE_WITHDRAWAL_RATE;

    const instrumentDetail = INSTRUMENT_DETAILS[instrument.toLowerCase()];
    const netAnnualReturn = instrumentDetail.grossReturn - instrumentDetail.expenseRatio;
    const monthlyReturnRate = Math.pow(1 + netAnnualReturn, 1 / 12) - 1;

    // 3. Calculate Future Value of Initial Investment
    let futureValueOfInitialInvestment = 0;
    if (parsedInitialInvestment > 0 && monthlyReturnRate !== -1) { // Avoid issues if return is -100%
         futureValueOfInitialInvestment = parsedInitialInvestment * Math.pow(1 + monthlyReturnRate, investmentHorizonMonths);
    }

    // 4. Calculate the remaining amount needed from monthly investments
    const remainingTarget = targetNestEgg - futureValueOfInitialInvestment;
    
    let monthlyInvestmentNeeded;
    if (remainingTarget <= 0) { // Goal already met or exceeded
        monthlyInvestmentNeeded = 0; 
    } else if (investmentHorizonMonths <= 0) { // No time to invest, need the whole remaining amount now
        monthlyInvestmentNeeded = remainingTarget > 0 ? Infinity : 0; // Or a very large number / error
    } else if (monthlyReturnRate === 0) { // No growth from investments
        monthlyInvestmentNeeded = remainingTarget / investmentHorizonMonths;
    } else { // Standard annuity calculation
        const numerator = remainingTarget * monthlyReturnRate;
        const denominator = Math.pow(1 + monthlyReturnRate, investmentHorizonMonths) - 1;
        monthlyInvestmentNeeded = (denominator === 0) ? (remainingTarget / investmentHorizonMonths) : (numerator / denominator);
    }
    
    // Final check for monthly investment needed
    if (monthlyInvestmentNeeded < 0 || !isFinite(monthlyInvestmentNeeded)) {
        monthlyInvestmentNeeded = (remainingTarget > 0 && isFinite(remainingTarget) && investmentHorizonMonths > 0) ? Infinity : 0;
    }

    // 5. Projection Chart Data
    const projectionChartData = [];
    let currentBalance = parsedInitialInvestment; 
    let totalMonthlyCapitalInvested = 0; 

    if (isFinite(monthlyInvestmentNeeded)) { // Only run projection if monthly investment is calculable
        for (let year = 0; year < investmentHorizonYears; year++) {
            let yearlyMonthlyCapitalInvested = 0;
            for (let month = 0; month < 12; month++) {
                if (monthlyInvestmentNeeded > 0) { 
                    currentBalance += monthlyInvestmentNeeded;
                    yearlyMonthlyCapitalInvested += monthlyInvestmentNeeded;
                }
                currentBalance *= (1 + monthlyReturnRate);
            }
            totalMonthlyCapitalInvested += yearlyMonthlyCapitalInvested;
            
            const totalCapitalAtYearEnd = parsedInitialInvestment + totalMonthlyCapitalInvested;
            const capitalGains = currentBalance - totalCapitalAtYearEnd;
            
            projectionChartData.push({
                age: parsedCurrentAge + year + 1,
                capitalInvested: parseFloat(totalCapitalAtYearEnd.toFixed(0)),
                capitalGains: parseFloat(Math.max(0, capitalGains.toFixed(0))),
                totalValue: parseFloat(currentBalance.toFixed(0)),
            });
        }

        // Adjust last point for chart aesthetics if significantly off and target is positive/finite
        if (projectionChartData.length > 0 && targetNestEgg > 0 && isFinite(targetNestEgg) && Math.abs(currentBalance - targetNestEgg) > 1) {
            const lastPoint = projectionChartData[projectionChartData.length - 1];
            const diff = targetNestEgg - lastPoint.totalValue;
            lastPoint.capitalGains = Math.max(0, lastPoint.capitalGains + diff); // Adjust gains
            lastPoint.totalValue = parseFloat(targetNestEgg.toFixed(0)); // Ensure total matches target
        }
    }


    return {
        targetNestEgg: parseFloat(targetNestEgg.toFixed(2)),
        monthlyInvestmentNeeded: parseFloat(monthlyInvestmentNeeded.toFixed(2)),
        projectionChartData,
        assumptions: {
            currentAge: parsedCurrentAge,
            retirementAge: parsedRetirementAge,
            initialInvestment: parsedInitialInvestment,
            desiredMonthlyLifestyleToday: parsedLifestyleToday,
            futureMonthlyLifestyleCost: parseFloat(futureMonthlyLifestyleCost.toFixed(2)),
            // Store the user-inputted percentage directly for display (e.g., 2.5)
            assumedInflationRatePercent: directInflationInput, 
            investmentHorizonYears: investmentHorizonYears,
            instrumentName: instrumentDetail.name,
            grossAnnualReturn: `${(instrumentDetail.grossReturn * 100).toFixed(1)}%`,
            expenseRatio: `${(instrumentDetail.expenseRatio * 100).toFixed(4)}%`,
            netAnnualReturn: `${(netAnnualReturn * 100).toFixed(2)}%`,
            safeWithdrawalRate: `${(SAFE_WITHDRAWAL_RATE * 100)}%`,
        }
    };
}