import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Transaction } from '../types/transaction';

interface TransactionState {
  transactions: Transaction[];
}

type TransactionAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'EDIT_TRANSACTION'; payload: Transaction }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] };

const initialState: TransactionState = {
  transactions: [],
};

const TransactionContext = createContext<{
  state: TransactionState;
  dispatch: React.Dispatch<TransactionAction>;
} | null>(null);

function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t._id !== action.payload),
      };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t._id === action.payload._id ? action.payload : t
        ),
      };
    default:
      return state;
  }
}

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}