import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports() {
  const { state } = useTransactions();

  // Calculate category-wise expenses
  const categoryExpenses = state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // Calculate monthly totals
  const monthlyData = state.transactions.reduce(
    (acc, t) => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      if (t.type === 'income') {
        acc.income[month] = (acc.income[month] || 0) + t.amount;
      } else {
        acc.expenses[month] = (acc.expenses[month] || 0) + t.amount;
      }
      return acc;
    },
    { income: {} as Record<string, number>, expenses: {} as Record<string, number> }
  );

  const pieChartData = {
    labels: Object.keys(categoryExpenses),
    datasets: [
      {
        data: Object.values(categoryExpenses),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
      },
    ],
  };

  const months = [...new Set([
    ...Object.keys(monthlyData.income),
    ...Object.keys(monthlyData.expenses),
  ])].sort();

  const barChartData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: months.map((month) => monthlyData.income[month] || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: months.map((month) => monthlyData.expenses[month] || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Income vs Expenses',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Expense Distribution</h2>
          {Object.keys(categoryExpenses).length > 0 ? (
            <Pie data={pieChartData} />
          ) : (
            <p className="text-gray-500 text-center py-8">No expense data available</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Income vs Expenses</h2>
          {months.length > 0 ? (
            <Bar options={barChartOptions} data={barChartData} />
          ) : (
            <p className="text-gray-500 text-center py-8">No transaction data available</p>
          )}
        </div>
      </div>
    </div>
  );
}