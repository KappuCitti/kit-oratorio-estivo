/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieOptions as NgxCookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './user/home/home.component';
// TODO - Maybe edit or remove
import { LeaderboardComponent as UserLeaderboardComponent } from './user/leaderboard/leaderboard.component';

import { DashboardComponent } from './admin/dashboard/dashboard.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { EnrollmentComponent } from './admin/enrollment/enrollment.component';
import { EnrollmentNewComponent } from './admin/enrollment-new/enrollment-new.component';
import { EnrollmentDisplayComponent } from './admin/enrollment-display/enrollment-display.component';
import { EnrollmentEditComponent } from './admin/enrollment-edit/enrollment-edit.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PeopleComponent } from './admin/people/people.component';
import { PeopleNewComponent } from './admin/people-new/people-new.component';
import { PeopleEditComponent } from './admin/people-edit/people-edit.component';
import { PeopleChildDisplayComponent } from './admin/people-child-display/people-child-display.component';
import { PeopleParentDisplayComponent } from './admin/people-parent-display/people-parent-display.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { CookieService } from 'src/services/cookies.service';
import { PeopleAddressDisplayComponent } from './admin/people-address-display/people-address-display.component';
import { AttendancesComponent } from './admin/attendances/attendances.component';
import { AttendancesMovementsComponent } from './admin/attendances-movements/attendances-movements.component';
import { TeamsComponent } from './admin/teams/teams.component';
import { PageNotFoundComponent } from './user/page-not-found/page-not-found.component';
import { PageUnauthorizedComponent } from './user/page-unauthorized/page-unauthorized.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { LeaderboardComponent } from './admin/leaderboard/leaderboard.component';
import { LeaderboardRanksComponent } from './admin/leaderboard-ranks/leaderboard-ranks.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    NavbarComponent,
    FooterComponent,
    UserLeaderboardComponent,
    EnrollmentComponent,
    EnrollmentNewComponent,
    EnrollmentDisplayComponent,
    EnrollmentEditComponent,
    LoadingComponent,
    PeopleComponent,
    PeopleNewComponent,
    PeopleEditComponent,
    PeopleChildDisplayComponent,
    PeopleParentDisplayComponent,
    PeopleAddressDisplayComponent,
    AttendancesComponent,
    AttendancesMovementsComponent,
    TeamsComponent,
    PageNotFoundComponent,
    PageUnauthorizedComponent,
    PaginationComponent,
    AdminProfileComponent,
    LeaderboardComponent,
    LeaderboardRanksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, NgbModule
  ],
  providers: [AuthGuard, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
