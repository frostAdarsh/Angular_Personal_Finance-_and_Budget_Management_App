import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-50 font-sans">
      
      <aside class="w-64 bg-white shadow-md hidden md:flex flex-col border-r border-gray-100">
        <div class="p-6">
          <h2 class="text-2xl font-black text-blue-600 tracking-tight">TripSync Finance</h2>
        </div>
        
        <nav class="flex-1 px-4 space-y-2 mt-4">
          <a routerLink="/dashboard" routerLinkActive="bg-blue-50 text-blue-700 font-semibold" [routerLinkActiveOptions]="{exact: true}" 
             class="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <span>Dashboard</span>
          </a>
          <a routerLink="/transactions" routerLinkActive="bg-blue-50 text-blue-700 font-semibold" 
             class="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <span>Transactions</span>
          </a>
          <a routerLink="/budget" routerLinkActive="bg-blue-50 text-blue-700 font-semibold" 
             class="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <span>Budgets</span>
          </a>
          
          <div class="pt-6 mt-6 border-t border-gray-100">
            <p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Premium</p>
            <a routerLink="/insights" routerLinkActive="bg-purple-50 text-purple-700 font-semibold" 
               class="flex items-center justify-between px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
               <span class="flex items-center gap-2">
                 <span class="text-purple-500">✨</span> AI Insights
               </span>
               <span *ngIf="isPro()" class="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Pro</span>
            </a>
          </div>
        </nav>

        <div class="p-4 border-t border-gray-100 bg-gray-50">
          <div class="flex items-center space-x-3 mb-4 px-2 overflow-hidden">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
              {{ userEmail?.charAt(0) | uppercase }}
            </div>
            <div class="flex-1 truncate text-sm font-medium text-gray-900">
              {{ userEmail }}
            </div>
          </div>
          <button (click)="logout()" class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition-colors">
            Log out
          </button>
        </div>
      </aside>

      <main class="flex-1 overflow-y-auto p-8">
        <header class="mb-8">
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
          <p class="text-gray-500 mt-1">Here is what's happening with your money.</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Balance</h3>
            <p class="text-4xl font-black text-gray-900 mt-2" [class.text-red-600]="balance() < 0">
              {{ balance() | currency }}
            </p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Income</h3>
            <p class="text-3xl font-bold text-green-600 mt-2">
              {{ totalIncome() | currency }}
            </p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Expenses</h3>
            <p class="text-3xl font-bold text-red-600 mt-2">
              {{ totalExpense() | currency }}
            </p>
          </div>
        </div>

        <div *ngIf="transactions().length === 0" class="bg-blue-50 rounded-2xl p-8 text-center border border-blue-100">
          <h3 class="text-lg font-bold text-blue-900 mb-2">Welcome to your dashboard!</h3>
          <p class="text-blue-700 mb-6">You don't have any transactions yet. Start tracking your finances to see your data here.</p>
          <a routerLink="/transactions" class="inline-flex justify-center py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Add a Transaction
          </a>
        </div>
      </main>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private transactionService = inject(TransactionService);

  // Get current user info from the Auth Signal
  get userEmail() {
    return this.authService.currentUser()?.email;
  }

  // Check if they are a Pro user
  isPro = computed(() => this.authService.currentUser()?.isPro || false);

  // Access the transactions signal
  transactions = this.transactionService.transactions;

  // 🚀 Modern Angular Computed Signals for dynamic math!
  totalIncome = computed(() => {
    return this.transactions()
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  totalExpense = computed(() => {
    return this.transactions()
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  balance = computed(() => this.totalIncome() - this.totalExpense());

  ngOnInit() {
    // Fetch the latest transactions from the backend when the dashboard loads
    this.transactionService.getTransactions().subscribe();
  }

  logout() {
    this.authService.logout();
  }
}