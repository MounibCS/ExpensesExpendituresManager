import React, { useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth0 } from '@auth0/auth0-react';

export default function Home() {
  const { user, isAuthenticated } = useAuth0();
  const { dispatch } = useTransactions();
  const transactions = useQuery(api.transactions.getTransactions, 
    isAuthenticated && user?.email ? { userId: user.email } : "skip"
  );
  useEffect(() => {
    if (transactions) {
      console.log(transactions)
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    }
  }, [transactions]);
  const { state } = useTransactions();
  
  const totalIncome = state.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Masroofy</h1>
        <p className="mt-2 text-lg text-gray-600">Track your expenses and manage your budget effectively</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-100 p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-800">Total Income</h2>
            <ArrowUpCircle className="h-8 w-8 text-green-600" />
          </div>
          <p className="mt-4 text-3xl font-bold text-green-600">{totalIncome.toFixed(2)} DZD</p>
        </div>

        <div className="bg-red-100 p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-red-800">Total Expenses</h2>
            <ArrowDownCircle className="h-8 w-8 text-red-600" />
          </div>
          <p className="mt-4 text-3xl font-bold text-red-600">{totalExpenses.toFixed(2)} DZD</p>
        </div>

        <div className="bg-blue-100 p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-blue-800">Balance</h2>
            <Wallet className="h-8 w-8 text-blue-600" />
          </div>
          <p className="mt-4 text-3xl font-bold text-blue-600">{balance.toFixed(2)} DZD</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
        {state.transactions.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No transactions yet. Add your first transaction to get started!</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {state.transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{transaction.name}</h3>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                    <span className={`text-lg font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {transaction.amount.toFixed(2)} DZD
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}