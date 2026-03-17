import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';


// User model used across the app
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  token?: string;
  isPro?: boolean;
}


// Response returned from backend after login/register
export interface AuthResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  isPro: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  // Global user state using Angular signals
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }


  // Register new user
  register(credentials: any) {

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, credentials)
      .pipe(
        tap(res => this.setAuthData(res))
      );

  }


  // Login user
  login(credentials: any) {

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(res => this.setAuthData(res))
      );

  }


  // Logout user
  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.currentUser.set(null);

    this.router.navigate(['/login']);

  }


  // Get JWT token
  getToken(): string | null {
    return localStorage.getItem('token');
  }


  // Save login session
  private setAuthData(res: AuthResponse) {

    localStorage.setItem('token', res.token);

    localStorage.setItem(
      'user',
      JSON.stringify({
        _id: res._id,
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
        isPro: res.isPro
      })
    );

    this.currentUser.set({
      _id: res._id,
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
      token: res.token,
      isPro: res.isPro
    });

  }


  // Restore session on refresh
  private loadUserFromStorage() {

    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token) {

      const parsedUser = JSON.parse(user);

      this.currentUser.set({
        _id: parsedUser._id,
        firstName: parsedUser.firstName,
        lastName: parsedUser.lastName,
        email: parsedUser.email,
        token,
        isPro: parsedUser.isPro
      });

    }

  }


  // Helper: get full name
  getFullName(): string {

    const user = this.currentUser();

    if (!user) return '';

    return `${user.firstName} ${user.lastName}`;

  }


  // Helper: check if user is Pro
  isProUser(): boolean {

    const user = this.currentUser();

    return user?.isPro ?? false;

  }

}