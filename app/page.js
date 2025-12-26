'use client';

import React, { useState, useEffect } from 'react';
import Tabs from './components/Tabs';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ReportSummary from './components/ReportSummary';

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
    return obj;
  });
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('farm');
  const [farmExpenses, setFarmExpenses] = useState([]);
  const [gardenExpenses, setGardenExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch expenses from API
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/expenses');
      if (response.ok) {
        const allExpenses = await response.json();
        setFarmExpenses(allExpenses.filter(e => e.category === 'farm'));
        setGardenExpenses(allExpenses.filter(e => e.category === 'garden'));
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...expense, category: activeTab })
      });

      if (response.ok) {
        const newExpense = await response.json();
        if (activeTab === 'farm') {
          setFarmExpenses((prev) => [newExpense, ...prev]);
        } else if (activeTab === 'garden') {
          setGardenExpenses((prev) => [newExpense, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleEditExpense = (expense) => {
    setEditExpense(expense);
  };

  const handleUpdateExpense = async (updated) => {
    try {
      const expenseId = updated._id || updated.id;
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });

      if (response.ok) {
        const updatedExpense = await response.json();
        const updatedId = updatedExpense._id || updatedExpense.id;
        if (activeTab === 'farm') {
          setFarmExpenses((prev) => prev.map((e) => ((e._id || e.id) === updatedId ? updatedExpense : e)));
        } else if (activeTab === 'garden') {
          setGardenExpenses((prev) => prev.map((e) => ((e._id || e.id) === updatedId ? updatedExpense : e)));
        }
        setEditExpense(null);
      }
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleCancelEdit = () => setEditExpense(null);

  const handleDeleteExpense = async (expense) => {
    try {
      const expenseId = expense._id || expense.id;
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        if (activeTab === 'farm') {
          setFarmExpenses((prev) => prev.filter((e) => (e._id || e.id) !== expenseId));
        } else if (activeTab === 'garden') {
          setGardenExpenses((prev) => prev.filter((e) => (e._id || e.id) !== expenseId));
        }
        const editId = editExpense?._id || editExpense?.id;
        if (editExpense && editId === expenseId) setEditExpense(null);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
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

  // CSV Import: merge data with backend
  const handleImportCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target.result;
      const arr = fromCSV(text);
      
      // Import each expense to the backend
      for (const expense of arr) {
        try {
          await fetch('/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense)
          });
        } catch (error) {
          console.error('Error importing expense:', error);
        }
      }
      
      // Refresh the list
      fetchExpenses();
    };
    reader.readAsText(file);
    // Reset file input so same file can be re-imported if needed
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
