import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EmitterVisitorContext, ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms'; // Import NgForm for form data access
import { Router } from '@angular/router';
import { Emitters } from '../../emitters/authEmitter';
import { TestserviceService } from '../../service/testservice.service';

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
export class LoginComponent  implements OnInit{
  form: FormGroup;
  errorMessage: string = '';

  constructor(
      private FormBuilder: FormBuilder,
      private http: HttpClient,
      private router: Router
  ){}

  ngOnInit(): void {
    this.form = this.FormBuilder.group({
      email:'',
      password:''
   })
  }

  submit() : void {
    let user = this.form.getRawValue()
    // IT works yay
  if(!this.validateEmail(user.email)){
      this.errorMessage = "Email is invalid, please try again!"
    } else {
      this.http.post("http://localhost:5001/api/login", user, {
        withCredentials:true
      }).subscribe(
        ()=>{
          this.router.navigate(['/'])
          Emitters.authEmitter.emit(true);
        },
        (err) => {
        this.errorMessage = err.error.message
        console.log("Error", err.error.message)
        Emitters.authEmitter.emit(false);
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
