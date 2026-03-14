import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 font-sans">
      
      <header class="mb-8 px-4 sm:px-0">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Transactions</h1>
        <p class="text-gray-500 mt-1">Add and manage your income and expenses.</p>
      </header>

      <div class="md:flex md:gap-8 px-4 sm:px-0">
        
        <div class="md:w-1/3 mb-8 md:mb-0">
          <div class="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
            <h2 class="text-xl font-bold mb-6 text-gray-900">New Transaction</h2>
            
            <form [formGroup]="transactionForm" (ngSubmit)="onSubmit()" class="space-y-5">
              
              <div class="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                <label class="flex-1 text-center">
                  <input type="radio" formControlName="type" value="income" class="peer sr-only">
                  <div class="py-2.5 rounded-lg cursor-pointer text-sm font-semibold text-gray-500 peer-checked:bg-green-500 peer-checked:text-white peer-checked:shadow-sm transition-all">Income</div>
                </label>
                <label class="flex-1 text-center">
                  <input type="radio" formControlName="type" value="expense" class="peer sr-only">
                  <div class="py-2.5 rounded-lg cursor-pointer text-sm font-semibold text-gray-500 peer-checked:bg-red-500 peer-checked:text-white peer-checked:shadow-sm transition-all">Expense</div>
                </label>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Amount</label>
                <div class="relative rounded-lg shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 font-medium">$</span>
                  </div>
                  <input type="number" formControlName="amount" class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 sm:text-sm border-gray-300 rounded-lg py-2.5 border transition-colors" placeholder="0.00" step="0.01">
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select formControlName="category" class="block w-full py-2.5 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors">
                  <option value="" disabled>Select a category</option>
                  <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                <input type="date" formControlName="date" class="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg py-2.5 px-3 border transition-colors">
              </div>

              <button type="submit" [disabled]="transactionForm.invalid" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors mt-2">
                Save Transaction
              </button>
            </form>
          </div>
        </div>

        <div class="md:w-2/3">
          <div class="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
            <div class="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 class="text-lg font-bold text-gray-900">Recent Activity</h2>
              <span class="text-sm font-medium text-gray-500">{{ transactionService.transactions().length }} transactions</span>
            </div>
            
            <ul class="divide-y divide-gray-100">
              <li *ngIf="transactionService.transactions().length === 0" class="px-6 py-12 text-center">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p class="text-gray-500 font-medium">No transactions yet. Add one to get started!</p>
              </li>

              <li *ngFor="let tx of transactionService.transactions()" class="px-6 py-4 hover:bg-gray-50 flex items-center justify-between transition-colors group">
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                       [ngClass]="tx.type === 'income' ? 'bg-green-500' : 'bg-red-500'">
                    {{ tx.type === 'income' ? '+' : '-' }}
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-bold text-gray-900">{{ tx.category }}</p>
                    <p class="text-xs font-medium text-gray-500 mt-0.5">{{ tx.date | date:'mediumDate' }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <span class="text-base font-bold" [ngClass]="tx.type === 'income' ? 'text-green-600' : 'text-gray-900'">
                    {{ tx.type === 'income' ? '+' : '-' }}{{ tx.amount | currency }}
                  </span>
                  <button (click)="deleteTx(tx._id!)" class="text-gray-300 hover:text-red-500 transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 focus:opacity-100 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  `
})
export class TransactionsComponent implements OnInit {
  transactionService = inject(TransactionService);
  fb = inject(FormBuilder);

  // You can expand these categories later to match whatever users want!
  categories = ['Groceries', 'Rent', 'Utilities', 'Entertainment', 'Salary', 'Transportation', 'Dining', 'Other'];

  transactionForm: FormGroup = this.fb.group({
    type: ['expense', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    date: [new Date().toISOString().substring(0, 10), Validators.required],
  });

  ngOnInit() {
    // Fetch the transactions when the component loads
    this.transactionService.getTransactions().subscribe();
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.transactionService.createTransaction(this.transactionForm.value).subscribe({
        next: () => {
          // Reset the form but keep the default type and today's date for quick successive entries
          this.transactionForm.reset({
            type: 'expense',
            date: new Date().toISOString().substring(0, 10),
            category: ''
          });
        },
        error: (err) => console.error('Error saving transaction', err)
      });
    }
  }

  deleteTx(id: string) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe();
    }
  }
}