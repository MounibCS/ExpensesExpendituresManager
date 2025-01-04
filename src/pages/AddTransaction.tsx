import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { TransactionCategory, TransactionType } from '../types/transaction';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function AddTransaction() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const addTransactionMutation = useMutation(api.transactions.addTransaction);

  const navigate = useNavigate();
  const { dispatch } = useTransactions();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Other' as TransactionCategory,
    type: 'expense' as TransactionType,
    notes: '',
  });

  const categories: TransactionCategory[] = [
    'Groceries',
    'Transportation',
    'Entertainment',
    'Housing',
    'Utilities',
    'Healthcare',
    'Education',
    'Shopping',
    'Salary',
    'Investment',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(isAuthenticated && user ){

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          _id: crypto.randomUUID(),
          ...formData,
          amount: parseFloat(formData.amount),
        },
      });
      console.log(user, {
        _id: crypto.randomUUID(),
        ...formData,
        amount: parseFloat(formData.amount),
      })
      addTransactionMutation({
        userId: user.email,
        name: formData.name,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        type: formData.type,
        notes: formData.notes
      });
    }else{
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          _id: crypto.randomUUID(),
          ...formData,
          amount: parseFloat(formData.amount),
        },
      });

    }
    navigate('/transactions');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Transaction</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
          <div className="mt-2 grid grid-cols-2 gap-4">
            {['income', 'expense'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, type: type as TransactionType })}
                className={`py-2 px-4 rounded-md capitalize ${
                  formData.type === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Transaction Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (DZD)
          </label>
          <input
            type="number"
            id="amount"
            required
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  );
}