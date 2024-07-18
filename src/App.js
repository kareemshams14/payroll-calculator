import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CanadaFlag from './canada-flag.png';

function App() {
  const [hourlyRate, setHourlyRate] = useState('');
  const [country, setCountry] = useState('Canada');
  const [currency, setCurrency] = useState('CAD');
  const [adminCostPercentage, setAdminCostPercentage] = useState('');
  const [vacationPayPercentage, setVacationPayPercentage] = useState(4); // Default to 4%
  const [result, setResult] = useState(null);

  const calculateContributions = () => {
    const hourly = parseFloat(hourlyRate);
    const annualHours = 2080; // Assuming 2080 hours annually
    const adminCost = parseFloat(adminCostPercentage) / 100 || 0;
    const vacationPayRate = parseFloat(vacationPayPercentage) / 100;

    if (isNaN(hourly)) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const annualSalary = hourly * annualHours;

    // Conversion rates (example values, should be updated with real-time rates if possible)
    const conversionRateUSD = 0.75;

    // Canada contributions
    let cppContribution = 0;
    let eiContribution = 0;
    let ehtContribution = 0;
    let vacationPay = 0;
    let holidayPay = 0;
    let employeeCpp = 0;
    let employeeEi = 0;

    if (country === 'Canada') {
      const cppRate = 0.0595;
      const cppMaxContribution = 3755.45;
      cppContribution = Math.min((annualSalary - 3500) * cppRate, cppMaxContribution);
      employeeCpp = cppContribution;

      const eiRate = 0.0221;
      const eiMaxContribution = 889.54; // Employee max contribution
      eiContribution = Math.min(annualSalary * eiRate, eiMaxContribution);
      employeeEi = eiContribution;

      const ehtRate = 0.0195;
      ehtContribution = annualSalary * ehtRate;

      vacationPay = vacationPayRate ? annualSalary * vacationPayRate : 0;
      holidayPay = hourly * 8 * 9;
    }

    const totalAdminCost = annualSalary * adminCost;
    const totalBudgetCAD = annualSalary + cppContribution + eiContribution + ehtContribution + vacationPay + holidayPay + totalAdminCost;
    const totalBudgetUSD = totalBudgetCAD * conversionRateUSD;

    const employeeTotalDeductionsCAD = employeeCpp + employeeEi;
    const employeeNetPayCAD = annualSalary - employeeTotalDeductionsCAD;
    const employeeNetPayUSD = employeeNetPayCAD * conversionRateUSD;

    setResult({
      annualSalary: annualSalary.toFixed(2),
      cppContribution: cppContribution.toFixed(2),
      eiContribution: eiContribution.toFixed(2),
      ehtContribution: ehtContribution.toFixed(2),
      vacationPay: vacationPay.toFixed(2),
      holidayPay: holidayPay.toFixed(2),
      totalAdminCost: totalAdminCost.toFixed(2),
      totalBudgetCAD: totalBudgetCAD.toFixed(2),
      totalBudgetUSD: totalBudgetUSD.toFixed(2),
      employeeTotalDeductionsCAD: employeeTotalDeductionsCAD.toFixed(2),
      employeeNetPayCAD: employeeNetPayCAD.toFixed(2),
      employeeNetPayUSD: employeeNetPayUSD.toFixed(2),
      hourlyRate: hourly.toFixed(2),
      adminCostPercentage: adminCost ? (adminCost * 100).toFixed(2) : '0.00',
      vacationPayPercentage: vacationPayRate ? (vacationPayRate * 100).toFixed(2) : '0.00',
      conversionRateUSD,
    });
  };

  const renderResult = () => {
    if (!result) return null;

    const annualEmployerCosts = parseFloat(result.totalBudgetCAD) - parseFloat(result.annualSalary);
    // Commented out unused variables
    // const monthlyGrossSalary = (parseFloat(result.annualSalary) / 12).toFixed(2);
    // const monthlyEmployerCosts = (annualEmployerCosts / 12).toFixed(2);
    // const monthlyTotalCost = (parseFloat(result.totalBudgetCAD) / 12).toFixed(2);
    // const monthlyNetPay = (parseFloat(result.employeeNetPayCAD) / 12).toFixed(2);
    // const hourlyGrossSalary = (parseFloat(result.annualSalary) / 2080).toFixed(2);
    // const hourlyEmployerCosts = (annualEmployerCosts / 2080).toFixed(2);
    // const hourlyTotalCost = (parseFloat(result.totalBudgetCAD) / 2080).toFixed(2);
    // const hourlyNetPay = (parseFloat(result.employeeNetPayCAD) / 2080).toFixed(2);

    return (
      <div className="result mt-4 p-3 bg-light">
        <h4 className="text-center">Salary Details</h4>
        <p><strong>Gross Annual Salary:</strong> {currency} {result.annualSalary}</p>
        <p><strong>Annual Employer Costs:</strong> {currency} {annualEmployerCosts.toFixed(2)}</p>
        <p><strong>Total Annual Cost:</strong> {currency} {result.totalBudgetCAD}</p>
        <p><strong>Net Annual Salary:</strong> {currency} {result.employeeNetPayCAD}</p>
        
        <div className="details mt-3">
          <h5>Details:</h5>
          <p><strong>CPP Contribution (Employer):</strong> {currency} {result.cppContribution}</p>
          <p><strong>EI Contribution (Employer):</strong> {currency} {result.eiContribution}</p>
          <p><strong>EHT Contribution (Employer):</strong> {currency} {result.ehtContribution}</p>
          <p><strong>Vacation Pay (Employer):</strong> {currency} {result.vacationPay}</p>
          <p><strong>Holiday Pay (Employer):</strong> {currency} {result.holidayPay}</p>
          <p><strong>Total Admin Cost:</strong> {currency} {result.totalAdminCost}</p>
          <p><strong>Total Budget (Employer) Annually:</strong> {currency} {result.totalBudgetCAD}</p>
          <p><strong>Total Budget (Employer) Annually:</strong> USD {result.totalBudgetUSD}</p>
          <p><strong>Total Budget (Employer) Hourly:</strong> {currency} {(result.totalBudgetCAD / 2080).toFixed(2)}</p>
          <p><strong>Total Budget (Employer) Hourly:</strong> USD {(result.totalBudgetUSD / 2080).toFixed(2)}</p>
          <h5>Employee Net Pay:</h5>
          <p><strong>Total Deductions (Employee):</strong> {currency} {result.employeeTotalDeductionsCAD}</p>
          <p><strong>Net Pay (Employee) Annually:</strong> {currency} {result.employeeNetPayCAD}</p>
          <p><strong>Net Pay (Employee) Annually:</strong> USD {result.employeeNetPayUSD}</p>
          <p><strong>Net Pay (Employee) Hourly:</strong> {currency} {(result.employeeNetPayCAD / 2080).toFixed(2)}</p>
          <p><strong>Net Pay (Employee) Hourly:</strong> USD {(result.employeeNetPayUSD / 2080).toFixed(2)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center">
            <img src={CanadaFlag} alt="Canada Flag" width="30" height="20" className="mr-2" />
            Payroll Employer Contributions Calculator
          </h2>

          <div className="mb-3">
            <label htmlFor="country" className="form-label">Country:</label>
            <input
              type="text"
              id="country"
              className="form-control"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="currency" className="form-label">Currency:</label>
            <input
              type="text"
              id="currency"
              className="form-control"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="hourlyRate" className="form-label">Hourly Rate ({currency}):</label>
            <input
              type="number"
              id="hourlyRate"
              className="form-control"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="adminCostPercentage" className="form-label">Admin Cost Percentage (optional):</label>
            <input
              type="number"
              id="adminCostPercentage"
              className="form-control"
              value={adminCostPercentage}
              onChange={(e) => setAdminCostPercentage(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="vacationPayPercentage" className="form-label">Vacation Pay Percentage (optional):</label>
            <input
              type="number"
              id="vacationPayPercentage"
              className="form-control"
              value={vacationPayPercentage}
              onChange={(e) => setVacationPayPercentage(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100" onClick={calculateContributions}>Calculate</button>
          {renderResult()}
        </div>
      </div>
    </div>
  );
}

export default App;
