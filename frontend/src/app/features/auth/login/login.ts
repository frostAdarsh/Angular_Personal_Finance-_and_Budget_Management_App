import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `

  <div class="min-h-screen flex items-center justify-center
  bg-gradient-to-r from-[#0F766E] via-[#10B981] to-[#34D399] p-6">

    <div class="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-xl shadow-2xl overflow-hidden">

      <!-- LEFT SIDE ANIMATION -->
      <div class="hidden md:flex items-center justify-center bg-[#ECFDF5] p-10">

        <lottie-player
          src="/Login.json"
          background="transparent"
          speed="1"
          style="width:300px;height:300px"
          autoplay
          loop>
        </lottie-player>

      </div>

      <!-- LOGIN FORM -->
      <div class="p-10">

        <h2 class="text-3xl font-bold text-gray-900 text-center">
          Welcome back
        </h2>

        <p class="text-center text-gray-500 mb-8">
          Sign in to manage your finances.
        </p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">

          <!-- EMAIL -->
          <div>
            <label class="text-sm font-medium text-gray-700">Email</label>
            <input
              formControlName="email"
              type="email"
              class="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none"
              placeholder="you@example.com">
          </div>

          <!-- PASSWORD -->
          <div>
            <label class="text-sm font-medium text-gray-700">Password</label>
            <input
              formControlName="password"
              type="password"
              class="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none"
              placeholder="••••••••">
          </div>

          <!-- ERROR -->
          <div *ngIf="errorMessage" class="text-red-500 text-sm text-center">
            {{ errorMessage }}
          </div>

          <!-- LOGIN BUTTON -->
          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading"
            class="w-full py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition">

            {{ isLoading ? 'Signing in...' : 'Sign in' }}

          </button>

          <!-- REGISTER LINK -->
          <p class="text-center text-sm text-gray-600 mt-4">
            Don't have an account?
            <a routerLink="/register" class="text-[#10B981] font-medium">
              Register here
            </a>
          </p>

        </form>

      </div>

    </div>

  </div>

  `
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  isLoading = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {

    if (this.loginForm.valid) {

      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({

        next: () => {
          this.router.navigate(['/dashboard']);
        },

        error: (err) => {
          this.errorMessage = err.error?.message || 'Invalid email or password';
          this.isLoading = false;
        }

      });

    }

  }

}