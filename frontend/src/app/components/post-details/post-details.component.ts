import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { API_ENDPOINT } from '../../../config';
import { Emitters } from '../../emitters/authEmitter';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent implements OnInit {
  slug: string;
  blogPost: any;
  user: boolean = false;
  admin: boolean = false;
  commentsForm: FormGroup;
  postId: any;
  username: "";
  errorMessage: string = '';


  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private FormBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.commentsForm = this.FormBuilder.group({
      postId: "",
      comment: "",
      username: "",
      commentId: ""
    })
    this.route.params.subscribe((params: { [x: string]: string; }) => {
      this.slug = params['slug'];
      console.log(this.slug)
      this.http.get(API_ENDPOINT + `/${this.slug}`)
        .subscribe(
          (data:any) => {
            this.blogPost = data; // Store the fetched data in the property
          },
          (error:any) => {
            console.error('Error fetching blog post:', error);
          }
        );
    })
    try {
      this.http.get(API_ENDPOINT + "/user", { withCredentials: true })
        .subscribe((res: any) => {
          this.username = res.username;
          if (res.role == "user") {
            this.user = true;
            Emitters.authEmitter.emit(true);
          } else if (res.role == "admin") {
            this.admin = true;
            Emitters.authEmitter.emit(true);
          } else {
            console.log(false)
          }
        },
          (err:any) => {
            console.log("There was an error getting the user, try logging in!")
          })
    } catch (error) {
      console.log("no user")
    }
  };

  delete(): void {
    this.http.post(API_ENDPOINT + "/delete", this.blogPost, {
      withCredentials: true
    }).subscribe(() => this.router.navigate(['/']), (err:any) => {
      console.log(err)
    })
    this.router.navigate(['/']);
  }

  like(comment: any): void {
    // let comments = this.commentsForm.getRawValue()
    // comments.postId = this.blogPost._id;
    // comments.username = this.username;
    // comments.commentId = comment;
    // console.log(comment._id);
    // this.http.post(API_ENDPOINT + '/like', comments, ({
    //   withCredentials: true
    // })).subscribe((err) => {
    //   console.log(err);
    // });
  }

  submit(): void {
    let comments = this.commentsForm.getRawValue()
    comments.postId = this.blogPost._id;
    comments.username = this.username;
    if (this.username != undefined) {
      this.http.post(API_ENDPOINT + '/comments', comments, ({
        withCredentials: true
      })).subscribe((err:any) => {
        console.log(err);
      })
    } else {
      this.errorMessage = "User not logged in! please log in an try again!";
    }
    window.location.reload()
  }

}
