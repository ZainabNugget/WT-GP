import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {  API_ENDPOINT } from "../../config";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = API_ENDPOINT; //backend url
  constructor(private http: HttpClient) {}
  // logout(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/logout`);
  // }
  // getUser(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/user`).pipe(
  //     catchError(this.handleError)
  //   );
  // }

    logout(): Observable<any> {
      return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
        catchError(this.handleError)
      );
    }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
