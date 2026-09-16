import { inject, Service } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PagedResponse, Response } from '../models/Response.model';
import { Theme } from '../models/Theme.model';
import { api, request } from './api-client';
import Enrollment, { EnrollmentSearch } from '../models/Enrollment.model';
import {
  PeopleGetRequest,
  EnrollmentCreateRequest,
  EnrollmentGetRequest,
  EnrollmentUpdateRequest,
  FamilyEnrollmentCreateRequest,
  TeamCreateRequest,
  TeamUpdateRequest,
  SchoolCreateRequest,
  ClassCreateRequest,
} from '../models/Request.model';
import Week from '../models/Week.model';
import Team from '../models/Team.model';
import { Shirt } from '../models/Shirt.model';
import {
  Child,
  ChildResponse,
  ChildSearch,
  FamilyMember,
  Parent,
  ParentResponse,
  ParentSearch,
  PeopleSearch,
} from '../models/Family.model';
import { AttendanceSearch } from '../models/Attendances.model';
import { AttendancesStat } from '../models/Stat.model';
import { toDateOnly } from './utils.service';
@Service()
export class ApiService {
  private http = inject(HttpClient);

  private baseUrl = environment.server + '/api/v1';

  // User
  login(username: string, password: string) {
    return request(api.user.login.$post({ json: { username, password } }));
  }

  logout() {
    return request(api.user.logout.$post());
  }

  getUser() {
    return request(api.users.self.$get());
  }

  setUserTheme(theme: Theme) {
    return request(api.user.theme.$put({ json: { theme } }));
  }

  setUserPassword(oldPassword: string, newPassword: string) {
    return request(
      api.user.password.$put({ json: { oldPassword, newPassword } })
    );
  }

