import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { API_ENDPOINT } from '../../../config';
import { Emitters } from '../../emitters/authEmitter';
import { PostDetailsComponent } from '../post-details/post-details.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PostDetailsComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  form: FormGroup;
  errorMessage: string = "";
  constructor(
    private FormBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
){}

ngOnInit(): void {
  this.form = this.FormBuilder.group({
    title: "",
    body:"",
    summary: ""
 })
}

  post(): void{
      let post = this.form.getRawValue()
      if(post.title == '' || post.body == ''||post.summary==""){
        this.errorMessage = "Please enter your details!"
      } else {
        this.http.post(API_ENDPOINT+"/post", post, {
          withCredentials:true
        }).subscribe(() => {
          this.router.navigate(['/']);
        },(err) => {
          this.errorMessage = "We could not post your blog! :( "
          console.log("Error", err)
        })
        window.location.reload()
      } 
  }


}
