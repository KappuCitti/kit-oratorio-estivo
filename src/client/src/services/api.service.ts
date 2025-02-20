import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.server + '/api/v1';

  constructor(private http: HttpClient) {}

  // create login method
  login(username: string, password: string) {
    return this.http.post(`${this.baseUrl}/login`, {
      username,
      password,
    });
  }
}
