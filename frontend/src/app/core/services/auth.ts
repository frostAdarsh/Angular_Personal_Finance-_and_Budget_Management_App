import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

// 1. Define the shapes of our data
export interface User {
  _id: string;
  email: string;
  token?: string;
  isPro?: boolean; // 🆕 Tracks if they paid via Stripe
}

export interface AuthResponse {
  _id: string;
  email: string;
  token: string;
  isPro: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // 2. Modern Angular Signal to hold the current user state globally
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    // When the app starts, check if they are already logged in
    this.loadUserFromStorage();
  }

  register(credentials: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, credentials).pipe(
      tap(res => this.setAuthData(res))
    );
  }

  login(credentials: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.setAuthData(res))
    );
  }

  logout() {
    // Clear everything and boot them to the login screen
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Helper method to save the session securely
  private setAuthData(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    // 🆕 Notice we are now saving the isPro status to localStorage too!
    localStorage.setItem('user', JSON.stringify({ _id: res._id, email: res.email, isPro: res.isPro }));
    
    // Update the Signal so the whole app reacts instantly
    this.currentUser.set({ _id: res._id, email: res.email, token: res.token, isPro: res.isPro });
  }

  // Helper method to restore the session on page refresh
  private loadUserFromStorage() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      this.currentUser.set({ ...JSON.parse(user), token });
    }
  }
}