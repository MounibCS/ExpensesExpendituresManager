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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add New Transaction</h1>
        <p className="text-gray-500 mt-2">Enter the details of your new transaction below</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg">
        <div className="space-y-6">
          {/* Transaction Type Selector */}
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction Type</label>
            <div className="grid grid-cols-2 gap-4">
              {['income', 'expense'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type as TransactionType })}
                  className={`py-3 px-4 rounded-lg capitalize transition-all duration-200 ease-in-out ${
                    formData.type === type
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Name */}
          <div className="form-group">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Transaction Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 ease-in-out text-gray-700"
              placeholder="Enter transaction name"
            />
          </div>

          {/* Amount and Date Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div className="form-group">
              <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">DZD</span>
                <input
                  type="number"
                  id="amount"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 ease-in-out text-gray-700"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Date */}
            <div className="form-group">
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 ease-in-out text-gray-700"
              />
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 ease-in-out text-gray-700 bg-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 ease-in-out text-gray-700 min-h-[100px]"
              placeholder="Add any additional notes here..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 mt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="px-6 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
          >
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  );
}