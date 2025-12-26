'use client';
import React, { useState } from 'react';
import { format } from 'date-fns';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);
  if (!expenses.length) {
    return <div className="text-center text-gray-400 py-6">No expenses yet.</div>;
  }
  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  const handleDelete = (exp, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this expense?')) {
      onDelete(exp);
    }
  };
  return (
    <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow p-2">
      {sorted.map((exp) => {
        const expId = exp._id || exp.id;
        const expanded = expandedId === expId;
        return (
          <li key={expId} className="py-2 px-1">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedId(expanded ? null : expId)}>
              <div>
                <div className="font-medium text-gray-800">{format(new Date(exp.date), 'MMM d, yyyy')}</div>
                <div className="text-xs text-gray-500">Paid: ₹{exp.amountPaid?.toFixed(2) ?? '0.00'}</div>
                <div className="text-xs text-gray-400">{exp.remarks}</div>
              </div>
              <div className="flex gap-1 items-center">
                <button
                  className="text-xs text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50 ml-2"
                  onClick={e => { e.stopPropagation(); onEdit(exp); }}
                >Edit</button>
                <button
                  className="text-xs text-red-600 border border-red-200 rounded px-2 py-1 hover:bg-red-50 ml-1"
                  title="Delete"
                  onClick={e => handleDelete(exp, e)}
                >Delete</button>
              </div>
            </div>
            {expanded && (
              <div className="mt-2 bg-gray-50 rounded p-2 text-xs text-gray-700">
                <div><span className="font-semibold">Item:</span> {exp.item}</div>
                <div><span className="font-semibold">Total Amount:</span> ₹{exp.totalAmount?.toFixed(2) ?? '0.00'}</div>
                <div><span className="font-semibold">Amount Paid:</span> ₹{exp.amountPaid?.toFixed(2) ?? '0.00'}</div>
                <div><span className="font-semibold">Balance:</span> ₹{exp.balance?.toFixed(2) ?? '0.00'}</div>
                <div><span className="font-semibold">Remarks:</span> {exp.remarks || '-'}</div>
                <div><span className="font-semibold">Date:</span> {format(new Date(exp.date), 'yyyy-MM-dd')}</div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
} 