import { Routes } from '@angular/router';
import { AuthGuard, LoginGuard } from '../guards/Auth.guard';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { MyComponent } from './pages/admin/my/my.component';
import { EnrollmentsSearchComponent } from './pages/admin/enrollments-search/enrollments-search.component';
import { EnrollmentsEditComponent } from './pages/admin/enrollments-edit/enrollments-edit.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { EnrollmentsCreateComponent } from './pages/admin/enrollments-create/enrollments-create.component';
import { TeamViewComponent } from './pages/admin/team-view/team-view.component';

export const routes: Routes = [
  // Page for everyone
  { path: '', component: HomeComponent },

  // Page for unlogged in users
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },

  // Page for admin
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/enrollments',
    component: EnrollmentsSearchComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/enrollments/new',
    component: EnrollmentsCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/enrollments/:id',
    component: EnrollmentsEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/teams',
    component: TeamViewComponent,
    canActivate: [AuthGuard],
  },
  { path: 'admin/my', component: MyComponent, canActivate: [AuthGuard] },

  { path: 'admin', redirectTo: 'admin/dashboard' },

  // otherwise redirect
  { path: '**', component: NotFoundComponent },
];
