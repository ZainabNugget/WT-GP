import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs';
import { API_ENDPOINT } from '../../../config';
import { Emitters } from '../../emitters/authEmitter';
import { ApiService } from '../../service/api.service';
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
  username: string="";
  form: FormGroup;
  errorMessage: string = "";
  filename: string = "";

  constructor(
    private FormBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService
){}

ngOnInit(): void {
  this.form = this.FormBuilder.group({
    title: "",
    body:"",
    summary: "",
    username:"",
    filename:"../../../assets/images/"
 });
 this.http.get(API_ENDPOINT+"/user", { withCredentials: true })
 .subscribe((res: any) => {
    this.username = res.username;
   Emitters.authEmitter.emit(true);
 }, (err: any) => {
   console.log("Not logged in!")
   Emitters.authEmitter.emit(false);
 })
}

  post(): void{
      let post = this.form.getRawValue()
      post.username = this.username;
      post.filename += this.filename;
      if(post.title == '' || post.body == ''||post.summary==""){
        this.errorMessage = "Please enter your details!"
      } else {
        this.http.post(API_ENDPOINT+"/post", post, {
          withCredentials:true
        }).subscribe(() => {
          this.router.navigate(['/']);
          this.errorMessage = "POSTED!  ";
        },(err: any) => {
          this.errorMessage = "We could not post your blog! :( "
          console.log("Error", err)
        })
      } 
  }

  upload(event: any){
      const file =event.target.files[0];
      console.log(file.originalname);
      const formData = new FormData();
      formData.append("file", file);

      this.http.post(API_ENDPOINT+'/file',formData,{withCredentials:true})
      .subscribe((err:any)=>{console.log(err)});
      let post = this.form.getRawValue();
      this.filename = file.name;
  }



}
