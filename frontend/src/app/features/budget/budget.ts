import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetService } from '../../core/services/budget';
import { TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 font-sans">
      
      <header class="mb-8 px-4 sm:px-0">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Budgets</h1>
        <p class="text-gray-500 mt-1">Set limits and track your monthly spending.</p>
      </header>

      <div class="md:flex md:gap-8 px-4 sm:px-0">
        
        <div class="md:w-1/3 mb-8 md:mb-0">
          <div class="bg-white shadow-sm rounded-2xl p-6 border border-gray-100 sticky top-6">
            <h2 class="text-xl font-bold mb-6 text-gray-900">Set Category Limit</h2>
            
            <form [formGroup]="budgetForm" (ngSubmit)="onSubmit()" class="space-y-5">
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select formControlName="category" class="block w-full py-2.5 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors">
                  <option value="" disabled>Select a category</option>
                  <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Monthly Limit</label>
                <div class="relative rounded-lg shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 font-medium">$</span>
                  </div>
                  <input type="number" formControlName="limit" class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 sm:text-sm border-gray-300 rounded-lg py-2.5 border transition-colors" placeholder="0.00" step="1">
                </div>
              </div>

              <button type="submit" [disabled]="budgetForm.invalid" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors mt-2">
                Save Budget
              </button>
            </form>
          </div>
        </div>

        <div class="md:w-2/3">
          <div class="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-6">Current Month Overview</h2>
            
            <div *ngIf="budgetProgress().length === 0" class="text-center py-10">
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p class="text-gray-500 font-medium">You haven't set any budgets for this month yet.</p>
            </div>

            <div class="space-y-6">
              <div *ngFor="let item of budgetProgress()" class="relative">
                <div class="flex justify-between items-end mb-2">
                  <div>
                    <span class="text-sm font-bold text-gray-900">{{ item.category }}</span>
                    <p class="text-xs text-gray-500 mt-0.5">{{ item.percentage | number:'1.0-0' }}% used</p>
                  </div>
                  <div class="text-right">
                    <span class="text-sm font-bold" [ngClass]="item.isOverBudget ? 'text-red-600' : 'text-gray-900'">
                      {{ item.spent | currency }}
                    </span>
                    <span class="text-xs text-gray-500 font-medium"> / {{ item.limit | currency }}</span>
                  </div>
                </div>
                
                <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div class="h-2.5 rounded-full transition-all duration-500 ease-out"
                       [style.width.%]="item.percentage > 100 ? 100 : item.percentage"
                       [ngClass]="{
                         'bg-green-500': item.percentage < 75,
                         'bg-yellow-400': item.percentage >= 75 && item.percentage < 100,
                         'bg-red-500': item.percentage >= 100
                       }">
                  </div>
                </div>
                
                <p *ngIf="item.isOverBudget" class="text-xs font-bold text-red-500 mt-1.5 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  You are over budget!
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `
})
export class BudgetComponent implements OnInit {
  budgetService = inject(BudgetService);
  transactionService = inject(TransactionService);
  fb = inject(FormBuilder);

  // Match the categories used in the Transactions component
  categories = ['Groceries', 'Rent', 'Utilities', 'Entertainment', 'Salary', 'Transportation', 'Dining', 'Other'];

  // Automatically determine the current month and year
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth() + 1; // JS months are 0-indexed
  currentYear = this.currentDate.getFullYear();

  budgetForm: FormGroup = this.fb.group({
    category: ['', Validators.required],
    limit: ['', [Validators.required, Validators.min(1)]],
  });

  // 🚀 The Magic: Computed signal that calculates spending vs limits instantly
  budgetProgress = computed(() => {
    const budgets = this.budgetService.budgets();
    const transactions = this.transactionService.transactions();

    return budgets.map(budget => {
      // Find all expenses for this specific category in the current month
      const spent = transactions
        .filter(t => 
          t.type === 'expense' && 
          t.category === budget.category &&
          new Date(t.date).getMonth() + 1 === budget.month &&
          new Date(t.date).getFullYear() === budget.year
        )
        .reduce((sum, t) => sum + t.amount, 0); // Add them up

      const percentage = (spent / budget.limit) * 100;
      
      return {
        ...budget,
        spent,
        percentage,
        isOverBudget: spent > budget.limit
      };
    });
  });

  ngOnInit() {
    // Fetch budgets for the current month
    this.budgetService.getBudgets(this.currentMonth, this.currentYear).subscribe();
    
    // Fetch transactions (if not already fetched by navigating from the Dashboard)
    this.transactionService.getTransactions().subscribe();
  }

  onSubmit() {
    if (this.budgetForm.valid) {
      const budgetData = {
        ...this.budgetForm.value,
        month: this.currentMonth,
        year: this.currentYear
      };

      this.budgetService.setBudget(budgetData).subscribe({
        next: () => {
          // Reset just the limit field, keep the category selection blank
          this.budgetForm.reset({ category: '' });
        },
        error: (err) => console.error('Error saving budget', err)
      });
    }
  }
}