import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MyComponent } from './pages/admin/my/my.component';
import { AuthGuard, LoginGuard } from '../guards/Auth.guard';

export const routes: Routes = [
  // Page for everyone
  { path: '', component: HomeComponent },

  // Page for unlogged in users
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },

  // Page for admin
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/my', component: MyComponent, canActivate: [AuthGuard] },

  { path: 'admin', redirectTo: 'admin/dashboard' },

  // otherwise redirect
  { path: '**', component: NotFoundComponent },
];
