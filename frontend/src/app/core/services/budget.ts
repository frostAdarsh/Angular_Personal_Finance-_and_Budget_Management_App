import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

// 1. Define the Budget interface matching your backend schema
export interface Budget {
  _id?: string;
  user?: string;
  category: string;
  limit: number;
  month: number;
  year: number;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = `${environment.apiUrl}/budgets`;

  // 2. State Management: Signal to hold the active month's budgets
  budgets = signal<Budget[]>([]);

  constructor(private http: HttpClient) {}

  // Fetch budgets for a specific month and year
  getBudgets(month: number, year: number) {
    // Angular's HttpParams makes it easy to add ?month=x&year=y to the URL
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());

    return this.http.get<Budget[]>(this.apiUrl, { params }).pipe(
      tap(data => this.budgets.set(data))
    );
  }

  // Create or update a budget limit
  setBudget(budgetData: Partial<Budget>) {
    return this.http.post<Budget>(this.apiUrl, budgetData).pipe(
      tap(newBudget => {
        // Smartly update the signal: 
        // If the category already exists, update it. Otherwise, add it.
        this.budgets.update(currentBudgets => {
          const index = currentBudgets.findIndex(b => b.category === newBudget.category);
          if (index !== -1) {
            const updatedList = [...currentBudgets];
            updatedList[index] = newBudget;
            return updatedList;
          }
          return [...currentBudgets, newBudget];
        });
      })
    );
  }
}