'use client';

import React, { useState, useEffect } from 'react';
import Tabs from './components/Tabs';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ReportSummary from './components/ReportSummary';

const STORAGE_KEYS = {
  farm: 'expenses_farm',
  garden: 'expenses_garden',
};

function getStoredExpenses(key) {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function setStoredExpenses(key, expenses) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(expenses));
}

function toCSV(arr) {
  if (!arr.length) return '';
  const header = Object.keys(arr[0]).join(',');
  const rows = arr.map(obj => Object.values(obj).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
  return [header, ...rows].join('\n');
}

function fromCSV(csv) {
  const [header, ...lines] = csv.trim().split(/\r?\n/);
  const keys = header.split(',');
  return lines.map(line => {
    const values = line.match(/("[^"]*"|[^,]+)/g).map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
    const obj = {};
    keys.forEach((k, i) => { obj[k] = values[i]; });
    // Convert numbers
    if (obj.totalAmount) obj.totalAmount = parseFloat(obj.totalAmount);
    if (obj.amountPaid) obj.amountPaid = parseFloat(obj.amountPaid);
    if (obj.balance) obj.balance = parseFloat(obj.balance);
    if (obj.id) obj.id = Number(obj.id);
    return obj;
  });
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('farm');
  const [farmExpenses, setFarmExpenses] = useState([]);
  const [gardenExpenses, setGardenExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    setFarmExpenses(getStoredExpenses(STORAGE_KEYS.farm));
    setGardenExpenses(getStoredExpenses(STORAGE_KEYS.garden));
  }, []);

  // Save to localStorage when expenses change
  useEffect(() => {
    setStoredExpenses(STORAGE_KEYS.farm, farmExpenses);
  }, [farmExpenses]);
  useEffect(() => {
    setStoredExpenses(STORAGE_KEYS.garden, gardenExpenses);
  }, [gardenExpenses]);

  const handleAddExpense = (expense) => {
    if (activeTab === 'farm') {
      setFarmExpenses((prev) => [expense, ...prev]);
    } else if (activeTab === 'garden') {
      setGardenExpenses((prev) => [expense, ...prev]);
    }
  };

  const handleEditExpense = (expense) => {
    setEditExpense(expense);
  };

  const handleUpdateExpense = (updated) => {
    if (activeTab === 'farm') {
      setFarmExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    } else if (activeTab === 'garden') {
      setGardenExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    }
    setEditExpense(null);
  };

  const handleCancelEdit = () => setEditExpense(null);

  const handleDeleteExpense = (expense) => {
    if (activeTab === 'farm') {
      setFarmExpenses((prev) => prev.filter((e) => e.id !== expense.id));
    } else if (activeTab === 'garden') {
      setGardenExpenses((prev) => prev.filter((e) => e.id !== expense.id));
    }
    if (editExpense && editExpense.id === expense.id) setEditExpense(null);
  };

  // CSV Export: all data
  const handleExportCSV = () => {
    const all = [
      ...farmExpenses.map(e => ({ ...e, category: 'farm' })),
      ...gardenExpenses.map(e => ({ ...e, category: 'garden' })),
    ];
    const csv = toCSV(all);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import: merge data
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const arr = fromCSV(text);
      const farm = arr.filter(e => e.category === 'farm');
      const garden = arr.filter(e => e.category === 'garden');
      setFarmExpenses(farm.concat(farmExpenses.filter(e => !farm.some(f => f.id === e.id))));
      setGardenExpenses(garden.concat(gardenExpenses.filter(e => !garden.some(g => g.id === e.id))));
    };
    reader.readAsText(file);
    // Reset file input so same file can be re-imported if needed
    e.target.value = '';
  };

  let content;
  if (activeTab === 'farm' || activeTab === 'garden') {
    const expenses = activeTab === 'farm' ? farmExpenses : gardenExpenses;
    content = (
      <>
        <ExpenseForm
          onAddExpense={handleAddExpense}
          editExpense={editExpense}
          onUpdateExpense={handleUpdateExpense}
          onCancelEdit={handleCancelEdit}
        />
        <div className="mt-4">
          <ExpenseList expenses={expenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
        </div>
      </>
    );
  } else if (activeTab === 'report') {
    const allExpenses = [
      ...farmExpenses.map(e => ({ ...e, category: 'farm' })),
      ...gardenExpenses.map(e => ({ ...e, category: 'garden' })),
    ];
    content = <ReportSummary allExpenses={allExpenses} onExportCSV={handleExportCSV} onImportCSV={handleImportCSV} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-gray-50">
      <h1 className="text-2xl font-bold text-center text-green-700 mt-6 mb-2">Farm & Garden Expense Tracker</h1>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 px-2 py-2">{content}</main>
      <footer className="text-xs text-gray-400 text-center py-4">Made with ❤️ by Nakul • 2025</footer>
    </div>
  );
}
