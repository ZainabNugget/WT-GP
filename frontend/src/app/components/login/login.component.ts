import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EmitterVisitorContext, ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms'; // Import NgForm for form data access
import { Router } from '@angular/router';
import { Emitters } from '../../emitters/authEmitter';
import { TestserviceService } from '../../service/testservice.service';
import { API_ENDPOINT } from '../../../config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup; // Form for server
  errorMessage: string = ''; // Error logging

  // All variables needed for the login to work
  constructor(
    private FormBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Build the form using Form Builder
    this.form = this.FormBuilder.group({
      email: '',
      password: ''
    })
  }

  submit(): void {
    let user = this.form.getRawValue()
    // Check for any faults, validation of the email 
    if (user.username == '' || user.email == '' || user.password == '') {
      // Error logging!
      this.errorMessage = "Please enter your details!"
    } else if (!this.validateEmail(user.email)) {
      // Error  logging!
      this.errorMessage = "Email is invalid, please try again!"
    } else {
      // Send to server and handle the logging in process, send the user information as well
      this.http.post(API_ENDPOINT + "/login", user, {
        withCredentials: true
      }).subscribe(
        (res:any) => {
          // Navigate after successful login!
          this.router.navigate(['/']);
          // True for navigation
          Emitters.authEmitter.emit(true);
        },
        (err: any) => {
          // Error loggin
          this.errorMessage = err.error.message
          // console.log("Error", err.error.message)
          Emitters.authEmitter.emit(false);
        });
    }
  }



  validateEmail = (email: any) => {
    var emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/; //regex to match email
    if (email.match(emailRegex)) {
      return true;
    } else {
      return false;
    }
  }

}
