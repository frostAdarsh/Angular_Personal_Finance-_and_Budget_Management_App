import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  // We import RouterOutlet to show our pages and CommonModule for *ngIf
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      
      <div class="flex-1 flex flex-col">
        <router-outlet></router-outlet>
      </div>

      <footer *ngIf="authService.currentUser()" class="bg-white border-t border-gray-100 py-4">
        <div class="max-w-7xl mx-auto px-4 text-center text-gray-400 text-xs font-medium">
          &copy; 2026 TripSync Finance. Powered by Google Gemini.
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class App {
  // Inject the AuthService so we can check if the user is logged in
  public authService = inject(AuthService);
}