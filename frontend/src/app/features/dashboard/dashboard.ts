import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { TransactionService } from '../../core/services/transaction';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
selector: 'app-dashboard',
standalone: true,
imports: [CommonModule, RouterLink, RouterLinkActive, BaseChartDirective],
template: `

<div class="flex min-h-screen bg-gradient-to-br from-[#ecfdf5] to-[#f0fdf4] font-sans">

<!-- SIDEBAR -->
<aside class="w-64 bg-gradient-to-b from-[#10B981] to-[#059669] text-white shadow-xl hidden md:flex flex-col">

<div class="p-6 border-b border-green-400">
<h2 class="text-2xl font-extrabold">BudgetFlow</h2>
</div>

<nav class="flex-1 px-4 py-6 space-y-2">

<a routerLink="/dashboard"
routerLinkActive="bg-white text-[#059669]"
[routerLinkActiveOptions]="{exact:true}"
class="block px-4 py-3 rounded-lg hover:bg-white/20">
Dashboard
</a>

<a routerLink="/transactions"
routerLinkActive="bg-white text-[#059669]"
class="block px-4 py-3 rounded-lg hover:bg-white/20">
Transactions
</a>

<a routerLink="/budget"
routerLinkActive="bg-white text-[#059669]"
class="block px-4 py-3 rounded-lg hover:bg-white/20">
Budgets
</a>

<a routerLink="/insights"
routerLinkActive="bg-white text-[#059669]"
class="flex justify-between px-4 py-3 rounded-lg hover:bg-white/20">

<span>✨ AI Insights</span>

<span *ngIf="isPro()"
class="bg-white text-[#059669] text-xs px-2 py-1 rounded">
PRO
</span>

</a>

</nav>

<div class="p-4 border-t border-green-400">

<div class="flex items-center gap-3 mb-4">

<div class="w-10 h-10 rounded-full bg-white text-[#059669]
flex items-center justify-center font-bold">

{{ userInitials }}

</div>

<div class="text-sm font-semibold">
{{ userName }}
</div>

</div>

<button (click)="logout()"
class="w-full bg-white text-[#059669] font-semibold rounded-lg py-2 cursor-pointer">
Logout
</button>

</div>

</aside>


<!-- MAIN -->
<main class="flex-1 p-10">

<header class="mb-10">
<h1 class="text-3xl font-extrabold text-gray-800">Financial Overview</h1>
<p class="text-gray-500">Track spending and view analytics.</p>
</header>


<!-- STATS -->
<div class="grid md:grid-cols-3 gap-6 mb-10">

<div class="bg-white p-6 rounded-2xl shadow-lg">
<p class="text-sm text-gray-500">Balance</p>

<p class="text-3xl font-bold"
[class.text-red-500]="balance() < 0"
[class.text-green-600]="balance() >= 0">

{{ balance() | currency:'INR':'symbol':'1.0-0':'en-IN' }}

</p>

</div>

<div class="bg-white p-6 rounded-2xl shadow-lg">
<p class="text-sm text-gray-500">Income</p>

<p class="text-2xl font-bold text-green-600">
{{ totalIncome() | currency:'INR':'symbol':'1.0-0':'en-IN' }}
</p>

</div>

<div class="bg-white p-6 rounded-2xl shadow-lg">
<p class="text-sm text-gray-500">Expenses</p>

<p class="text-2xl font-bold text-red-500">
{{ totalExpense() | currency:'INR':'symbol':'1.0-0':'en-IN' }}
</p>

</div>

</div>


<!-- CHARTS -->
<div class="grid md:grid-cols-2 gap-8">

<div class="bg-white p-6 rounded-2xl shadow-lg">

<h3 class="font-bold mb-4">Monthly Expenses</h3>

<canvas baseChart
[data]="monthlyChartData"
[type]="'bar'">
</canvas>

</div>

<div class="bg-white p-6 rounded-2xl shadow-lg">

<h3 class="font-bold mb-4">Category Breakdown</h3>

<canvas baseChart
[data]="categoryChartData"
[type]="'pie'">
</canvas>

</div>

<div class="bg-white p-6 rounded-2xl shadow-lg md:col-span-2">

<h3 class="font-bold mb-4">Spending Trend</h3>

<canvas baseChart
[data]="trendChartData"
[type]="'line'">
</canvas>

</div>

</div>

</main>

</div>

`
})
export class DashboardComponent implements OnInit {

private authService = inject(AuthService);
private transactionService = inject(TransactionService);


/* USER */

get userName(){
const user = this.authService.currentUser();
return user ? user.firstName + ' ' + user.lastName : '';
}

get userInitials(){
const user = this.authService.currentUser();
return user ? user.firstName[0] + user.lastName[0] : '';
}

isPro = computed(() => this.authService.currentUser()?.isPro || false);


/* TRANSACTIONS */

transactions = this.transactionService.transactions;


/* FINANCE */

totalIncome = computed(() =>
this.transactions()
.filter(t => t.type === 'income')
.reduce((sum,t)=>sum+t.amount,0)
);

totalExpense = computed(() =>
this.transactions()
.filter(t => t.type === 'expense')
.reduce((sum,t)=>sum+t.amount,0)
);

balance = computed(() =>
this.totalIncome() - this.totalExpense()
);


/* CHART DATA */

monthlyChartData: ChartConfiguration<'bar'>['data'] = {
labels: [],
datasets: [{ data: [], label: 'Expenses' }]
};

categoryChartData: ChartConfiguration<'pie'>['data'] = {
labels: [],
datasets: [{ data: [] }]
};

trendChartData: ChartConfiguration<'line'>['data'] = {
labels: [],
datasets: [{ data: [], label: 'Spending' }]
};


ngOnInit(){

this.transactionService.getTransactions().subscribe(()=>{

setTimeout(()=>{
this.generateCharts();
});

});

}


/* CHART GENERATION */

generateCharts(){

const tx = this.transactions();

const months:any={};

tx.forEach(t=>{
if(t.type==='expense'){
const m=new Date(t.date).toLocaleString('default',{month:'short'});
months[m]=(months[m]||0)+t.amount;
}
});

this.monthlyChartData={
labels:Object.keys(months),
datasets:[{data:Object.values(months),label:'Expenses'}]
};


const cats:any={};

tx.forEach(t=>{
cats[t.category]=(cats[t.category]||0)+t.amount;
});

this.categoryChartData={
labels:Object.keys(cats),
datasets:[{data:Object.values(cats)}]
};


const days:any={};

tx.forEach(t=>{
const d=new Date(t.date).toLocaleDateString();
days[d]=(days[d]||0)+t.amount;
});

this.trendChartData={
labels:Object.keys(days),
datasets:[{data:Object.values(days),label:'Spending'}]
};

}


/* LOGOUT */

logout(){
this.authService.logout();
}

}