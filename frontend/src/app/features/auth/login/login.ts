import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome back</h2>
          <p class="mt-2 text-center text-sm text-gray-600">Sign in to manage your finances.</p>
        </div>

        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <input formControlName="email" id="email" type="email" autocomplete="email" required 
                class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors" 
                placeholder="you@example.com">
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <input formControlName="password" id="password" type="password" autocomplete="current-password" required 
                class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors" 
                placeholder="••••••••">
            </div>
          </div>

          <div class="text-red-500 text-sm text-center font-medium" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div>
            <button type="submit" [disabled]="loginForm.invalid || isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors">
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
          
          <div class="text-sm text-center mt-4">
            <a routerLink="/register" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Don't have an account? Register here.
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  // Inject dependencies using modern Angular 21 syntax
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  isLoading = false;

  // Set up the reactive form with validation rules
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = ''; // Clear any previous errors

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          // Success! The AuthService automatically saves the token. We just redirect.
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          // Display the error message from the Node.js backend
          this.errorMessage = err.error?.message || 'Invalid email or password.';
          this.isLoading = false;
        }
      });
    }
  }
}