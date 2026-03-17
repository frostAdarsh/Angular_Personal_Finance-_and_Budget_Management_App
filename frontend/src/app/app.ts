import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `

  <div class="min-h-screen bg-gray-50 flex flex-col">

    <!-- Main Page Content -->
    <div class="flex-1 flex flex-col">

      <router-outlet></router-outlet>

    </div>

    

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

  // Inject auth service for future use
  public authService = inject(AuthService);

}