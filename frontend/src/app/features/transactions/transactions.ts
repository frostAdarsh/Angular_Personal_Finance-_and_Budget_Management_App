import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction';

@Component({
selector: 'app-transactions',
standalone: true,
imports: [CommonModule, ReactiveFormsModule],
template: `

<div class="p-10 bg-gradient-to-br from-[#ecfdf5] to-[#f0fdf4] min-h-screen font-sans">

<header class="mb-10">
<h1 class="text-3xl font-extrabold text-gray-800">Transactions</h1>
<p class="text-gray-500">Track income and expenses.</p>
</header>


<div class="grid md:grid-cols-3 gap-8">

<!-- FORM -->
<div class="bg-white rounded-2xl shadow-lg p-6 border">

<h2 class="text-xl font-bold mb-6">Add Transaction</h2>

<form [formGroup]="transactionForm" (ngSubmit)="onSubmit()" class="space-y-5">

<div class="flex bg-gray-100 p-1 rounded-xl">

<label class="flex-1 text-center">
<input type="radio" formControlName="type" value="income" class="peer hidden">
<div class="py-2 rounded-lg text-sm font-semibold text-gray-500
peer-checked:bg-green-500 peer-checked:text-white cursor-pointer">
Income
</div>
</label>

<label class="flex-1 text-center">
<input type="radio" formControlName="type" value="expense" class="peer hidden">
<div class="py-2 rounded-lg text-sm font-semibold text-gray-500
peer-checked:bg-red-500 peer-checked:text-white cursor-pointer">
Expense
</div>
</label>

</div>


<div>
<label class="text-sm font-semibold text-gray-700">Amount</label>

<div class="relative mt-1">
<span class="absolute left-3 top-2 text-gray-500">₹</span>

<input type="number"
formControlName="amount"
class="w-full pl-8 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
placeholder="0">
</div>
</div>


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
<label class="text-sm font-semibold text-gray-700">Date</label>

<input type="date"
formControlName="date"
class="w-full mt-1 border rounded-lg py-2 px-3 focus:ring-2 focus:ring-green-400">
</div>


<button type="submit"
[disabled]="transactionForm.invalid"
class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg">

Save Transaction

</button>

</form>

</div>


<!-- LIST -->
<div class="md:col-span-2">

<div class="bg-white shadow-lg rounded-2xl border overflow-hidden">

<div class="flex justify-between items-center px-6 py-4 border-b bg-gray-50">

<h2 class="font-bold text-lg">Recent Activity</h2>

<span class="text-sm text-gray-500">
{{ transactionService.transactions().length }} transactions
</span>

</div>


<ul class="divide-y">

<li *ngIf="transactionService.transactions().length === 0"
class="text-center py-10 text-gray-500">
No transactions yet
</li>


<li *ngFor="let tx of transactionService.transactions()"
class="flex justify-between items-center px-6 py-4 hover:bg-gray-50">

<div class="flex items-center gap-3">

<div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
[ngClass]="tx.type === 'income' ? 'bg-green-500' : 'bg-red-500'">

{{ tx.type === 'income' ? '+' : '-' }}

</div>

<div>
<p class="font-semibold text-gray-800">
{{ tx.category }}
</p>

<p class="text-xs text-gray-500">
{{ tx.date | date:'mediumDate' }}
</p>
</div>

</div>


<div class="flex items-center gap-4">

<p class="font-bold"
[ngClass]="tx.type === 'income' ? 'text-green-600' : 'text-gray-800'">

{{ tx.type === 'income' ? '+' : '-' }}
{{ tx.amount | currency:'INR':'symbol':'1.0-0':'en-IN' }}

</p>

<button (click)="deleteTx(tx._id!)"
class="text-gray-400 hover:text-red-500">

🗑

</button>

</div>

</li>

</ul>

</div>

</div>

</div>

</div>
`
})
export class TransactionsComponent implements OnInit {

transactionService = inject(TransactionService);
fb = inject(FormBuilder);

categories = [
'Groceries','Rent','Utilities','Entertainment','Salary',
'Transportation','Dining','Shopping','Travel','Other'
];

transactionForm: FormGroup = this.fb.group({
type:['expense',Validators.required],
amount:['',[Validators.required,Validators.min(0.01)]],
category:['',Validators.required],
date:[new Date().toISOString().substring(0,10),Validators.required]
});

ngOnInit(){
this.transactionService.getTransactions().subscribe();
}

onSubmit(){
if(this.transactionForm.valid){
this.transactionService.createTransaction(this.transactionForm.value).subscribe({
next:()=>{
this.transactionForm.reset({
type:'expense',
date:new Date().toISOString().substring(0,10),
category:''
});
}
});
}
}

deleteTx(id:string){
if(confirm('Delete this transaction?')){
this.transactionService.deleteTransaction(id).subscribe();
}
}

}