export type TransactionCategory =
  | 'Groceries'
  | 'Transportation'
  | 'Entertainment'
  | 'Housing'
  | 'Utilities'
  | 'Healthcare'
  | 'Education'
  | 'Shopping'
  | 'Salary'
  | 'Investment'
  | 'Other';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  _id: string;
  name: string;
  amount: number;
  date: string;
  category: TransactionCategory;
  type: TransactionType;
  notes?: string;
}