import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Prima erano registrati sia provideAnimationsAsync() sia
    // provideAnimations(): il secondo vinceva e annullava il caricamento
    // differito del modulo animazioni, che e' l'unico motivo per cui si usa la
    // variante `Async`.
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    // I provider di angular-calendar sono stati spostati sulla rotta
    // admin/attendances/:id, l'unica che usa il calendario.
  ],
};
