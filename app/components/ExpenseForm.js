'use client';
import React, { useState } from 'react';
import { format } from 'date-fns';

export default function ExpenseForm({ onAddExpense, editExpense, onUpdateExpense, onCancelEdit }) {
  // If editing, prefill fields
  const isEditing = !!editExpense;
  const [item, setItem] = useState(editExpense?.item || '');
  const [totalAmount, setTotalAmount] = useState(editExpense?.totalAmount?.toString() || '');
  const [amountPaid, setAmountPaid] = useState(editExpense?.amountPaid?.toString() || '');
  const [remarks, setRemarks] = useState(editExpense?.remarks || '');
  const [date, setDate] = useState(editExpense?.date || format(new Date(), 'yyyy-MM-dd'));

  const balance = (parseFloat(totalAmount || 0) - parseFloat(amountPaid || 0)).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item || !totalAmount || !amountPaid) return;
    const expense = {
      item,
      totalAmount: parseFloat(totalAmount),
      amountPaid: parseFloat(amountPaid),
      balance: parseFloat(balance),
      remarks,
      date,
    };
    
    if (isEditing) {
      // Include the ID for updates (MongoDB uses _id)
      expense._id = editExpense._id || editExpense.id;
      expense.id = editExpense.id;
      onUpdateExpense(expense);
    } else {
      onAddExpense(expense);
    }
    
    setItem('');
    setTotalAmount('');
    setAmountPaid('');
    setRemarks('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow">
      <input
        type="text"
        placeholder="Item name"
        className="border rounded px-3 py-2 text-black"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Total Amount"
        className="border rounded px-3 py-2 text-black"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
        min="0"
        step="0.01"
        required
      />
      <input
        type="number"
        placeholder="Amount Paid"
        className="border rounded px-3 py-2 text-black"
        value={amountPaid}
        onChange={(e) => setAmountPaid(e.target.value)}
        min="0"
        step="0.01"
        required
      />
      <input
        type="text"
        placeholder="Balance (auto)"
        className="border rounded px-3 py-2 text-black bg-gray-100 cursor-not-allowed"
        value={balance}
        readOnly
        tabIndex={-1}
      />
      <input
        type="text"
        placeholder="Remarks"
        className="border rounded px-3 py-2 text-black"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />
      <input
        type="date"
        className="border rounded px-3 py-2 text-black"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <div className="flex gap-2 mt-2">
        <button type="submit" className="flex-1 bg-green-600 text-white rounded py-2 hover:bg-green-700 transition">
          {isEditing ? 'Update' : 'Add'} Expense
        </button>
        {isEditing && (
          <button type="button" className="flex-1 bg-gray-300 text-gray-700 rounded py-2 hover:bg-gray-400 transition" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
} 