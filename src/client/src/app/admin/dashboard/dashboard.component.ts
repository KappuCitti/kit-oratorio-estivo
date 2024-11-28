/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, OnInit } from '@angular/core';
import Attendance, { AttendanceResponse } from 'src/models/Attendance';
import Enrollment, { Team } from 'src/models/Enrollment.model';
import User from 'src/models/User.model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  teams: Team[] = [];

  attendances: AttendanceResponse[] = [];
  enrollments: Enrollment[] = [];
  childrensTeams = {
    primary: {} as Record<string, number>,
    secondary: {} as Record<string, number>,
  };

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    const date = new Date();
    this.api.getUser().subscribe(data => {
      if (data.body) {
        this.user = data.body?.data || null;
      }
    });

    this.api.getAllTeams().subscribe(data => {
      if (data.body) {
        this.teams = data.body?.data || [];
      }
    });

    this.api.getAttendancesByDate(date.toLocaleDateString('en-CA')).subscribe(data => {
      if (data.body) {
        this.attendances = data.body?.data || [];
      }
    });

    this.api.getEnrollments({ year: date.getFullYear().toString() }).subscribe(data => {
      if (data.body) {
        this.enrollments = data.body?.data || [];
        this.initializeChildrensTeams();
      }
    });
  }

  getTodayPresenceAttendances() {
    return this.attendances.map(a => a.attendance).filter(a => a.present).length;
  }

  initializeChildrensTeams(): void {
    // Extract unique team names from the `teams` array.
    const teamNames = this.teams.map(team => team.name);

    // Initialize counters for each team in both primary and secondary levels.
    this.childrensTeams.primary = this.createEmptyTeamCounters(teamNames);
    this.childrensTeams.secondary = this.createEmptyTeamCounters(teamNames);

    // Populate the counters based on enrollments.
    this.populateTeamCounters();
  }

  createEmptyTeamCounters(teamNames: string[]): Record<string, number> {
    const counters: Record<string, number> = {};
    teamNames.forEach(name => {
      counters[name] = 0;
    });
    return counters;
  }

  populateTeamCounters(): void {
    this.enrollments.forEach(enrollment => {
      const teamName = enrollment.team.name;

      if (enrollment.schoolType === 'Primary' && this.childrensTeams.primary[teamName] !== undefined) {
        this.childrensTeams.primary[teamName]++;
      } else if (enrollment.schoolType === 'Secondary' && this.childrensTeams.secondary[teamName] !== undefined) {
        this.childrensTeams.secondary[teamName]++;
      }
    });
  }
}
