import config from './countriesConfig.json';

export const calculateMexicoContributions = (annualSalary) => {
  const { socialSecurityRate, holidayDays } = config.Mexico;

  const socialSecurityContribution = annualSalary * socialSecurityRate;
  const holidayPay = holidayDays * 8 * (annualSalary / 2080);

  return { socialSecurityContribution, holidayPay };
};

export const calculateMexicoTaxes = (income) => {
  const { taxBrackets } = config.Mexico;
  let federalTax = 0;

  for (const bracket of taxBrackets.federal) {
    if (income > bracket.upTo) {
      federalTax += bracket.upTo * bracket.rate;
    } else {
      federalTax += income * bracket.rate;
      break;
    }
    income -= bracket.upTo;
  }

  return { federalTax };
};
