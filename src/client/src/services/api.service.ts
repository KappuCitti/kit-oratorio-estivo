/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { AttendanceResponse, Movement } from 'src/models/Attendance';
import Enrollment, { Address, Child, Parent, Shirt, Team, Tree, Week } from 'src/models/Enrollment.model';
import Leaderboard, { Score } from 'src/models/Leaderboard';
import { SearchPoeple } from 'src/models/Poeple';

import { Response } from 'src/models/SimpleResponse.model';
import { Theme } from 'src/models/Theme.model';
import User from 'src/models/User.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<Response<string>>(`${this.apiUrl}/user/login`, { username, password }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  logout() {
    return this.http.get<Response<any>>(`${this.apiUrl}/user/logout`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  settingSetTheme(theme: Theme) {
    return this.http.put<Response<any>>(`${this.apiUrl}/user/setting/theme`, theme, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  getUser() {
    return this.http.get<Response<User>>(`${this.apiUrl}/user`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  updateUserData(id: string, password: string, name: string, surname: string, email: string, theme: Theme) {
    return this.http.put<Response<any>>(`${this.apiUrl}/user`, { id, password, name, surname, email, theme }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  updateUserPassword(id: string, oldPassword: string, newPassword: string) {
    return this.http.put<Response<any>>(`${this.apiUrl}/user/password`, { id, password: oldPassword, newPassword }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  // Poeple
  searchPeople(name?: string, surname?: string, context?: string, limit?: number, offset?: number) {
    const params: { [key: string]: string | number | boolean } = {};
    if (name) params['name'] = name;
    if (surname) params['surname'] = surname;
    if (context) params['context'] = context;
    if (limit) params['limit'] = limit;
    if (offset) params['offset'] = offset;

    return this.http.get<Response<SearchPoeple[]>>(`${this.apiUrl}/people`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      params,
      withCredentials: true,
      observe: 'response'
    })
  }

  // Enrollments
  addEnrollment(res: { childId: number, schoolType: string, classNumber: string, section: string, dataProcessingConsent: boolean, exitAuthorization: boolean, teamId: number, shirtId: number, parentNotes: string, managerNotes: string, year: number, weeks: Week[] }) {
    return this.http.post<Response<Enrollment>>(`${this.apiUrl}/enrollments`, res, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  getEnrollments(res: { year?: string, name?: string, surname?: string, schoolType?: string, classNumber?: string, section?: string, week?: string, limit?: number, offset?: number }) {
    const params: { [key: string]: string | number | boolean } = {};
    if (res.year) params['year'] = res.year;
    if (res.name) params['name'] = res.name;
    if (res.surname) params['surname'] = res.surname;
    if (res.schoolType) params['schoolType'] = res.schoolType;
    if (res.classNumber) params['classNumber'] = res.classNumber;
    if (res.section) params['section'] = res.section;
    if (res.week) params['week'] = res.week;

    if (res.limit) params['limit'] = res.limit;
    if (res.offset) params['offset'] = res.offset;

    return this.http.get<Response<Enrollment[]>>(`${this.apiUrl}/enrollments`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      params,
      withCredentials: true,
      observe: 'response'
    });
  }

  getEnrollmentById(id: string) {
    return this.http.get<Response<Enrollment>>(`${this.apiUrl}/enrollments/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  updateEnrollmentById(res: { id: string, schoolType: string, classNumber: string, section: string, dataProcessingConsent: string, exitAuthorization: string, teamId?: string, shirtId?: string, parentNotes?: string, managerNotes?: string }) {
    return this.http.put<Response<any>>(`${this.apiUrl}/enrollments/${res.id}`, res, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  deleteEnrollmentById(id: string) {
    return this.http.delete<Response<any>>(`${this.apiUrl}/enrollments/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  createEnrollment(res: { tree: Tree }) {
    return this.http.post<Response<any>>(`${this.apiUrl}/enrollments`, res, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  // Weeks

  getWeeksByYear(year: string) {
    return this.http.get<Response<Week[]>>(`${this.apiUrl}/weeks/year/${year}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  getWeekIdByDate(date: string) {
    return this.http.get<Response<Week[]>>(`${this.apiUrl}/weeks/date/${date}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  // Teams
  getAllTeams() {
    return this.http.get<Response<Team[]>>(`${this.apiUrl}/teams`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  updateTeamById(id: string, name: string, color: string) {
    return this.http.put<Response<any>>(`${this.apiUrl}/teams/${id}`, { name, color }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  deleteTeamById(id: string, force: boolean) {
    return this.http.delete<Response<any>>(`${this.apiUrl}/teams/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: { force },
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  createTeam(name: string, color: string) {
    return this.http.post<Response<any>>(`${this.apiUrl}/teams`, { name, color }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  // Shirts
  getAllShirts() {
    return this.http.get<Response<Shirt[]>>(`${this.apiUrl}/shirts`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  // Trees and people
  createTree(tree: Tree) {
    return this.http.post<Response<any>>(`${this.apiUrl}/people/tree`, tree, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  // Child
  searchChild(name: string, surname: string, limit?: number, offset?: number) {
    const params: { [key: string]: string | number | boolean } = {};
    if (name) params['name'] = name;
    if (surname) params['surname'] = surname;
    if (limit) params['limit'] = limit;
    if (offset) params['offset'] = offset;

    return this.http.get<Response<Child[]>>(`${this.apiUrl}/people/child`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      params,
      withCredentials: true,
      observe: 'response'
    });
  }

  getChildById(id: string) {
    return this.http.get<Response<Tree>>(`${this.apiUrl}/people/child/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  updateChildById(id: string, child: Child) {
    return this.http.put<Response<any>>(`${this.apiUrl}/people/child/${id}`, child, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  updateChildResidenceById(id: string, address: Address) {
    return this.http.put<Response<any>>(`${this.apiUrl}/people/child/${id}/residence`, address, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  deleteChildById(id: string) {
    return this.http.delete<Response<any>>(`${this.apiUrl}/people/child/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  // Parent
  getParentById(id: string) {
    return this.http.get<Response<Parent>>(`${this.apiUrl}/people/parent/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  updateParentById(id: string, parent: Parent) {
    return this.http.put<Response<any>>(`${this.apiUrl}/people/parent/${id}`, parent, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  deleteParentById(id: string) {
    return this.http.delete<Response<any>>(`${this.apiUrl}/people/parent/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    });
  }

  // Attendances
  addAttendance(enrollmentId: string, date: string, present: boolean, eatsAtOratory: boolean, eatsInBianco: boolean) {
    return this.http.post<Response<any>>(`${this.apiUrl}/attendances`, { enrollmentId, date, present, eatsAtOratory, eatsInBianco }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  getAttendancesByDate(date: string, schoolType?: string, classNumber?: string) {
    const params: { [key: string]: string | number | boolean } = {};
    if (schoolType) params['schoolType'] = schoolType;
    if (classNumber) params['classNumber'] = classNumber;

    return this.http.get<Response<AttendanceResponse[]>>(`${this.apiUrl}/attendances/date/${date}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      params,
      withCredentials: true,
      observe: 'response'
    })
  }

  updateAttendanceById(attendanceId: string, present: boolean, eatsAtOratory: boolean, eatsInBianco: boolean) {
    return this.http.put<Response<any>>(`${this.apiUrl}/attendances/${attendanceId}`, { present, eatsAtOratory, eatsInBianco }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  addMovementToAttendanceByChildId(childId: string, type: string, time: number, notes?: string) {
    return this.http.post<Response<any>>(`${this.apiUrl}/attendances/${childId}/movements`, { type, time, notes }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  getMovementByChildId(childId: string) {
    return this.http.get<Response<Movement[]>>(`${this.apiUrl}/attendances/${childId}/movements`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  updateMovementById(childId: string, movementId: string, type: string, time: number, notes?: string) {
    return this.http.put<Response<any>>(`${this.apiUrl}/attendances/${childId}/movements/${movementId}`, { type, time, notes }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  deleteMovementById(childId: string, movementId: string) {
    return this.http.delete<Response<any>>(`${this.apiUrl}/attendances/${childId}/movements/${movementId}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  // Leaderboard
  addScore(teamId: string, date: string, points: number, reason: string, userId?: string) {
    return this.http.post<Response<any>>(`${this.apiUrl}/leaderboard/scores`, { teamId, date, points, reason, userId }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  getLeaderboard(year: string) {
    return this.http.get<Response<Leaderboard[]>>(`${this.apiUrl}/leaderboard`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: { year },
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  getScores(year: string, limit = 25, offset = 0) {
    return this.http.get<Response<Score[]>>(`${this.apiUrl}/leaderboard/scores`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: { year, limit, offset },
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  updateScore(id: string, teamId: string, date: string, points: number, reason: string, userId?: string) {
    return this.http.put<Response<any>>(`${this.apiUrl}/leaderboard/scores/${id}`, { teamId, date, points, reason, userId }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  deleteScore(id: string) {
    return this.http.delete<Response<any>>(`${this.apiUrl}/leaderboard/scores/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }
}
