"use client";
import React from 'react';
import { format, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';

function sumExpenses(expenses) {
  return expenses.reduce((sum, exp) => sum + exp.price, 0);
}

export default function ReportSummary({ allExpenses }) {
  const today = allExpenses.filter((e) => isToday(parseISO(e.date)));
  const week = allExpenses.filter((e) => isThisWeek(parseISO(e.date), { weekStartsOn: 1 }));
  const month = allExpenses.filter((e) => isThisMonth(parseISO(e.date)));

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
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
    </div>
  );
} 