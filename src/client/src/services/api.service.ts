import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '../models/Response.model';
import User from '../models/User.model';
import { Theme } from '../models/Theme.model';
import Enrollment, { EnrollmentSearch } from '../models/Enrollment.model';
import {
  PeopleGetRequest,
  EnrollmentCreateRequest,
  EnrollmentGetRequest,
  EnrollmentUpdateRequest,
  FamilyEnrollmentCreateRequest,
  TeamCreateRequest,
  TeamUpdateRequest,
} from '../models/Request.model';
import Week from '../models/Week.model';
import Team from '../models/Team.model';
import { Shirt } from '../models/Shirt.model';
import {
  Child,
  ChildResponse,
  ChildSearch,
  Parent,
  ParentResponse,
  ParentSearch,
  PeopleSearch,
} from '../models/Family.model';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.server + '/api/v1';

  constructor(private http: HttpClient) { }

  // User
  login(username: string, password: string) {
    return this.http.post<Response<any>>(
      `${this.baseUrl}/user/login`,
      {
        username,
        password,
      },
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

  logout() {
    return this.http.post<Response<any>>(
      `${this.baseUrl}/user/logout`,
      {},
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

  getUser() {
    return this.http.get<Response<User>>(`${this.baseUrl}/user`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    });
  }

  setUserTheme(theme: Theme) {
    return this.http.put<Response<any>>(
      `${this.baseUrl}/user/theme`,
      { theme },
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

  setUserPassword(oldPassword: string, newPassword: string) {
    return this.http.put<Response<any>>(
      `${this.baseUrl}/user/password`,
      { oldPassword, newPassword },
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

  // Enrollments
  getEnrollments(params: EnrollmentGetRequest) {
    return this.http.get<
      Response<{ enrollments: EnrollmentSearch[]; count: number }>
    >(`${this.baseUrl}/enrollments`, {
      params: { ...params },
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    });
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
  getPeople(params: PeopleGetRequest) {
    return this.http.get<Response<{ people: PeopleSearch[]; count: number }>>(
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
    return this.http.get<Response<{ childs: ChildSearch[]; count: number }>>(
      `${this.baseUrl}/childs`,
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
    return this.http.put<Response<null>>(`${this.baseUrl}/childs/${child.id}`, child, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    }
    )
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
    return this.http.get<Response<{ parents: ParentSearch[]; count: number }>>(
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
    return this.http.get<Response<ParentResponse>>(`${this.baseUrl}/parents/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    });
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
    return this.http.put<Response<null>>(`${this.baseUrl}/parents/${parent.id}`, parent, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
    })
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
}
