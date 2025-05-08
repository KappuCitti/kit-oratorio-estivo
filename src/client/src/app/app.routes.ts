import { Routes } from '@angular/router';
import { AuthGuard, LoginGuard } from '../guards/Auth.guard';
import { environment } from '../environments/environment';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// Admin pages
import { MyComponent } from './pages/admin/my/my.component';
import { EnrollmentsSearchComponent } from './pages/admin/enrollments-search/enrollments-search.component';
import { EnrollmentsEditComponent } from './pages/admin/enrollments-edit/enrollments-edit.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { EnrollmentsCreateComponent as AdminEnrollmentsCreateComponent } from './pages/admin/enrollments-create/enrollments-create.component';
import { TeamsSearchComponent } from './pages/admin/teams-search/teams-search.component';
import { PeopleSearchComponent } from './pages/admin/people-search/people-search.component';
import { PeopleCreateComponent } from './pages/admin/people-create/people-create.component';
import { StyleguideComponent } from './pages/styleguide/styleguide.component';
import { PeopleEditComponent } from './pages/admin/people-edit/people-edit.component';
import { AttendancesSearchComponent } from './pages/admin/attendances-search/attendances-search.component';
import { AttendancesEditComponent } from './pages/admin/attendances-edit/attendances-edit.component';

// User pages
import { DashboardComponent as UserDashboardComponent } from './pages/user/dashboard/dashboard.component';
import { EnrollmentsSearchComponent as UserEnrollmentsSearchComponent } from './pages/user/enrollments-search/enrollments-search.component';
import { EnrollmentsCreateComponent as UserEnrollmentsCreateComponent } from './pages/user/enrollments-create/enrollments-create.component';
import { PeopleSearchComponent as UserPeopleSearchComponent } from './pages/user/people-search/people-search.component';
import { PeopleCreateComponent as UserPeopleCreateComponent } from './pages/user/people-create/people-create.component';
import { SettingsComponent } from './pages/admin/settings/settings.component';
import { SignupComponent } from './pages/signup/signup.component';

const commonRoutes: Routes = [
  // Page for everyone
  { path: '', component: HomeComponent },

  // Page for unlogged in users
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [LoginGuard] },

  // Page for users
  {
    path: 'user/dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/enrollments',
    component: UserEnrollmentsSearchComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/enrollments/new',
    component: UserEnrollmentsCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/people',
    component: UserPeopleSearchComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/people/new',
    component: UserPeopleCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'user/my', component: MyComponent, canActivate: [AuthGuard] },
  { path: 'user', redirectTo: 'user/dashboard' },

  // Page for admin
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/people',
    component: PeopleSearchComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/people/new',
    component: PeopleCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/people/:type/:id',
    component: PeopleEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/enrollments',
    component: EnrollmentsSearchComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/enrollments/new',
    component: AdminEnrollmentsCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/enrollments/:id',
    component: EnrollmentsEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/attendances',
    component: AttendancesSearchComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/attendances/:id',
    component: AttendancesEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/teams',
    component: TeamsSearchComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'admin/my', component: MyComponent, canActivate: [AuthGuard] },
  { path: 'admin', redirectTo: 'admin/dashboard' },

  // otherwise redirect
  { path: '**', component: NotFoundComponent },
];

const devRoutes: Routes = !environment.production
  ? [{ path: 'styleguide', component: StyleguideComponent }]
  : [];

export const routes: Routes = [...devRoutes, ...commonRoutes];
