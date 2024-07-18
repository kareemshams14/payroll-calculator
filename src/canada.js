import config from './countriesConfig.json';

export const calculateCanadaContributions = (annualSalary) => {
  const { cppRate, cppMaxContribution, eiRate, eiMaxContribution, ehtRate, holidayDays } = config.Canada;

  const cppContribution = Math.min((annualSalary - 3500) * cppRate, cppMaxContribution);
  const eiContribution = Math.min(annualSalary * eiRate, eiMaxContribution);
  const ehtContribution = annualSalary * ehtRate;
  const holidayPay = holidayDays * 8 * (annualSalary / 2080);

  return { cppContribution, eiContribution, ehtContribution, holidayPay };
};

export const calculateCanadaTaxes = (income) => {
  const { taxBrackets } = config.Canada;
  let federalTax = 0;
  let provincialTax = 0;

  for (const bracket of taxBrackets.federal) {
    if (income > bracket.upTo) {
      federalTax += bracket.upTo * bracket.rate;
    } else {
      federalTax += income * bracket.rate;
      break;
    }
    income -= bracket.upTo;
  }

  income = annualSalary;

  for (const bracket of taxBrackets.provincial) {
    if (income > bracket.upTo) {
      provincialTax += bracket.upTo * bracket.rate;
    } else {
      provincialTax += income * bracket.rate;
      break;
    }
    income -= bracket.upTo;
  }

  return { federalTax, provincialTax };
};