  // Enrollments
  getEnrollments(params: EnrollmentGetRequest) {
    return this.http.get<PagedResponse<EnrollmentSearch>>(
      `${this.baseUrl}/enrollments`,
      {
        params: { ...params },
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  getEnrollmentById(id: string | number) {
    return this.http.get<Response<Enrollment>>(
      `${this.baseUrl}/enrollments/${id.toString()}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  updateEnrollment(enrollment: EnrollmentUpdateRequest) {
    return this.http.put<Response<Enrollment>>(
      `${this.baseUrl}/enrollments/${enrollment.id}`,
      enrollment,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  deleteEnrollment(id: string | number) {
    return this.http.delete<Response<any>>(
      `${this.baseUrl}/enrollments/${id.toString()}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  createEnrollment(enrollment: EnrollmentCreateRequest) {
    return this.http.post<Response<number>>(
      `${this.baseUrl}/enrollments`,
      enrollment,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  // Weeks
  getWeeks(year: number | string) {
    return this.http.get<Response<Week[]>>(`${this.baseUrl}/weeks`, {
      params: { year: year.toString() },
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    });
  }

  // Teams
  getTeams() {
    return this.http.get<Response<Team[]>>(`${this.baseUrl}/teams`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    });
  }

  createTeam(params: TeamCreateRequest) {
    return this.http.post<Response<number>>(`${this.baseUrl}/teams`, params, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    });
  }

  updateTeam(team: TeamUpdateRequest) {
    return this.http.put<Response<null>>(
      `${this.baseUrl}/teams/${team.id}`,
      team,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  deleteTeam(id: string | number) {
    return this.http.delete<Response<null>>(
      `${this.baseUrl}/teams/${id.toString()}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  // Shirts
  getShirts() {
    return this.http.get<Response<Shirt[]>>(`${this.baseUrl}/shirts`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    });
  }

  // Families
  getManagedPeople() {
    return this.http.get<Response<FamilyMember[]>>(`${this.baseUrl}/users`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    });
  }

  getPeople(params: PeopleGetRequest) {
    return this.http.get<PagedResponse<PeopleSearch>>(
      `${this.baseUrl}/people`,
      {
        params: { ...params },
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  getChilds(params: PeopleGetRequest) {
    return this.http.get<PagedResponse<ChildSearch>>(`${this.baseUrl}/childs`, {
      params: { ...params },
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    });
  }

  getChildById(id: string | number) {
    return this.http.get<Response<ChildResponse>>(
      `${this.baseUrl}/childs/${id.toString()}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  createChild(child: Child) {
    return this.http.post<Response<number>>(`${this.baseUrl}/childs`, child, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    });
  }

  updateChild(child: Child) {
    return this.http.put<Response<null>>(
      `${this.baseUrl}/childs/${child.id}`,
      child,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  deleteChild(id: string | number) {
    return this.http.delete<Response<any>>(
      `${this.baseUrl}/childs/${id.toString()}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  getParents(params: PeopleGetRequest) {
    return this.http.get<PagedResponse<ParentSearch>>(
      `${this.baseUrl}/parents`,
      {
        params: { ...params },
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  getParentById(id: string | number) {
    return this.http.get<Response<ParentResponse>>(
      `${this.baseUrl}/parents/${id}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  createParent(parent: Parent) {
    return this.http.post<Response<number>>(`${this.baseUrl}/parents`, parent, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    });
  }

  updateParent(parent: Parent) {
    return this.http.put<Response<null>>(
      `${this.baseUrl}/parents/${parent.id}`,
      parent,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  deleteParent(id: string | number, deleteChildren: boolean = false) {
    return this.http.delete<Response<any>>(
      `${this.baseUrl}/parents/${id.toString()}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: { deleteChildren: deleteChildren },
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  createFamilyWithEnrollment(family: FamilyEnrollmentCreateRequest) {
    return this.http.post<Response<number>>(`${this.baseUrl}/family`, family, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    });
  }

  // Attendance
  getAttendances(params: { date: string }) {
    return this.http.get<Response<AttendanceSearch[]>>(
      `${this.baseUrl}/attendances`,
      {
        params: { ...params },
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  addAttendance(params: { date: string | Date; userId: number | string }) {
    return this.http.post<Response<number>>(
      `${this.baseUrl}/attendances`,
      params,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  deleteAttendance(id: string | number) {
    return this.http.delete<Response<null>>(
      `${this.baseUrl}/attendances/${id.toString()}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  updateAttendance(
    id: string | number,
    date: string | Date,
    eatsInOratory: boolean
  ) {
    return this.http.put<Response<null>>(
      `${this.baseUrl}/attendances/${id}`,
      { date, eatsInOratory },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  // Schools and classes
  getSchools(query?: string) {
    return this.http.get<Response<any>>(`${this.baseUrl}/schools`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
      params: query ? { query } : {},
    });
  }

  createSchool(school: SchoolCreateRequest) {
    return this.http.post<Response<number>>(`${this.baseUrl}/schools`, school, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    });
  }

  getClasses(query?: string) {
    return this.http.get<Response<any>>(`${this.baseUrl}/classes`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
      params: query ? { query } : {},
    });
  }

  createClass(classData: ClassCreateRequest) {
    // La rotta e' POST /classes: /schools/classes non esiste sul server.
    return this.http.post<Response<number>>(
      `${this.baseUrl}/classes`,
      classData,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  // Stats
  /**
   * Presenze del giorno raggruppate per scuola e classe.
   *
   * L'endpoint e' GET /attendances/grouped: /stats/attendances non esiste (il
   * server ha /stats/users/{year}, che e' un'altra cosa). La data va passata
   * come YYYY-MM-DD, altrimenti il server risponde 422 "Invalid date".
   */
  getAttendancesStat(date: string | Date) {
    return this.http.get<Response<AttendancesStat>>(
      `${this.baseUrl}/attendances/grouped`,
      {
        params: { date: toDateOnly(date) },
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
        withCredentials: true,
        observe: 'response',
      }
    );
  }
}
