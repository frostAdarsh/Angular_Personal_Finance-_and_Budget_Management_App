export interface Transaction {
  _id?: string;
  user?: string; // The ID of the user who owns this transaction
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;  // Stored as an ISO date string (YYYY-MM-DD)
  notes?: string;
  createdAt?: string;
}