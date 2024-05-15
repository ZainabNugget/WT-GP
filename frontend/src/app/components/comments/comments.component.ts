import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { API_ENDPOINT } from '../../../config';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent  implements OnInit{
  form: FormGroup;
  errorMessage: string = "";
  comments: any;

  constructor(
    private FormBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
){}
  ngOnInit(): void {
    this.http.get<any>(API_ENDPOINT+'/comments/:postId')
      .subscribe(
        (data) => {
          this.comments = data; // Store the fetched data in the property
          console.log(this.comments)
        },
        (error) => {
          console.log('Error fetching comments:', error);
        }
      );
  }
  submit():void{
    this.http.post(API_ENDPOINT+'/comments', this.form, ({
      withCredentials: true
    })).subscribe((err)=>{
      console.log(err);
    })
  }
}
