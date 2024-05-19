import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { API_ENDPOINT } from '../../../config';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  form: FormGroup;
  errorMessage: string = '';

  constructor(
      private FormBuilder: FormBuilder,
      private http: HttpClient,
      private router: Router
  ){}

  ngOnInit(): void {
    // Build the form
    this.form = this.FormBuilder.group({
      username: "",
      email:"",
      password:""
   })
  }

  submit() : void {
    let user = this.form.getRawValue()
    // Check if empty, and also validate the email
    if(user.username == '' || user.email == '' || user.password == ''){
      this.errorMessage = "Please enter your details!"
    } else if(!this.validateEmail(user.email)){
      this.errorMessage = "Email is invalid, please try again!"
    } else {
      // Post to server to register the user.
      this.http.post(API_ENDPOINT+"/register", user, {
        withCredentials:true
        // Navigate the user to the homepage after successful registeration
      }).subscribe(()=>this.router.navigate(['/']),(err:any) => {
        this.errorMessage = err.error.message
        // Error log
        // console.log("Error", err.error.message)
      })
    }
  }

  // Validate email with regex
  validateEmail = (email: any) => {
    var emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/; //regex to match email
      if(email.match(emailRegex)){
        return true;
      } else {
        return false;
      }
  }

}
