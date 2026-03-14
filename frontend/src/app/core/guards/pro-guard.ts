import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const proGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Grab the current user state from our Angular Signal
  const user = authService.currentUser();

  // Check if the user is logged in AND has the Pro subscription
  if (user && user.isPro) {
    return true; // Access granted to AI insights!
  }

  // Not a Pro user? Redirect them to the upgrade/pricing page
  router.navigate(['/upgrade']);
  return false;
};