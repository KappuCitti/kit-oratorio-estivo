import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

/**
 * Guard that checks if the user is logged in, and if so, redirects to the home page.
 * If the user is not logged in, it allows the navigation to the login page.
 * @param route The route to check
 * @param state The state of the router
 * @returns A boolean indicating if the navigation is allowed
 */
export const LoginGuard: CanActivateFn = (route, state) => {
  // TOOD - Delete this line
  // return true;

  const api = inject(ApiService);
  const router = inject(Router);
  const cookieService = inject(CookieService);

  const userToken = cookieService.get('user_token');

  if (!userToken) return true;

  return api.getUser().pipe(
    map((response) => {
      if (response.status === 200) {
        router.navigate(['/admin']);
        return false;
      } else return true;
    }),
    tap((isValid) => {
      if (isValid) router.navigate(['/admin']);
    }),
    catchError(() => of(true))
  );
};

export const AuthGuard: CanActivateFn = (route, state) => {
  // TOOD - Delete this line
  // return true;

  const api = inject(ApiService);
  const router = inject(Router);
  const cookieService = inject(CookieService);

  const userToken = cookieService.get('user_token');

  if (!userToken) {
    router.navigate(['/login']);
    return false;
  }

  // TODO - Add permissions check

  return api.getUser().pipe(
    map((response) => {
      if (response.status === 200) {
        return true;
      } else {
        api.logout();
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
