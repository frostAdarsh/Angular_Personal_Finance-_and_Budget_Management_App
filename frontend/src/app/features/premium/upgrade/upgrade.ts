import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StripeService } from '../../../core/services/stripe';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-upgrade',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8 font-sans flex flex-col items-center">
      
      <header class="text-center mb-12 max-w-2xl">
        <h1 class="text-4xl font-black text-gray-900 tracking-tight mb-4">Take control of your money with <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">TripSync Pro</span></h1>
        <p class="text-lg text-gray-500">Upgrade your account to unlock personalized AI financial advice, advanced forecasting, and unlimited budget tracking.</p>
      </header>

      <div class="relative w-full max-w-lg">
        <div class="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
        
        <div class="relative bg-white shadow-xl rounded-3xl p-8 border border-purple-100 overflow-hidden">
          <div class="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
            Premium
          </div>

          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Pro Plan</h2>
            <div class="flex items-center justify-center text-5xl font-black text-gray-900">
              $9<span class="text-xl font-medium text-gray-500 ml-1">/mo</span>
            </div>
          </div>

          <ul class="space-y-4 mb-8">
            <li class="flex items-center text-gray-700">
              <svg class="h-5 w-5 text-purple-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="font-medium">Everything in the Free plan</span>
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="h-5 w-5 text-purple-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="font-medium">✨ Google Gemini AI Financial Insights</span>
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="h-5 w-5 text-purple-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="font-medium">Unlimited budget categories</span>
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="h-5 w-5 text-purple-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="font-medium">Priority email support</span>
            </li>
          </ul>

          <div *ngIf="!isPro; else alreadyPro">
            <button (click)="upgrade()" [disabled]="isLoading" 
                    class="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition-all transform hover:scale-[1.02]">
              <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Connecting to Stripe...' : 'Upgrade with Stripe' }}
            </button>
            <p class="text-xs text-center text-gray-400 mt-4 font-medium">Secure payment powered by Stripe.</p>
          </div>

          <ng-template #alreadyPro>
            <div class="bg-green-50 rounded-xl p-4 text-center border border-green-100">
              <p class="text-green-700 font-bold mb-2">You are already a Pro member!</p>
              <a routerLink="/insights" class="text-sm text-green-600 hover:text-green-800 font-medium underline">Go to your AI Insights &rarr;</a>
            </div>
          </ng-template>

        </div>
      </div>

    </div>
  `
})
export class UpgradeComponent {
  private stripeService = inject(StripeService);
  private authService = inject(AuthService);

  isLoading = false;

  // Check if the current user is already a Pro member
  get isPro(): boolean {
    return this.authService.currentUser()?.isPro || false;
  }

  upgrade() {
    this.isLoading = true;
    // This calls the service we made, which hits your Node backend, gets the Stripe URL, and redirects the browser!
    this.stripeService.checkout();
  }
}