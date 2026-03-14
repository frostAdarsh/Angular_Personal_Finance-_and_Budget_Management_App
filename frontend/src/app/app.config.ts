import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Import your new routes
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Tell Angular to use your routes!
    provideHttpClient(
      withInterceptors([jwtInterceptor]) // Ensure our token interceptor is active
    )
  ]
};