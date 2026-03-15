import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { AiService } from '../../../core/services/ai'; 
import { AuthService } from '../../../core/services/auth'; 

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto py-8 sm:px-6 lg:px-8 font-sans">
      
      <header class="mb-8 px-4 sm:px-0 flex justify-between items-end">
        <div>
          <div class="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-sm border border-purple-200">
            <span class="text-purple-600">✨</span>
            <span>TripSync Pro Feature</span>
          </div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">AI Financial Advisor</h1>
          <p class="text-gray-500 mt-1">Powered by Google Gemini.</p>
        </div>
        
        <button (click)="generateInsights()" [disabled]="isLoading" 
                class="hidden sm:flex items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition-all">
          <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg *ngIf="!isLoading" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ isLoading ? 'Analyzing Data...' : 'Refresh Analysis' }}
        </button>
      </header>

      <div class="px-4 sm:px-0">
        <div class="relative bg-white shadow-lg rounded-3xl p-8 sm:p-10 border border-purple-100 overflow-hidden min-h-[400px]">
          
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-purple-400 to-blue-300 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

          <div *ngIf="isLoading" class="animate-pulse space-y-6">
            <div class="flex items-center space-x-4 mb-8">
              <div class="rounded-full bg-purple-200 h-12 w-12"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-purple-200 rounded w-1/4"></div>
                <div class="h-3 bg-purple-100 rounded w-1/3"></div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="h-3 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-full"></div>
              <div class="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div class="space-y-3 pt-4">
              <div class="h-3 bg-gray-200 rounded w-full"></div>
              <div class="h-3 bg-gray-200 rounded w-4/5"></div>
              <div class="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>

          <div *ngIf="!isLoading && !insightText" class="flex flex-col items-center justify-center h-full text-center py-12">
            <div class="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-purple-100">
              <span class="text-4xl">🤖</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Ready to analyze your finances</h3>
            <p class="text-gray-500 max-w-md mx-auto mb-8">Gemini will look at your recent transactions and budget limits to give you personalized, actionable advice.</p>
            <button (click)="generateInsights()" class="sm:hidden flex justify-center w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Generate Insights
            </button>
          </div>

          <div *ngIf="!isLoading && insightText" class="relative z-10">
            <div class="flex items-center space-x-4 mb-8 border-b border-gray-100 pb-6">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl shadow-md">
                ✨
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">Your Financial Analysis</h3>
                <p class="text-sm text-gray-500">Prepared just for {{ userEmail }}</p>
              </div>
            </div>
            
            <div class="prose prose-purple max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
              {{ insightText }}
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class InsightsComponent implements OnInit {
  private aiService = inject(AiService);
  private authService = inject(AuthService);
  private router = inject(Router); 
  private cdr = inject(ChangeDetectorRef); // The Sledgehammer

  isLoading = false;
  insightText: string | null = null; 

  get userEmail() {
    return this.authService.currentUser()?.email;
  }

  ngOnInit() {
    this.generateInsights();
  }

  generateInsights() {
    this.isLoading = true;
    this.insightText = null; 
    
    // Force UI to show the loading spinner immediately
    this.cdr.detectChanges(); 

    this.aiService.getInsights().subscribe({
      next: (response: any) => {
        console.log("✅ SUCCESS! Raw Backend Data:", response);
        this.isLoading = false;
        
        // Extract the string safely
        this.insightText = response?.insight || JSON.stringify(response);
        
        // Command Angular to paint the text on the screen right NOW!
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('❌ Error fetching AI insights:', err);
        this.isLoading = false;
        
        // Force UI to hide the spinner on error
        this.cdr.detectChanges(); 
        
        if (err.status === 403) {
          this.router.navigate(['/upgrade']);
        } else {
          alert('Failed to connect to the AI. Please try again later.');
        }
      }
    });
  }
}