import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


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
    this.form = this.FormBuilder.group({
      username: "",
      email:"",
      password:""
   })
  }

  submit() : void {
    let user = this.form.getRawValue()

    // IT works yay
    if(user.username == '' || user.email == '' || user.password == ''){
      this.errorMessage = "Please enter your details!"
    } else if(!this.validateEmail(user.email)){
      this.errorMessage = "Email is invalid, please try again!"
    } else {
      this.http.post("http://localhost:5001/api/register", user, {
        withCredentials:true
      }).subscribe(()=>this.router.navigate(['/']),(err) => {
        this.errorMessage = err.error.message
        console.log("Error", err.error.message)
      })
    }
  }

  validateEmail = (email: any) => {
    var emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/; //regex to match email
      if(email.match(emailRegex)){
        return true;
      } else {
        return false;
      }
  }

}
