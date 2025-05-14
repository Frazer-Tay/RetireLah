// retire-lah-client/src/utils/calculator.js

export const INSTRUMENT_DETAILS = {
    spy: { name: "SPY (S&P 500)", grossReturn: 0.10, expenseRatio: 0.000945 },
    qqq: { name: "QQQ (Tech Focused)", grossReturn: 0.13, expenseRatio: 0.0020 },
};

const SAFE_WITHDRAWAL_RATE = 0.04;
const MAX_YEARS_TO_PROJECT = 70; // Safety limit for time to FIRE calculation

// --- HELPER: Calculate Target Nest Egg ---
function calculateTargetNestEgg(parsedLifestyleToday, investmentHorizonYears, inflationRateForCalc) {
    const futureMonthlyLifestyleCost = parsedLifestyleToday * Math.pow(1 + inflationRateForCalc, investmentHorizonYears);
    const annualExpensesAtRetirement = futureMonthlyLifestyleCost * 12;
    return {
        targetNestEgg: annualExpensesAtRetirement / SAFE_WITHDRAWAL_RATE,
        futureMonthlyLifestyleCost: futureMonthlyLifestyleCost
    };
}


// --- MODE 1: Calculate Monthly Savings Needed (Existing Logic Refactored) ---
export function calculateMonthlySavingsNeeded(inputs) {
    const { 
        currentAge, retirementAge, desiredMonthlyLifestyleToday,
        assumedInflationRate, initialInvestment = 0, instrument 
    } = inputs;

    // Basic Validations (can be expanded as before)
    const parsedCurrentAge = parseInt(currentAge);
    const parsedRetirementAge = parseInt(retirementAge);
    if (parsedRetirementAge <= parsedCurrentAge) throw new Error("Retirement age must be greater than current age.");
    // ... (add other necessary validations from previous full script for this mode)

    const parsedLifestyleToday = parseFloat(desiredMonthlyLifestyleToday);
    const inflationRateForCalc = parseFloat(assumedInflationRate) / 100;
    const parsedInitialInvestment = parseFloat(initialInvestment);

    const investmentHorizonYears = parsedRetirementAge - parsedCurrentAge;
    const investmentHorizonMonths = investmentHorizonYears * 12;

    const { targetNestEgg, futureMonthlyLifestyleCost } = calculateTargetNestEgg(parsedLifestyleToday, investmentHorizonYears, inflationRateForCalc);

    const instrumentDetail = INSTRUMENT_DETAILS[instrument.toLowerCase()];
    const netAnnualReturn = instrumentDetail.grossReturn - instrumentDetail.expenseRatio;
    const monthlyReturnRate = Math.pow(1 + netAnnualReturn, 1 / 12) - 1;

    let futureValueOfInitialInvestment = 0;
    if (parsedInitialInvestment > 0 && monthlyReturnRate !== -1) {
         futureValueOfInitialInvestment = parsedInitialInvestment * Math.pow(1 + monthlyReturnRate, investmentHorizonMonths);
    }

    const remainingTarget = targetNestEgg - futureValueOfInitialInvestment;
    let monthlyInvestmentNeeded;
    // ... (monthlyInvestmentNeeded calculation logic from previous full script) ...
    if (remainingTarget <= 0) {
        monthlyInvestmentNeeded = 0; 
    } else if (investmentHorizonMonths <= 0) {
        monthlyInvestmentNeeded = remainingTarget > 0 ? Infinity : 0;
    } else if (monthlyReturnRate === 0) {
        monthlyInvestmentNeeded = remainingTarget / investmentHorizonMonths;
    } else {
        const numerator = remainingTarget * monthlyReturnRate;
        const denominator = Math.pow(1 + monthlyReturnRate, investmentHorizonMonths) - 1;
        monthlyInvestmentNeeded = (denominator === 0) ? (remainingTarget / investmentHorizonMonths) : (numerator / denominator);
    }
    if (monthlyInvestmentNeeded < 0 || !isFinite(monthlyInvestmentNeeded)) {
        monthlyInvestmentNeeded = (remainingTarget > 0 && isFinite(remainingTarget) && investmentHorizonMonths > 0) ? Infinity : 0;
    }


    // Projection Chart Data for this mode
    const projectionChartData = [];
    let currentBalance = parsedInitialInvestment;
    let totalMonthlyCapitalInvested = 0;
    if (isFinite(monthlyInvestmentNeeded)) {
        for (let year = 0; year < investmentHorizonYears; year++) {
            // ... (chart data calculation from previous full script) ...
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
        if (projectionChartData.length > 0 && targetNestEgg > 0 && isFinite(targetNestEgg) && Math.abs(currentBalance - targetNestEgg) > 1) {
            const lastPoint = projectionChartData[projectionChartData.length - 1];
            const diff = targetNestEgg - lastPoint.totalValue;
            lastPoint.capitalGains = Math.max(0, lastPoint.capitalGains + diff);
            lastPoint.totalValue = parseFloat(targetNestEgg.toFixed(0));
        }
    }

    return {
        targetNestEgg: parseFloat(targetNestEgg.toFixed(2)),
        monthlyInvestmentNeeded: parseFloat(monthlyInvestmentNeeded.toFixed(2)),
        projectionChartData,
        assumptions: { /* ... fill with relevant assumptions ... */ 
            mode: "calculateMonthlySavings", currentAge: parsedCurrentAge, retirementAge: parsedRetirementAge,
            initialInvestment: parsedInitialInvestment, desiredMonthlyLifestyleToday: parsedLifestyleToday,
            futureMonthlyLifestyleCost: parseFloat(futureMonthlyLifestyleCost.toFixed(2)),
            assumedInflationRatePercent: parseFloat(assumedInflationRate), investmentHorizonYears: investmentHorizonYears,
            instrumentName: instrumentDetail.name, grossAnnualReturn: `${(instrumentDetail.grossReturn * 100).toFixed(1)}%`,
            expenseRatio: `${(instrumentDetail.expenseRatio * 100).toFixed(4)}%`,
            netAnnualReturn: `${(netAnnualReturn * 100).toFixed(2)}%`,
            safeWithdrawalRate: `${(SAFE_WITHDRAWAL_RATE * 100)}%`,
        }
    };
}


// --- MODE 2: Calculate Time to FIRE ---
export function calculateTimeToFIRE(inputs) {
    const { 
        currentAge, 
        // retirementAge, // Not an input for this mode
        desiredMonthlyLifestyleToday,
        assumedInflationRate, 
        initialInvestment = 0, 
        plannedMonthlyInvestment, // New input
        instrument 
    } = inputs;

    const parsedCurrentAge = parseInt(currentAge);
    const parsedLifestyleToday = parseFloat(desiredMonthlyLifestyleToday);
    const inflationRateForCalc = parseFloat(assumedInflationRate) / 100;
    const parsedInitialInvestment = parseFloat(initialInvestment);
    const parsedPlannedMonthlyInvestment = parseFloat(plannedMonthlyInvestment);

    // Basic Validations
    if (isNaN(parsedPlannedMonthlyInvestment) || parsedPlannedMonthlyInvestment <= 0) {
        throw new Error("Planned monthly investment must be a positive number.");
    }
    // ... (add other necessary validations from previous full script for this mode) ...

    const instrumentDetail = INSTRUMENT_DETAILS[instrument.toLowerCase()];
    const netAnnualReturn = instrumentDetail.grossReturn - instrumentDetail.expenseRatio;
    const monthlyReturnRate = Math.pow(1 + netAnnualReturn, 1 / 12) - 1;

    let currentBalance = parsedInitialInvestment;
    let yearsToFIRE = 0;
    let ageAtFIRE = parsedCurrentAge;
    let totalMonthlyCapitalInvested = 0;
    const projectionChartData = [];
    let finalTargetNestEgg = 0;
    let futureMonthlyCostAtFIRE = 0;

    // Iterative calculation
    for (let year = 0; year < MAX_YEARS_TO_PROJECT; year++) {
        yearsToFIRE = year + 1;
        ageAtFIRE = parsedCurrentAge + yearsToFIRE;

        // Calculate target nest egg for *this specific year* of retirement
        const { targetNestEgg: yearlyTargetNestEgg, futureMonthlyLifestyleCost } = calculateTargetNestEgg(parsedLifestyleToday, yearsToFIRE, inflationRateForCalc);
        futureMonthlyCostAtFIRE = futureMonthlyLifestyleCost;
        finalTargetNestEgg = yearlyTargetNestEgg; // Keep updating until condition met

        // Accumulate investments for one year
        let yearlyCapitalInvested = 0;
        for (let month = 0; month < 12; month++) {
            currentBalance += parsedPlannedMonthlyInvestment;
            yearlyCapitalInvested += parsedPlannedMonthlyInvestment;
            currentBalance *= (1 + monthlyReturnRate);
        }
        totalMonthlyCapitalInvested += yearlyCapitalInvested;
        
        const totalCapitalAtYearEnd = parsedInitialInvestment + totalMonthlyCapitalInvested;
        const capitalGains = currentBalance - totalCapitalAtYearEnd;

        projectionChartData.push({
            age: parsedCurrentAge + year + 1,
            capitalInvested: parseFloat(totalCapitalAtYearEnd.toFixed(0)),
            capitalGains: parseFloat(Math.max(0, capitalGains.toFixed(0))),
            totalValue: parseFloat(currentBalance.toFixed(0)),
        });

        if (currentBalance >= yearlyTargetNestEgg) {
            // Optional: Fine-tune to the exact month (more complex)
            // For now, we'll stick to year-end check.
            break; // FIRE achieved
        }

        if (year === MAX_YEARS_TO_PROJECT - 1) { // Safety break
            // FIRE not achieved within MAX_YEARS
            return {
                targetNestEgg: parseFloat(finalTargetNestEgg.toFixed(2)), // Target at max years
                ageAtFIRE: Infinity, // Indicates not achieved
                yearsToFIRE: Infinity,
                projectionChartData, // Show projection up to max years
                assumptions: { /* ... assumptions ... */ 
                    mode: "calculateTimeToFIRE", currentAge: parsedCurrentAge, plannedMonthlyInvestment: parsedPlannedMonthlyInvestment,
                    initialInvestment: parsedInitialInvestment, desiredMonthlyLifestyleToday: parsedLifestyleToday,
                    futureMonthlyLifestyleCost: parseFloat(futureMonthlyCostAtFIRE.toFixed(2)), // At max years
                    assumedInflationRatePercent: parseFloat(assumedInflationRate), investmentHorizonYears: MAX_YEARS_TO_PROJECT,
                    instrumentName: instrumentDetail.name, grossAnnualReturn: `${(instrumentDetail.grossReturn * 100).toFixed(1)}%`,
                    expenseRatio: `${(instrumentDetail.expenseRatio * 100).toFixed(4)}%`,
                    netAnnualReturn: `${(netAnnualReturn * 100).toFixed(2)}%`,
                    safeWithdrawalRate: `${(SAFE_WITHDRAWAL_RATE * 100)}%`,
                }
            };
        }
    }
    
    // Adjust last chart point to hit the target nest egg for the FIRE year
    if (projectionChartData.length > 0 && finalTargetNestEgg > 0 && isFinite(finalTargetNestEgg) && currentBalance >= finalTargetNestEgg) {
        const lastPoint = projectionChartData[projectionChartData.length - 1];
        const diff = finalTargetNestEgg - lastPoint.totalValue;
        if (Math.abs(diff) > 1) { // Only adjust if significantly off to avoid overcorrection
            lastPoint.capitalGains = Math.max(0, lastPoint.capitalGains + diff);
            lastPoint.totalValue = parseFloat(finalTargetNestEgg.toFixed(0));
        } else { // If very close, just ensure totalValue is the target
            lastPoint.totalValue = parseFloat(finalTargetNestEgg.toFixed(0));
        }
    }


    return {
        targetNestEgg: parseFloat(finalTargetNestEgg.toFixed(2)),
        ageAtFIRE: ageAtFIRE,
        yearsToFIRE: yearsToFIRE,
        projectionChartData,
        assumptions: { /* ... fill with relevant assumptions ... */ 
            mode: "calculateTimeToFIRE", currentAge: parsedCurrentAge, plannedMonthlyInvestment: parsedPlannedMonthlyInvestment,
            initialInvestment: parsedInitialInvestment, desiredMonthlyLifestyleToday: parsedLifestyleToday,
            futureMonthlyLifestyleCost: parseFloat(futureMonthlyCostAtFIRE.toFixed(2)), // At FIRE year
            assumedInflationRatePercent: parseFloat(assumedInflationRate), investmentHorizonYears: yearsToFIRE,
            instrumentName: instrumentDetail.name, grossAnnualReturn: `${(instrumentDetail.grossReturn * 100).toFixed(1)}%`,
            expenseRatio: `${(instrumentDetail.expenseRatio * 100).toFixed(4)}%`,
            netAnnualReturn: `${(netAnnualReturn * 100).toFixed(2)}%`,
            safeWithdrawalRate: `${(SAFE_WITHDRAWAL_RATE * 100)}%`,
        }
    };
}