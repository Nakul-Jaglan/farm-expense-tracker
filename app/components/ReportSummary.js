"use client";
import React from 'react';
import { format, isToday, isThisWeek, isThisMonth, isThisYear, parseISO, getYear, getMonth } from 'date-fns';

function sumExpenses(expenses) {
  return expenses.reduce((sum, exp) => sum + (exp.amountPaid || 0), 0);
}

function groupBy(arr, fn) {
  return arr.reduce((acc, item) => {
    const key = fn(item);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
}

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

export default function ReportSummary({ allExpenses, onExportCSV, onImportCSV }) {
  const today = allExpenses.filter((e) => isToday(parseISO(e.date)));
  const week = allExpenses.filter((e) => isThisWeek(parseISO(e.date), { weekStartsOn: 1 }));
  const month = allExpenses.filter((e) => isThisMonth(parseISO(e.date)));
  const year = allExpenses.filter((e) => isThisYear(parseISO(e.date)));

  // Group by year
  const byYear = groupBy(allExpenses, e => getYear(parseISO(e.date)));
  // Group by month (for current year)
  const byMonth = groupBy(year, e => format(parseISO(e.date), 'MMMM'));

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
      <div className="flex gap-2 mb-2">
        <button onClick={onExportCSV} className="flex-1 bg-green-100 text-green-700 rounded px-2 py-1 text-xs font-semibold hover:bg-green-200">Export CSV</button>
        <label className="flex-1 bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs font-semibold hover:bg-blue-200 cursor-pointer text-center">
          Import CSV
          <input type="file" accept=".csv" className="hidden" onChange={onImportCSV} />
        </label>
      </div>
      <div>
        <div className="text-gray-500 text-xs">Total Today</div>
        <div className="text-2xl font-bold text-green-700">₹{sumExpenses(today).toFixed(2)}</div>
      </div>
      <div>
        <div className="text-gray-500 text-xs">This Week</div>
        <div className="text-xl font-semibold text-green-600">₹{sumExpenses(week).toFixed(2)}</div>
      </div>
      <div>
        <div className="text-gray-500 text-xs">This Month</div>
        <div className="text-xl font-semibold text-green-600">₹{sumExpenses(month).toFixed(2)}</div>
      </div>
      <div>
        <div className="text-gray-500 text-xs mt-4">Yearly Report</div>
        <ul className="text-sm">
          {Object.entries(byYear).sort((a, b) => b[0] - a[0]).map(([yr, exps]) => (
            <li key={yr} className="mb-1">
              <span className="font-semibold text-green-600">{yr}:</span> ₹{sumExpenses(exps).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-gray-500 text-xs mt-4 mb-2">Month-wise Report ({new Date().getFullYear()})</div>
        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((mon, i) => (
            <div key={mon} className="bg-gray-50 rounded p-2 flex flex-col items-center border border-gray-100">
              <div className="font-semibold text-green-600 text-xs">{mon.slice(0,3)}</div>
              <div className="text-sm font-bold">₹{sumExpenses(byMonth[mon] || []).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 