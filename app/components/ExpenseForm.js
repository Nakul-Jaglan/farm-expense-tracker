'use client';
import React, { useState } from 'react';
import { format } from 'date-fns';

export default function ExpenseForm({ onAddExpense }) {
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item || !price) return;
    onAddExpense({
      item,
      price: parseFloat(price),
      date,
      id: Date.now(),
    });
    setItem('');
    setPrice('');
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
        placeholder="Price"
        className="border rounded px-3 py-2 text-black"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min="0"
        step="0.01"
        required
      />
      <input
        type="date"
        className="border rounded px-3 py-2 text-black"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit" className="bg-green-600 text-white rounded py-2 mt-2 hover:bg-green-700 transition">Add Expense</button>
    </form>
  );
} 