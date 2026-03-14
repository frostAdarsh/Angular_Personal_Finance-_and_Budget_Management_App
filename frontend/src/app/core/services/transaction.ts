import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

// 1. Define the exact shape of a Transaction matching your Node.js backend
export interface Transaction {
  _id?: string;
  user?: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  notes?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;
  
  // 2. State Management: The signal holds your transaction array globally
  transactions = signal<Transaction[]>([]);

  constructor(private http: HttpClient) {}

  // Fetch all transactions from the backend and update the signal
  getTransactions() {
    return this.http.get<Transaction[]>(this.apiUrl).pipe(
      tap(data => this.transactions.set(data))
    );
  }

  // Create a new transaction and instantly add it to the top of the UI list
  createTransaction(transaction: Partial<Transaction>) {
    return this.http.post<Transaction>(this.apiUrl, transaction).pipe(
      tap(newTx => this.transactions.update(txs => [newTx, ...txs]))
    );
  }

  // Delete a transaction and instantly remove it from the UI list
  deleteTransaction(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.transactions.update(txs => txs.filter(t => t._id !== id)))
    );
  }
}