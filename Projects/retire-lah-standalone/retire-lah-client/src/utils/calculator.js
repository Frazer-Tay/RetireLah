// retire-lah-client/src/utils/calculator.js

// LIFESTYLE_COSTS is no longer used as a fixed map, users input today's value
// export const LIFESTYLE_COSTS = { ... }; 

export const INSTRUMENT_DETAILS = {
    spy: { name: "SPY (S&P 500)", grossReturn: 0.10, expenseRatio: 0.000945 },
    qqq: { name: "QQQ (Tech Focused)", grossReturn: 0.13, expenseRatio: 0.0020 },
};

const SAFE_WITHDRAWAL_RATE = 0.04;

export function calculateRetirement(inputs) {
    const { 
        currentAge, 
        retirementAge, 
        // lifestyle, // No longer used directly, replaced by desiredMonthlyLifestyleToday
        desiredMonthlyLifestyleToday,
        assumedInflationRate = 0.025, // Default 2.5% inflation if not provided
        initialInvestment = 0, 
        instrument 
    } = inputs;

    // --- Input Validation ---
    const parsedCurrentAge = parseInt(currentAge);
    const parsedRetirementAge = parseInt(retirementAge);
    const parsedLifestyleToday = parseFloat(desiredMonthlyLifestyleToday);
    const parsedInflationRate = parseFloat(assumedInflationRate) / 100; // Convert percentage to decimal
    const parsedInitialInvestment = parseFloat(initialInvestment);

    if (isNaN(parsedCurrentAge) || parsedCurrentAge < 18 || parsedCurrentAge > 99) {
        throw new Error("Invalid current age.");
    }
    if (isNaN(parsedRetirementAge) || parsedRetirementAge > 100 || parsedRetirementAge < 19) {
        throw new Error("Invalid retirement age.");
    }
    if (parsedRetirementAge <= parsedCurrentAge) {
        throw new Error("Retirement age must be greater than current age.");
    }
    if (isNaN(parsedLifestyleToday) || parsedLifestyleToday <= 0) {
        throw new Error("Desired monthly lifestyle (today's value) must be a positive number.");
    }
    if (isNaN(parsedInflationRate) || parsedInflationRate < 0 || parsedInflationRate > 0.2) { // Cap inflation at 20%
        throw new Error("Assumed inflation rate must be between 0% and 20%.");
    }
    if (isNaN(parsedInitialInvestment) || parsedInitialInvestment < 0) {
        throw new Error("Initial investment must be zero or a positive number.");
    }
    if (!instrument || !INSTRUMENT_DETAILS[instrument.toLowerCase()]) {
        throw new Error("Invalid investment instrument.");
    }
    // --- End Input Validation ---

    const investmentHorizonYears = parsedRetirementAge - parsedCurrentAge;
    const investmentHorizonMonths = investmentHorizonYears * 12;

    // 1. Calculate Future Value of Lifestyle Costs
    const futureMonthlyLifestyleCost = parsedLifestyleToday * Math.pow(1 + parsedInflationRate, investmentHorizonYears);
    
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
    if (remainingTarget <= 0) {
        monthlyInvestmentNeeded = 0; // Goal already met or exceeded by initial investment's growth
    } else if (monthlyReturnRate === 0 && investmentHorizonMonths > 0) {
        monthlyInvestmentNeeded = remainingTarget / investmentHorizonMonths;
    } else if (investmentHorizonMonths > 0) {
        const numerator = remainingTarget * monthlyReturnRate;
        const denominator = Math.pow(1 + monthlyReturnRate, investmentHorizonMonths) - 1;
        monthlyInvestmentNeeded = (denominator === 0) ? (remainingTarget / investmentHorizonMonths) : (numerator / denominator);
    } else {
        monthlyInvestmentNeeded = remainingTarget; // If no time to invest, need the whole amount
    }
    
    if (monthlyInvestmentNeeded < 0 || !isFinite(monthlyInvestmentNeeded)) {
        monthlyInvestmentNeeded = (remainingTarget > 0 && isFinite(remainingTarget)) ? Infinity : 0;
    }


    // 5. Projection Chart Data
    const projectionChartData = [];
    let currentBalance = parsedInitialInvestment; // Start with initial investment
    let totalMonthlyCapitalInvested = 0; // Tracks only the *new* monthly investments

    for (let year = 0; year < investmentHorizonYears; year++) {
        let yearlyMonthlyCapitalInvested = 0;
        for (let month = 0; month < 12; month++) {
            if (monthlyInvestmentNeeded > 0) { // Only add if needed
                currentBalance += monthlyInvestmentNeeded;
                yearlyMonthlyCapitalInvested += monthlyInvestmentNeeded;
            }
            currentBalance *= (1 + monthlyReturnRate);
        }
        totalMonthlyCapitalInvested += yearlyMonthlyCapitalInvested;
        
        // Total capital = initial + all monthly contributions so far
        const totalCapitalAtYearEnd = parsedInitialInvestment + totalMonthlyCapitalInvested;
        const capitalGains = currentBalance - totalCapitalAtYearEnd;
        
        projectionChartData.push({
            age: parsedCurrentAge + year + 1,
            capitalInvested: parseFloat(totalCapitalAtYearEnd.toFixed(0)),
            capitalGains: parseFloat(Math.max(0, capitalGains.toFixed(0))),
            totalValue: parseFloat(currentBalance.toFixed(0)),
        });
    }

    // Adjust last point if needed (optional, for chart aesthetics)
    if (projectionChartData.length > 0 && Math.abs(currentBalance - targetNestEgg) > 1 && targetNestEgg > 0) {
        const lastPoint = projectionChartData[projectionChartData.length - 1];
        const diff = targetNestEgg - lastPoint.totalValue;
        lastPoint.capitalGains = Math.max(0, lastPoint.capitalGains + diff);
        lastPoint.totalValue = targetNestEgg;
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
            assumedInflationRatePercent: parseFloat(assumedInflationRate) * 100, // Store as percentage
            investmentHorizonYears: investmentHorizonYears,
            instrumentName: instrumentDetail.name,
            grossAnnualReturn: `${(instrumentDetail.grossReturn * 100).toFixed(1)}%`,
            expenseRatio: `${(instrumentDetail.expenseRatio * 100).toFixed(4)}%`,
            netAnnualReturn: `${(netAnnualReturn * 100).toFixed(2)}%`,
            safeWithdrawalRate: `${(SAFE_WITHDRAWAL_RATE * 100)}%`,
        }
    };
}