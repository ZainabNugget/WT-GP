import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestserviceService {
  private baseUrl = "http://localhost:5001"; //backend url
  constructor(private http: HttpClient) {}

  validateLogin(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/login`, { email, password });
  }
}
