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

export default function Home() {
  const [activeTab, setActiveTab] = useState('farm');
  const [farmExpenses, setFarmExpenses] = useState([]);
  const [gardenExpenses, setGardenExpenses] = useState([]);

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

  let content;
  if (activeTab === 'farm' || activeTab === 'garden') {
    const expenses = activeTab === 'farm' ? farmExpenses : gardenExpenses;
    content = (
      <>
        <ExpenseForm onAddExpense={handleAddExpense} />
        <div className="mt-4">
          <ExpenseList expenses={expenses} />
        </div>
      </>
    );
  } else if (activeTab === 'report') {
    const allExpenses = [...farmExpenses, ...gardenExpenses];
    content = <ReportSummary allExpenses={allExpenses} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-gray-50">
      <h1 className="text-2xl font-bold text-center text-green-700 mt-6 mb-2">Farm & Garden Expense Tracker</h1>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 px-2 py-2">{content}</main>
      <footer className="text-xs text-gray-400 text-center py-4">Offline-ready • Data stays on your device</footer>
    </div>
  );
}
