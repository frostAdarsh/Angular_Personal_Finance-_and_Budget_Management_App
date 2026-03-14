import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  // Inject the required services (modern Angular approach)
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user has a token in localStorage
  if (authService.getToken()) {
    return true; // Access granted
  }

  // Access denied: Redirect to the login page
  router.navigate(['/login']);
  return false;
};