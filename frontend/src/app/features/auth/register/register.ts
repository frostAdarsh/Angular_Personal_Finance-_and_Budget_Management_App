import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
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
          src="/Signup.json"
          background="transparent"
          speed="1"
          style="width:300px;height:300px"
          autoplay
          loop>
        </lottie-player>

      </div>

      <!-- REGISTER FORM -->
      <div class="p-10">

        <h2 class="text-3xl font-bold text-gray-900 text-center">
          Create your BudgetFlow account
        </h2>

        <p class="text-center text-gray-500 mb-8">
          Start managing your finances today.
        </p>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">

          <!-- FIRST NAME -->
          <div>
            <label class="text-sm font-medium text-gray-700">First Name</label>
            <input
              formControlName="firstName"
              class="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none"
              placeholder="John">
          </div>

          <!-- LAST NAME -->
          <div>
            <label class="text-sm font-medium text-gray-700">Last Name</label>
            <input
              formControlName="lastName"
              class="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none"
              placeholder="Doe">
          </div>

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
              placeholder="Minimum 6 characters">
          </div>

          <!-- ERROR MESSAGE -->
          <div *ngIf="errorMessage" class="text-red-500 text-sm text-center">
            {{ errorMessage }}
          </div>

          <!-- SUBMIT BUTTON -->
          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading"
            class="w-full py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition">

            {{ isLoading ? 'Creating Account...' : 'Register' }}

          </button>

          <!-- LOGIN LINK -->
          <p class="text-center text-sm text-gray-600 mt-4">
            Already have an account?
            <a routerLink="/login" class="text-[#10B981] font-medium">
              Sign in
            </a>
          </p>

        </form>

      </div>

    </div>

  </div>

  `
})
export class RegisterComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  isLoading = false;

  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {

    if (this.registerForm.valid) {

      this.isLoading = true;
      this.errorMessage = '';

      this.authService.register(this.registerForm.value).subscribe({

        next: () => {
          this.router.navigate(['/dashboard']);
        },

        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed';
          this.isLoading = false;
        }

      });

    }

  }

}