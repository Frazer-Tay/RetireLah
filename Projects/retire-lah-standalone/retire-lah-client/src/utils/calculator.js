// retire-lah-client/src/utils/calculator.js
export const LIFESTYLE_COSTS = {
    basic: 2860,
    moderate: 4910,
    affluent: 8175,
};

export const INSTRUMENT_DETAILS = {
    spy: { name: "SPY (S&P 500)", grossReturn: 0.10, expenseRatio: 0.000945 },
    qqq: { name: "QQQ (Tech Focused)", grossReturn: 0.13, expenseRatio: 0.0020 },
};

const SAFE_WITHDRAWAL_RATE = 0.04;

export function calculateRetirement(inputs) {
    const { currentAge, retirementAge, lifestyle, instrument } = inputs;

    const parsedCurrentAge = parseInt(currentAge);
    const parsedRetirementAge = parseInt(retirementAge);

    if (isNaN(parsedCurrentAge) || parsedCurrentAge < 18 || parsedCurrentAge > 99) {
        throw new Error("Invalid current age. Must be a number between 18 and 99.");
    }
    if (isNaN(parsedRetirementAge) || parsedRetirementAge > 100 || parsedRetirementAge < 19) {
        throw new Error("Invalid retirement age. Must be a number between 19 and 100.");
    }
    if (parsedRetirementAge <= parsedCurrentAge) {
        throw new Error("Retirement age must be greater than current age.");
    }
    if (!lifestyle || !LIFESTYLE_COSTS[lifestyle.toLowerCase()]) {
        throw new Error("Invalid lifestyle choice. Please select a valid option.");
    }
    if (!instrument || !INSTRUMENT_DETAILS[instrument.toLowerCase()]) {
        throw new Error("Invalid investment instrument. Please select a valid option.");
    }

    const monthlyExpenses = LIFESTYLE_COSTS[lifestyle.toLowerCase()];
    const instrumentDetail = INSTRUMENT_DETAILS[instrument.toLowerCase()];
    const annualExpenses = monthlyExpenses * 12;
    const targetNestEgg = annualExpenses / SAFE_WITHDRAWAL_RATE;
    const investmentHorizonYears = parsedRetirementAge - parsedCurrentAge;
    const investmentHorizonMonths = investmentHorizonYears * 12;
    const netAnnualReturn = instrumentDetail.grossReturn - instrumentDetail.expenseRatio;
    const monthlyReturnRate = Math.pow(1 + netAnnualReturn, 1 / 12) - 1;

    let monthlyInvestmentNeeded;
    if (monthlyReturnRate === 0) {
        monthlyInvestmentNeeded = targetNestEgg / investmentHorizonMonths;
    } else {
        const numerator = targetNestEgg * monthlyReturnRate;
        const denominator = Math.pow(1 + monthlyReturnRate, investmentHorizonMonths) - 1;
        monthlyInvestmentNeeded = (denominator === 0) ? (targetNestEgg / investmentHorizonMonths) : (numerator / denominator);
    }
    
    if (monthlyInvestmentNeeded < 0 || !isFinite(monthlyInvestmentNeeded)) {
        monthlyInvestmentNeeded = targetNestEgg > 0 ? Infinity : 0;
    }

    const projectionChartData = [];
    let currentBalance = 0;
    let totalCapitalInvested = 0;

    for (let year = 0; year < investmentHorizonYears; year++) {
        let yearlyCapitalInvestedThisYear = 0;
        for (let month = 0; month < 12; month++) {
            currentBalance += monthlyInvestmentNeeded;
            yearlyCapitalInvestedThisYear += monthlyInvestmentNeeded;
            currentBalance *= (1 + monthlyReturnRate);
        }
        totalCapitalInvested += yearlyCapitalInvestedThisYear;
        const capitalGains = currentBalance - totalCapitalInvested;
        
        projectionChartData.push({
            age: parsedCurrentAge + year + 1,
            capitalInvested: parseFloat(totalCapitalInvested.toFixed(0)),
            capitalGains: parseFloat(Math.max(0, capitalGains.toFixed(0))), // Ensure gains not negative
            totalValue: parseFloat(currentBalance.toFixed(0)),
        });
    }

    if (projectionChartData.length > 0) {
        const lastDataPoint = projectionChartData[projectionChartData.length - 1];
        if (Math.abs(lastDataPoint.totalValue - targetNestEgg) > 1 && lastDataPoint.capitalInvested <= targetNestEgg && isFinite(targetNestEgg)) {
            lastDataPoint.totalValue = parseFloat(targetNestEgg.toFixed(0));
            lastDataPoint.capitalGains = parseFloat(Math.max(0, (targetNestEgg - lastDataPoint.capitalInvested).toFixed(0)));
        }
    }

    return {
        targetNestEgg: parseFloat(targetNestEgg.toFixed(2)),
        monthlyInvestmentNeeded: parseFloat(monthlyInvestmentNeeded.toFixed(2)),
        projectionChartData,
        assumptions: {
            currentAge: parsedCurrentAge,
            lifestyleExpenses: `SGD ${monthlyExpenses.toLocaleString()}/month (future adjusted value)`,
            retirementAge: parsedRetirementAge,
            investmentHorizonYears: investmentHorizonYears,
            instrumentName: instrumentDetail.name,
            grossAnnualReturn: `${(instrumentDetail.grossReturn * 100).toFixed(1)}%`,
            expenseRatio: `${(instrumentDetail.expenseRatio * 100).toFixed(4)}%`,
            netAnnualReturn: `${(netAnnualReturn * 100).toFixed(2)}%`,
            safeWithdrawalRate: `${(SAFE_WITHDRAWAL_RATE * 100)}%`,
        }
    };
}