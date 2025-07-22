'use client';
import React from 'react';

const tabs = [
  { key: 'farm', label: 'Farm Expenses' },
  { key: 'garden', label: 'Garden Expenses' },
  { key: 'report', label: 'Reports' },
];

export default function Tabs({ activeTab, onTabChange }) {
  return (
    <nav className="flex justify-around bg-white shadow-md rounded-lg my-2 mx-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`flex-1 py-3 text-sm font-medium focus:outline-none transition-colors duration-200 ${
            activeTab === tab.key ? 'text-green-700 border-b-2 border-green-600 bg-green-50' : 'text-gray-500'
          }`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
} 