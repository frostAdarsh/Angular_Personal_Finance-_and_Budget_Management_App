import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  // Landing Page
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing')
        .then(m => m.LandingComponent)
  },

  // Authentication
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register')
        .then(m => m.RegisterComponent)
  },

  // Protected
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'transactions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/transactions/transactions')
        .then(m => m.TransactionsComponent)
  },
  {
    path: 'budget',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/budget/budget')
        .then(m => m.BudgetComponent)
  },

  // Premium
  {
    path: 'insights',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/premium/insights/insights')
        .then(m => m.InsightsComponent)
  },
  {
    path: 'upgrade',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/premium/upgrade/upgrade')
        .then(m => m.UpgradeComponent)
  },

  { path: '**', redirectTo: '' }
];