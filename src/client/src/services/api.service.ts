import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '../models/Response.model';
import User from '../models/User.model';
import { Theme } from '../models/Theme.model';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.server + '/api/v1';

  constructor(private http: HttpClient) { }

  // create login method
  login(username: string, password: string) {
    return this.http.post<Response<any>>(`${this.baseUrl}/user/login`, {
      username,
      password,
    },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        responseType: "json",
        withCredentials: true,
        observe: 'response'
      });
  }

  logout() {
    return this.http.post<Response<any>>(`${this.baseUrl}/user/logout`, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'

    })
  }

  getUser() {
    return this.http.get<Response<User>>(`${this.baseUrl}/user`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  setUserTheme(theme: Theme) {
    return this.http.post<Response<any>>(`${this.baseUrl}/user/theme`, { theme }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }

  setUserPassword(oldest: string, newest: string) {
    return this.http.post<Response<any>>(`${this.baseUrl}/user/password`, { old: oldest, new: newest }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: "json",
      withCredentials: true,
      observe: 'response'
    })
  }
}
