import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BudgetService } from '../../core/services/budget';
import { TransactionService } from '../../core/services/transaction';

@Component({
selector:'app-budget',
standalone:true,
imports:[CommonModule,ReactiveFormsModule],
template:`

<div class="p-10 bg-gradient-to-br from-[#ecfdf5] to-[#f0fdf4] min-h-screen font-sans">

<header class="mb-10">
<h1 class="text-3xl font-extrabold text-gray-800">Budgets</h1>
<p class="text-gray-500">Track monthly spending limits.</p>
</header>


<div class="grid md:grid-cols-3 gap-8">

<!-- FORM -->
<div class="bg-white rounded-2xl shadow-lg p-6 border">

<h2 class="text-xl font-bold mb-6">Set Budget</h2>

<form [formGroup]="budgetForm" (ngSubmit)="onSubmit()" class="space-y-5">

<div>
<label class="text-sm font-semibold text-gray-700">Category</label>

<select formControlName="category"
class="w-full mt-1 border rounded-lg py-2 px-3 focus:ring-2 focus:ring-green-400">

<option value="" disabled>Select category</option>

<option *ngFor="let cat of categories" [value]="cat">
{{ cat }}
</option>

</select>

</div>


<div>
<label class="text-sm font-semibold text-gray-700">Monthly Limit</label>

<div class="relative mt-1">
<span class="absolute left-3 top-2 text-gray-500">₹</span>

<input type="number"
formControlName="limit"
class="w-full pl-8 py-2 border rounded-lg focus:ring-2 focus:ring-green-400">
</div>

</div>


<button type="submit"
[disabled]="budgetForm.invalid"
class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg">

Save Budget

</button>

</form>

</div>


<!-- PROGRESS -->
<div class="md:col-span-2">

<div class="bg-white shadow-lg rounded-2xl p-6 border">

<h2 class="font-bold text-lg mb-6">
Current Month Overview
</h2>

<div *ngFor="let item of budgetProgress()" class="mb-6">

<div class="flex justify-between mb-2">

<div>
<p class="font-bold text-gray-800">{{ item.category }}</p>
<p class="text-xs text-gray-500">
{{ item.percentage | number:'1.0-0' }}% used
</p>
</div>

<div class="text-right">

<p class="font-bold"
[ngClass]="item.isOverBudget ? 'text-red-600' : 'text-gray-800'">

{{ item.spent | currency:'INR':'symbol':'1.0-0':'en-IN' }}

</p>

<p class="text-xs text-gray-500">

/ {{ item.limit | currency:'INR':'symbol':'1.0-0':'en-IN' }}

</p>

</div>

</div>


<div class="w-full bg-gray-200 rounded-full h-3">

<div class="h-3 rounded-full"
[style.width.%]="item.percentage > 100 ? 100 : item.percentage"

[ngClass]="{
'bg-green-500': item.percentage < 75,
'bg-yellow-400': item.percentage >= 75 && item.percentage < 100,
'bg-red-500': item.percentage >= 100
}">
</div>

</div>

<div *ngIf="item.isOverBudget"
class="text-red-500 text-sm mt-1">

⚠ Over Budget

</div>

</div>

</div>

</div>

</div>

</div>
`
})
export class BudgetComponent implements OnInit{

budgetService = inject(BudgetService);
transactionService = inject(TransactionService);
fb = inject(FormBuilder);

categories=[
'Groceries','Rent','Utilities','Entertainment','Salary',
'Transportation','Dining','Shopping','Travel','Other'
];

currentDate=new Date();
currentMonth=this.currentDate.getMonth()+1;
currentYear=this.currentDate.getFullYear();

budgetForm:FormGroup=this.fb.group({
category:['',Validators.required],
limit:['',[Validators.required,Validators.min(1)]]
});

budgetProgress=computed(()=>{

const budgets=this.budgetService.budgets();
const transactions=this.transactionService.transactions();

return budgets.map(budget=>{

const spent=transactions
.filter(t=>t.type==='expense'
&& t.category===budget.category
&& new Date(t.date).getMonth()+1===budget.month
&& new Date(t.date).getFullYear()===budget.year)
.reduce((sum,t)=>sum+t.amount,0);

const percentage=(spent/budget.limit)*100;

return{
...budget,
spent,
percentage,
isOverBudget:spent>budget.limit
};

});

});

ngOnInit(){

this.budgetService
.getBudgets(this.currentMonth,this.currentYear)
.subscribe();

this.transactionService
.getTransactions()
.subscribe();

}

onSubmit(){

if(this.budgetForm.valid){

const budgetData={
...this.budgetForm.value,
month:this.currentMonth,
year:this.currentYear
};

this.budgetService.setBudget(budgetData).subscribe({
next:()=>this.budgetForm.reset({category:''})
});

}

}

}