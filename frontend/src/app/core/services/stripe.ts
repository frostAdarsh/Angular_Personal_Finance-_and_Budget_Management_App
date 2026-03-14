import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private apiUrl = `${environment.apiUrl}/stripe`;

  constructor(private http: HttpClient) {}

  // Triggers the checkout process
  checkout() {
    // We send an empty object {} because the backend already knows who the user is from the JWT token
    this.http.post<{ url: string }>(`${this.apiUrl}/create-checkout-session`, {}).subscribe({
      next: (response) => {
        // This successfully redirects the browser to the Stripe Checkout page
        window.location.href = response.url;
      },
      error: (err) => {
        console.error('Stripe Checkout Error:', err);
        alert('Failed to initiate checkout. Please try again later.');
      }
    });
  }
}