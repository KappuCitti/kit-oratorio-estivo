import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { CalendarModule, CalendarUtils, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AuthGuard, LoginGuard, permissionGuard } from '../guards/Auth.guard';
import { environment } from '../environments/environment';

// Ogni rotta usa `loadComponent`: il codice della pagina viene scaricato solo
// quando ci si naviga sopra, invece di finire tutto nel bundle iniziale.
//
// ATTENZIONE alle pagine che esistono in due versioni, una sotto pages/user e
// una sotto pages/admin, con lo stesso nome di classe. Prima erano distinte da
// un alias nell'import (`DashboardComponent as UserDashboardComponent`); ora
// l'unica cosa che le distingue e' il percorso dentro `import()`. Sbagliare
// quel percorso non da' nessun errore di compilazione: mostra semplicemente la
// pagina di amministrazione a un genitore.
const commonRoutes: Routes = [
  // Page for everyone
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },

  // Page for unlogged in users
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [LoginGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.component').then((m) => m.SignupComponent),
    canActivate: [LoginGuard],
  },

  // Page for users
  {
    path: 'user/dashboard',
    loadComponent: () =>
      import('./pages/user/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'user/enrollments',
    loadComponent: () =>
      import('./pages/user/enrollments-search/enrollments-search.component').then(
        (m) => m.EnrollmentsSearchComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'user/enrollments/new',
    loadComponent: () =>
      import('./pages/user/enrollments-create/enrollments-create.component').then(
        (m) => m.EnrollmentsCreateComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'user/people',
    loadComponent: () =>
      import('./pages/user/people-search/people-search.component').then(
        (m) => m.PeopleSearchComponent
      ),
    canActivate: [AuthGuard, permissionGuard('manage_self_child_users')],
  },
  {
    path: 'user/people/new',
    loadComponent: () =>
      import('./pages/user/people-create/people-create.component').then(
        (m) => m.PeopleCreateComponent
      ),
    canActivate: [AuthGuard, permissionGuard('manage_self_child_users')],
  },
  // `my` non ha una versione utente: la stessa pagina serve entrambi i ruoli.
  {
    path: 'user/my',
    loadComponent: () =>
      import('./pages/admin/my/my.component').then((m) => m.MyComponent),
    canActivate: [AuthGuard],
  },
  { path: 'user', redirectTo: 'user/dashboard' },

  // Page for admin
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./pages/admin/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard, permissionGuard('see_users')],
  },
  // La rubrica di amministrazione (admin/people, admin/people/new e
  // admin/people/:type/:id) non e' registrata qui di proposito: le sue pagine
  // chiamano /people, /childs, /parents e POST /family, che sul server non
  // esistono e non sono mai esistiti. Non c'e' nemmeno un endpoint che possa
  // sostituirli: GET /users restituisce solo gli utenti gestiti da chi e'
  // collegato, senza ricerca ne' paginazione.
  //
  // I componenti restano nel repository, cosi' il lavoro fatto non si perde,
  // ma finche' il server non offre un elenco di persone con ricerca queste
  // rotte porterebbero solo a pagine vuote e a errori di rete.
  {
    path: 'admin/enrollments',
    loadComponent: () =>
      import(
        './pages/admin/enrollments-search/enrollments-search.component'
      ).then((m) => m.EnrollmentsSearchComponent),
    canActivate: [AuthGuard, permissionGuard('see_users')],
  },
  {
    path: 'admin/enrollments/new',
    loadComponent: () =>
      import(
        './pages/admin/enrollments-create/enrollments-create.component'
      ).then((m) => m.EnrollmentsCreateComponent),
    canActivate: [AuthGuard, permissionGuard('manage_enrollments')],
  },
  {
    path: 'admin/enrollments/:id',
    loadComponent: () =>
      import('./pages/admin/enrollments-edit/enrollments-edit.component').then(
        (m) => m.EnrollmentsEditComponent
      ),
    canActivate: [AuthGuard, permissionGuard('see_users')],
  },
  {
    path: 'admin/attendances',
    loadComponent: () =>
      import(
        './pages/admin/attendances-search/attendances-search.component'
      ).then((m) => m.AttendancesSearchComponent),
    canActivate: [AuthGuard, permissionGuard('manage_attendances')],
  },
  {
    path: 'admin/attendances/:id',
    loadComponent: () =>
      import('./pages/admin/attendances-edit/attendances-edit.component').then(
        (m) => m.AttendancesEditComponent
      ),
    // I provider di angular-calendar stanno qui e non in app.config.ts: questa
    // e' l'unica pagina che usa il calendario, e dichiararli a livello di
    // applicazione teneva la libreria (con date-fns) nel bundle iniziale di
    // tutti, login compreso.
    providers: [
      importProvidersFrom(
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory,
        })
      ),
      CalendarUtils,
    ],
    canActivate: [AuthGuard, permissionGuard('manage_attendances')],
  },
  {
    path: 'admin/teams',
    loadComponent: () =>
      import('./pages/admin/teams-search/teams-search.component').then(
        (m) => m.TeamsSearchComponent
      ),
    canActivate: [AuthGuard, permissionGuard('manage_teams')],
  },
  {
    path: 'admin/settings',
    loadComponent: () =>
      import('./pages/admin/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
    canActivate: [AuthGuard, permissionGuard('manage_classes')],
  },
  {
    path: 'admin/my',
    loadComponent: () =>
      import('./pages/admin/my/my.component').then((m) => m.MyComponent),
    canActivate: [AuthGuard],
  },
  { path: 'admin', redirectTo: 'admin/dashboard' },

  // otherwise redirect
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];

const devRoutes: Routes = !environment.production
  ? [
      {
        path: 'styleguide',
        loadComponent: () =>
          import('./pages/styleguide/styleguide.component').then(
            (m) => m.StyleguideComponent
          ),
      },
    ]
  : [];

export const routes: Routes = [...devRoutes, ...commonRoutes];
