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

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ecfdf5] to-[#f0fdf4] font-sans p-6">

<div class="w-full max-w-lg">

<!-- BACK BUTTON -->
<div class="mb-6">
<a routerLink="/dashboard"
class="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1">

← Back to Dashboard

</a>
</div>


<!-- HEADER -->
<header class="text-center mb-10">

<h1 class="text-4xl font-extrabold text-gray-900 mb-3">
Upgrade to <span class="text-green-600">BudgetFlow Pro</span>
</h1>

<p class="text-gray-500 text-lg">
Unlock powerful AI financial insights and advanced budgeting tools.
</p>

</header>


<!-- PRICING CARD -->
<div class="bg-white shadow-xl rounded-3xl p-8 border relative overflow-hidden">

<div class="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
PRO
</div>

<div class="text-center mb-8">

<h2 class="text-2xl font-bold text-gray-900 mb-2">
Pro Plan
</h2>

<div class="text-5xl font-black text-gray-900">
₹500
<span class="text-lg text-gray-500 font-medium">/month</span>
</div>

</div>


<!-- FEATURES -->
<ul class="space-y-4 mb-8">

<li class="flex items-center text-gray-700">
✔ Everything in Free plan
</li>

<li class="flex items-center text-gray-700">
🤖 AI Financial Insights
</li>

<li class="flex items-center text-gray-700">
📊 Advanced Spending Analytics
</li>

<li class="flex items-center text-gray-700">
📈 Smart Budget Forecasting
</li>

<li class="flex items-center text-gray-700">
⭐ Priority Support
</li>

</ul>


<!-- BUTTON -->
<div *ngIf="!isPro; else alreadyPro">

<button
(click)="upgrade()"
[disabled]="isLoading"
class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer">

<svg *ngIf="isLoading"
class="animate-spin h-5 w-5"
xmlns="http://www.w3.org/2000/svg"
fill="none"
viewBox="0 0 24 24">

<circle class="opacity-25" cx="12" cy="12" r="10"
stroke="currentColor" stroke-width="4"></circle>

<path class="opacity-75"
fill="currentColor"
d="M4 12a8 8 0 018-8v8H4z"></path>

</svg>

{{ isLoading ? 'Connecting to Stripe...' : 'Upgrade with Stripe' }}

</button>

<p class="text-xs text-center text-gray-400 mt-4">
Secure payment powered by Stripe
</p>

</div>


<ng-template #alreadyPro>

<div class="bg-green-50 border border-green-200 rounded-xl p-4 text-center">

<p class="text-green-700 font-bold mb-2">
You are already a Pro member 🎉
</p>

<a routerLink="/insights"
class="text-green-600 hover:text-green-800 font-semibold">

Go to AI Insights →

</a>

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

get isPro(): boolean {
return this.authService.currentUser()?.isPro || false;
}

upgrade() {
this.isLoading = true;
this.stripeService.checkout();
}

}