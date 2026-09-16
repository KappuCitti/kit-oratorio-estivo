import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // Niente provideZoneChangeDetection: da Angular 21 il funzionamento
    // zoneless e' il default, e quella chiamata serviva solo a riportare
    // l'applicazione su Zone.js. Ora che lo stato e' in signal, Angular sa
    // gia' quando ridisegnare e zone.js non serve piu' (vedi polyfills in
    // angular.json).
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
