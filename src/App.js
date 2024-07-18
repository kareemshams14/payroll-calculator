import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CanadaFlag from './canada-flag.png';

function App() {
  const [hourlyRate, setHourlyRate] = useState('');
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

    const totalAdminCost = annualSalary * adminCost;
    const totalBudgetCAD = annualSalary + cppContribution + eiContribution + ehtContribution + vacationPay + holidayPay + totalAdminCost;
    const totalBudgetUSD = totalBudgetCAD * conversionRateUSD;

    const employeeTotalDeductionsCAD = employeeCpp + employeeEi;
    const employeeNetPayBeforeTax = annualSalary - employeeTotalDeductionsCAD;

    // Calculate federal and provincial taxes
    const federalTax = calculateFederalTax(employeeNetPayBeforeTax);
    const provincialTax = calculateProvincialTax(employeeNetPayBeforeTax);
    const totalTax = federalTax + provincialTax;

    const employeeNetPayCAD = employeeNetPayBeforeTax - totalTax;
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
      employeeTotalDeductionsCAD: (employeeTotalDeductionsCAD + totalTax).toFixed(2),
      employeeNetPayCAD: employeeNetPayCAD.toFixed(2),
      employeeNetPayUSD: employeeNetPayUSD.toFixed(2),
      hourlyRate: hourly.toFixed(2),
      adminCostPercentage: adminCost ? (adminCost * 100).toFixed(2) : '0.00',
      vacationPayPercentage: vacationPayRate ? (vacationPayRate * 100).toFixed(2) : '0.00',
      conversionRateUSD,
      federalTax: federalTax.toFixed(2),
      provincialTax: provincialTax.toFixed(2),
      totalTax: totalTax.toFixed(2),
    });
  };

  const calculateFederalTax = (income) => {
    let tax = 0;
    if (income <= 53359) {
      tax = income * 0.15;
    } else if (income <= 106717) {
      tax = (income - 53359) * 0.205 + 53359 * 0.15;
    } else if (income <= 166525) {
      tax = (income - 106717) * 0.26 + (106717 - 53359) * 0.205 + 53359 * 0.15;
    } else if (income <= 237302) {
      tax = (income - 166525) * 0.29 + (166525 - 106717) * 0.26 + (106717 - 53359) * 0.205 + 53359 * 0.15;
    } else {
      tax = (income - 237302) * 0.33 + (237302 - 166525) * 0.29 + (166525 - 106717) * 0.26 + (106717 - 53359) * 0.205 + 53359 * 0.15;
    }
    return tax;
  };

  const calculateProvincialTax = (income) => {
    let tax = 0;
    if (income <= 47630) {
      tax = income * 0.0505;
    } else if (income <= 95359) {
      tax = (income - 47630) * 0.0915 + 47630 * 0.0505;
    } else if (income <= 117470) {
      tax = (income - 95359) * 0.1116 + (95359 - 47630) * 0.0915 + 47630 * 0.0505;
    } else if (income <= 139839) {
      tax = (income - 117470) * 0.1216 + (117470 - 95359) * 0.1116 + (95359 - 47630) * 0.0915 + 47630 * 0.0505;
    } else {
      tax = (income - 139839) * 0.1316 + (139839 - 117470) * 0.1216 + (117470 - 95359) * 0.1116 + (95359 - 47630) * 0.0915 + 47630 * 0.0505;
    }
    return tax;
  };

  const renderResult = () => {
    if (!result) return null;

    const annualEmployerCosts = parseFloat(result.totalBudgetCAD) - parseFloat(result.annualSalary);
    
    return (
      <div className="result mt-4 p-3 bg-light">
        <h4 className="text-center">Salary Details</h4>
        <p><strong>Gross Annual Salary:</strong> CAD {result.annualSalary}</p>
        <p><strong>Annual Employer Costs:</strong> CAD {annualEmployerCosts.toFixed(2)}</p>
        <p><strong>Total Annual Cost:</strong> CAD {result.totalBudgetCAD}</p>
        <p><strong>Net Annual Salary:</strong> CAD {result.employeeNetPayCAD}</p>
        
        <div className="details mt-3">
          <h5>Details:</h5>
          <p><strong>CPP Contribution (Employer):</strong> CAD {result.cppContribution}</p>
          <p><strong>EI Contribution (Employer):</strong> CAD {result.eiContribution}</p>
          <p><strong>EHT Contribution (Employer):</strong> CAD {result.ehtContribution}</p>
          <p><strong>Vacation Pay (Employer):</strong> CAD {result.vacationPay}</p>
          <p><strong>Holiday Pay (Employer):</strong> CAD {result.holidayPay}</p>
          <p><strong>Total Admin Cost:</strong> CAD {result.totalAdminCost}</p>
          <p><strong>Total Budget (Employer) Annually:</strong> CAD {result.totalBudgetCAD}</p>
          <p><strong>Total Budget (Employer) Annually:</strong> USD {result.totalBudgetUSD}</p>
          <p><strong>Total Budget (Employer) Hourly:</strong> CAD {(result.totalBudgetCAD / 2080).toFixed(2)}</p>
          <p><strong>Total Budget (Employer) Hourly:</strong> USD {(result.totalBudgetUSD / 2080).toFixed(2)}</p>
          <h5>Employee Net Pay:</h5>
          <p><strong>Total Deductions (Employee):</strong> CAD {result.employeeTotalDeductionsCAD}</p>
          <p><strong>Net Pay (Employee) Annually:</strong> CAD {result.employeeNetPayCAD}</p>
          <p><strong>Net Pay (Employee) Annually:</strong> USD {result.employeeNetPayUSD}</p>
          <p><strong>Net Pay (Employee) Hourly:</strong> CAD {(result.employeeNetPayCAD / 2080).toFixed(2)}</p>
          <p><strong>Net Pay (Employee) Hourly:</strong> USD {(result.employeeNetPayUSD / 2080).toFixed(2)}</p>
          <h5>Taxes:</h5>
          <p><strong>Federal Tax:</strong> CAD {result.federalTax}</p>
          <p><strong>Provincial Tax:</strong> CAD {result.provincialTax}</p>
          <p><strong>Total Tax:</strong> CAD {result.totalTax}</p>
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
            Payroll Employer Contributions Calculator for Canada (CAD)
          </h2>

          <div className="mb-3">
            <label htmlFor="hourlyRate" className="form-label">Hourly Rate (CAD):</label>
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
