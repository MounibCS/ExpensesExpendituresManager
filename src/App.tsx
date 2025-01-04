import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TransactionProvider, useTransactions } from './context/TransactionContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import AddTransaction from './pages/AddTransaction';
import TransactionList from './pages/TransactionList';
import Reports from './pages/Reports';
import { useQuery } from 'convex/react';
import { useAuth0 } from '@auth0/auth0-react';
import { api } from '../convex/_generated/api';

function App() {

  return (
    <TransactionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="add" element={<AddTransaction />} />
            <Route path="transactions" element={<TransactionList />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TransactionProvider>
  );
}

export default App;