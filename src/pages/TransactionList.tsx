import React, { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { Transaction, TransactionCategory, TransactionType } from '../types/transaction';
import { format } from 'date-fns';
import { Trash2, Filter, Pen } from 'lucide-react';
import ExportButton from '../components/ExportButton';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../components/Drawer';
import { Button } from '../components/Button';

export default function TransactionList() {
  const { user, isAuthenticated } = useAuth0();

  const { state, dispatch } = useTransactions();
  const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');

  
  const deleteTransactionMutation = useMutation(api.transactions.deleteTransaction);
  const updateTransactionMutation = useMutation(api.transactions.updateTransaction);
  
  const transactions = useQuery(api.transactions.getTransactions, 
    isAuthenticated && user?.email ? { userId: user.email } : "skip"
  );
  useEffect(() => {
    if (transactions) {
      console.log(transactions)
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    }
  }, [transactions]);


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

  const filteredTransactions = state.transactions.filter((transaction) => {
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    const matchesDate = !dateFilter || transaction.date === dateFilter;
    return matchesCategory && matchesDate;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      
      if (isAuthenticated && user?.email) {
        try {
          console.log("Deleting",id)
          deleteTransactionMutation({ id });
        } catch (error) {
          console.error('Failed to delete transaction from database:', error);
        }
      }
    }
  };

  const EditTransactionForm = ({ transaction, onClose }: { 
    transaction: Transaction, 
    onClose: () => void 
  }) => {
    const { dispatch } = useTransactions();
    const { user, isAuthenticated } = useAuth0();
    const [formData, setFormData] = useState({
      name: transaction.name,
      amount: transaction.amount.toString(),
      date: transaction.date,
      category: transaction.category,
      type: transaction.type,
      notes: transaction.notes || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const updatedTransaction = {
        ...transaction,
        ...formData,
        amount: parseFloat(formData.amount),
      };

      dispatch({
        type: 'EDIT_TRANSACTION',
        payload: updatedTransaction
      });

      if (isAuthenticated && user?.email) {
        try {
          await updateTransactionMutation({
            id: transaction._id,
            name: formData.name,
            amount: parseFloat(formData.amount),
            date: formData.date,
            category: formData.category,
            type: formData.type as TransactionType,
            notes: formData.notes
          });
        } catch (error) {
          console.error('Failed to update transaction:', error);
        }
      }

      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col justify-center items-center p-4 px-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
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
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <DrawerFooter>
          <DrawerClose>
            <Button type="submit" variant={'default'}>Submit</Button>
            <Button type="button" variant={'secondary'}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as TransactionCategory | 'all')}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <ExportButton transactions={filteredTransactions} />
        </div>
      </div>
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.name}</div>
                    {transaction.notes && (
                      <div className="text-sm text-gray-500">{transaction.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'} {transaction.amount.toFixed(2)} DZD
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <Drawer>
                        <DrawerTrigger>
                          <Pen className="h-5 w-5" />
                        </DrawerTrigger>
                        <DrawerContent className='bg-white'>
                          <DrawerHeader>
                            <DrawerTitle>Edit Transaction</DrawerTitle>
                            <DrawerDescription>Fill this form to edit this transaction.</DrawerDescription>
                          </DrawerHeader>
                          <EditTransactionForm 
                            transaction={transaction} 
                            onClose={() => document.querySelector<HTMLButtonElement>('.drawer-close')?.click()}
                          />
                        </DrawerContent>
                      </Drawer>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}