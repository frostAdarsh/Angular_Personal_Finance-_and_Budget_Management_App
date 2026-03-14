import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // 1. Authentication Routes (Public)
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent) 
  },

  // 2. Protected Routes (Require Login)
  { 
    path: 'dashboard', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent) 
  },
  { 
    path: 'transactions', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/transactions/transactions').then(m => m.TransactionsComponent) 
  },
  { 
    path: 'budget', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/budget/budget').then(m => m.BudgetComponent) 
  },

  // 3. Premium Routes (Require Login + will check Pro status in component)
  { 
    path: 'insights', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/premium/insights/insights').then(m => m.InsightsComponent) 
  },
  { 
    path: 'upgrade', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/premium/upgrade/upgrade').then(m => m.UpgradeComponent) 
  },

  // 4. Redirects & Wildcards
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' } // If page doesn't exist, go to dashboard
];