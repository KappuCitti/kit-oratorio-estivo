/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './user/home/home.component';
import { LoginComponent } from './user/login/login.component';

import { AuthGuard } from '../guards/auth.guard';
import { LoginGuard } from 'src/guards/login.guard';

import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { EnrollmentComponent } from './admin/enrollment/enrollment.component';
import { EnrollmentNewComponent } from './admin/enrollment-new/enrollment-new.component';
import { EnrollmentEditComponent } from './admin/enrollment-edit/enrollment-edit.component';
import { PeopleComponent } from './admin/people/people.component';
import { PeopleNewComponent } from './admin/people-new/people-new.component';
import { AttendancesComponent } from './admin/attendances/attendances.component';
import { AttendancesMovementsComponent } from './admin/attendances-movements/attendances-movements.component';
import { TeamsComponent } from './admin/teams/teams.component';
import { PageNotFoundComponent } from './user/page-not-found/page-not-found.component';
import { PageUnauthorizedComponent } from './user/page-unauthorized/page-unauthorized.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { PeopleEditComponent } from './admin/people-edit/people-edit.component';
import { LeaderboardComponent } from './admin/leaderboard/leaderboard.component';

const routes: Routes = [
  // Page for everyone
  { path: '', component: HomeComponent },


  // Page for unlogged in users
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'unauthorized', component: PageUnauthorizedComponent },


  // Page for admin
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/my', component: AdminProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin/people', component: PeopleComponent, canActivate: [AuthGuard] },
  { path: 'admin/people/:context/:id/edit', component: PeopleEditComponent, canActivate: [AuthGuard] },
  { path: 'admin/people/new', component: PeopleNewComponent, canActivate: [AuthGuard] },
  { path: 'admin/enrollment', component: EnrollmentComponent, canActivate: [AuthGuard] },
  { path: 'admin/enrollment/:id/edit', component: EnrollmentEditComponent, canActivate: [AuthGuard] },
  { path: 'admin/enrollment/new', component: EnrollmentNewComponent, canActivate: [AuthGuard] },
  { path: 'admin/attendances', component: AttendancesComponent, canActivate: [AuthGuard] },
  { path: 'admin/attendances/:id/history', component: AttendancesMovementsComponent, canActivate: [AuthGuard] }, // :id is the id of the child
  { path: 'admin/leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/teams', component: TeamsComponent, canActivate: [AuthGuard] },

  { path: 'admin', redirectTo: 'admin/dashboard' },


  // otherwise redirect
  // { path: '**', redirectTo: '' }
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
