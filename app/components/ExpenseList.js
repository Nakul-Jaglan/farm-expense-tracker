'use client';
import React from 'react';
import { format } from 'date-fns';

export default function ExpenseList({ expenses }) {
  if (!expenses.length) {
    return <div className="text-center text-gray-400 py-6">No expenses yet.</div>;
  }
  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow p-2">
      {sorted.map((exp) => (
        <li key={exp.id} className="flex justify-between items-center py-2 px-1">
          <div>
            <div className="font-medium text-gray-800">{exp.item}</div>
            <div className="text-xs text-gray-400">{format(new Date(exp.date), 'MMM d, yyyy')}</div>
          </div>
          <div className="text-green-700 font-semibold">₹{exp.price.toFixed(2)}</div>
        </li>
      ))}
    </ul>
  );
} 