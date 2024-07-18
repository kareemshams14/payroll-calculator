import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CanadaFlag from './canada-flag.png';
import MexicoFlag from './mexico-flag.png';
import './App.css'; // Custom CSS
import config from './countriesConfig.json';
import { calculateCanadaContributions, calculateCanadaTaxes } from './canada';
import { calculateMexicoContributions, calculateMexicoTaxes } from './mexico';

function App() {
  const [country, setCountry] = useState('Canada');
  const [hourlyRate, setHourlyRate] = useState('');
  const [adminCostPercentage, setAdminCostPercentage] = useState('');
  const [result, setResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const calculateContributions = () => {
    const hourly = parseFloat(hourlyRate);
    const annualHours = 2080; // Assuming 2080 hours annually
    const adminCost = parseFloat(adminCostPercentage) / 100 || 0;

    if (isNaN(hourly)) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const annualSalary = hourly * annualHours;
    const { conversionRateUSD, currency } = config[country];
    let contributions = {};
    let taxes = {};

    if (country === 'Canada') {
      contributions = calculateCanadaContributions(annualSalary);
      taxes = calculateCanadaTaxes(annualSalary);
    } else if (country === 'Mexico') {
      contributions = calculateMexicoContributions(annualSalary);
      taxes = calculateMexicoTaxes(annualSalary);
    }

    const totalAdminCost = annualSalary * adminCost;
    const totalBudget = annualSalary + Object.values(contributions).reduce((a, b) => a + b, 0) + totalAdminCost;
    const totalBudgetUSD = totalBudget * conversionRateUSD;

    const employeeTotalDeductions = Object.values(taxes).reduce((a, b) => a + b, 0);
    const employeeNetPayBeforeTax = annualSalary - employeeTotalDeductions;
    const federalTax = taxes.federalTax || 0;
    const provincialTax = taxes.provincialTax || 0;
    const totalTax = federalTax + provincialTax;

    const employeeNetPay = employeeNetPayBeforeTax - totalTax;
    const employeeNetPayUSD = employeeNetPay * conversionRateUSD;

    setResult({
      annualSalary: annualSalary.toFixed(2),
      contributions,
      totalAdminCost: totalAdminCost.toFixed(2),
      totalBudget: totalBudget.toFixed(2),
      totalBudgetUSD: totalBudgetUSD.toFixed(2),
      employeeTotalDeductions: (employeeTotalDeductions + totalTax).toFixed(2),
      employeeNetPay: employeeNetPay.toFixed(2),
      employeeNetPayUSD: employeeNetPayUSD.toFixed(2),
      hourlyRate: hourly.toFixed(2),
      adminCostPercentage: adminCost ? (adminCost * 100).toFixed(2) : '0.00',
      conversionRateUSD,
      federalTax: federalTax.toFixed(2),
      provincialTax: provincialTax.toFixed(2),
      totalTax: totalTax.toFixed(2),
      currency,
    });
  };

  const renderResult = () => {
    if (!result) return null;

    const annualEmployerCosts = parseFloat(result.totalBudget) - parseFloat(result.annualSalary);

    return (
      <div className="result mt-4 p-3 bg-light shadow-sm rounded">
        <h4 className="text-center">Salary Details</h4>
        <div className="summary">
          <p><strong>Gross Annual Salary:</strong> {result.currency} {result.annualSalary}</p>
          <p><strong>Annual Employer Costs:</strong> {result.currency} {annualEmployerCosts.toFixed(2)}</p>
          <p><strong>Total Annual Cost:</strong> {result.currency} {result.totalBudget}</p>
          <p><strong>Net Annual Salary:</strong> {result.currency} {result.employeeNetPay}</p>
        </div>

        <button className="btn btn-link text-primary" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide' : 'Show'} Detailed Salary Calculations
        </button>

        {showDetails && (
          <div className="details mt-3">
            <h5>Details:</h5>
            <div className="row">
              <div className="col-md-6">
                {Object.entries(result.contributions).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {result.currency} {value}</p>
                ))}
              </div>
              <div className="col-md-6">
                <p><strong>Total Admin Cost:</strong> {result.currency} {result.totalAdminCost}</p>
                <p><strong>Total Budget (Employer) Annually:</strong> {result.currency} {result.totalBudget}</p>
                <p><strong>Total Budget (Employer) Annually:</strong> USD {result.totalBudgetUSD}</p>
                <p><strong>Total Budget (Employer) Hourly:</strong> {result.currency} {(result.totalBudget / 2080).toFixed(2)}</p>
                <p><strong>Total Budget (Employer) Hourly:</strong> USD {(result.totalBudgetUSD / 2080).toFixed(2)}</p>
              </div>
            </div>
            <h5>Employee Net Pay:</h5>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Total Deductions (Employee):</strong> {result.currency} {result.employeeTotalDeductions}</p>
                <p><strong>Net Pay (Employee) Annually:</strong> {result.currency} {result.employeeNetPay}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Net Pay (Employee) Annually:</strong> USD {result.employeeNetPayUSD}</p>
                <p><strong>Net Pay (Employee) Hourly:</strong> {result.currency} {(result.employeeNetPay / 2080).toFixed(2)}</p>
                <p><strong>Net Pay (Employee) Hourly:</strong> USD {(result.employeeNetPayUSD / 2080).toFixed(2)}</p>
              </div>
            </div>
            <h5>Taxes:</h5>
            <p><strong>Federal Tax:</strong> {result.currency} {result.federalTax}</p>
            <p><strong>Provincial Tax:</strong> {result.currency} {result.provincialTax}</p>
            <p><strong>Total Tax:</strong> {result.currency} {result.totalTax}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            Payroll Employer Contributions Calculator for {country} 
            {country === 'Canada' && <img src={CanadaFlag} alt="Canada Flag" width="30" height="20" className="ml-2" />}
            {country === 'Mexico' && <img src={MexicoFlag} alt="Mexico Flag" width="30" height="20" className="ml-2" />}
          </h2>

          <div className="mb-3">
            <label htmlFor="country" className="form-label">Country:</label>
            <select
              id="country"
              className="form-control"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="Canada">Canada</option>
              <option value="Mexico">Mexico</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="hourlyRate" className="form-label">Hourly Rate ({config[country].currency}):</label>
            <input
              type="number"
              id="hourlyRate"
              className="form-control input-small"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="adminCostPercentage" className="form-label">Admin Cost Percentage (optional):</label>
            <input
              type="number"
              id="adminCostPercentage"
              className="form-control input-small"
              value={adminCostPercentage}
              onChange={(e) => setAdminCostPercentage(e.target.value)}
            />
          </div>

          {country === 'Canada' && (
            <div className="mb-3">
              <label htmlFor="vacationDays" className="form-label">Vacation Days (optional):</label>
              <input
                type="number"
                id="vacationDays"
                className="form-control input-small"
                value={vacationDays}
                onChange={(e) => setVacationDays(e.target.value)}
              />
            </div>
          )}

          <button className="btn btn-primary w-100" onClick={calculateContributions}>Calculate</button>
          {renderResult()}
        </div>
      </div>
    </div>
  );
}

export default App;
