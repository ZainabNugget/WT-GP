import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {  API_ENDPOINT } from "../../config";
import { Emitters } from '../emitters/authEmitter';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = API_ENDPOINT; //backend url
  constructor(private http: HttpClient) {}

  getUser(): Observable<any> {
    console.log("get the user yay")
    return this.http.get(`${this.apiUrl}/user`,{withCredentials:true}).pipe(
      catchError(this.handleError)
    );
  }

  getAllUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-users`,{withCredentials:true}).pipe(
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
    // console.error(errorMessage);
    return throwError(errorMessage);
  }
}
