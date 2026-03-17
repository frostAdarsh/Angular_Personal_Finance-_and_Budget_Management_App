import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AiService } from '../../../core/services/ai';
import { AuthService } from '../../../core/services/auth';

@Component({
selector: 'app-insights',
standalone: true,
imports: [CommonModule, RouterLink],
template: `

<div class="p-10 bg-gradient-to-br from-[#ecfdf5] to-[#f0fdf4] min-h-screen font-sans">

<header class="flex justify-between items-end mb-10">

<div>

<div class="inline-flex items-center gap-2
bg-green-100 text-green-700
text-xs font-bold px-3 py-1 rounded-full mb-3">

🤖 BudgetFlow AI

</div>

<h1 class="text-3xl font-extrabold text-gray-900">
AI Financial Advisor
</h1>

<p class="text-gray-500 font-bold">
Powered by <span class="text-green-600 font-bold">Groq AI</span>
</p>

</div>


<a routerLink="/dashboard"
class="text-sm font-bold text-green-600 hover:text-green-700">

← Back to Dashboard

</a>

</header>


<div class="max-w-4xl mx-auto">

<div class="bg-white rounded-3xl shadow-xl border p-10 relative overflow-hidden">

<div class="absolute -top-24 -right-24 w-72 h-72 bg-green-300 rounded-full blur-3xl opacity-20"></div>


<!-- LOADING -->
<div *ngIf="isLoading" class="text-center py-16">

<div class="text-5xl mb-4 animate-pulse">
🤖
</div>

<p class="text-gray-600 font-bold">
Groq AI is analyzing your finances...
</p>

</div>


<!-- EMPTY STATE -->
<div *ngIf="!isLoading && !insightText"
class="text-center py-16">

<div class="text-6xl mb-6">
📊
</div>

<h3 class="text-xl font-bold text-gray-900 mb-3">
Ready to analyze your finances
</h3>

<p class="text-gray-500 font-bold mb-8">
AI will review your transactions and budgets to give smart financial advice.
</p>

<button
(click)="generateInsights()"
class="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl">

Generate AI Insights

</button>

</div>


<!-- RESULT -->
<div *ngIf="!isLoading && insightText">

<div class="flex items-center gap-3 mb-6">

<div class="w-12 h-12 rounded-full bg-green-500
flex items-center justify-center text-white text-xl">

🤖

</div>

<div>

<h3 class="text-lg font-bold">
AI Financial Analysis
</h3>

<p class="text-sm font-bold text-gray-500">
Prepared for {{ userName }}
</p>

</div>

</div>


<div class="text-gray-700 whitespace-pre-wrap leading-relaxed font-bold">

{{ insightText }}

</div>


<div class="mt-8">

<button
(click)="generateInsights()"
class="bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2 rounded-lg">

Refresh Analysis

</button>

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
private cdr = inject(ChangeDetectorRef);

isLoading = false;
insightText: string | null = null;


/* USER NAME */

get userName(){

const user = this.authService.currentUser();

return user ? user.firstName + ' ' + user.lastName : '';

}


ngOnInit(){
this.generateInsights();
}


generateInsights(){

this.isLoading = true;
this.insightText = null;

this.cdr.detectChanges();

this.aiService.getInsights().subscribe({

next:(response:any)=>{

this.isLoading = false;

this.insightText =
response?.insight ||
response?.message ||
JSON.stringify(response);

this.cdr.detectChanges();

},

error:(err)=>{

this.isLoading = false;
this.cdr.detectChanges();

if(err.status===403){
this.router.navigate(['/upgrade']);
}else{
alert('Failed to connect to Groq AI');
}

}

});

}

}