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
  comments: any;
  postId: any;
  commentsForm: FormGroup;
  username: string = "";
  errorMessage: string ="";
  sameuser: boolean = false;

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
    this.route.params.subscribe(params => {
      this.slug = params['slug'];
      console.log(this.slug)
      this.http.get(API_ENDPOINT + `/${this.slug}`)
        .subscribe(
          (data) => {
            this.blogPost = data; // Store the fetched data in the property
            console.log(this.blogPost.approved)
          },
          (error) => {
            console.error('Error fetching blog post:', error);
          }
        );
    })
     // ================== GET SPECIFIC USER  ==================
    try {
      this.http.get(API_ENDPOINT + "/user", { withCredentials: true })
        .subscribe((res: any) => {
          this.username = res.username;
          if(this.username == undefined){
            console.log("Not logged in!");
          } else {
            if(this.username == this.blogPost.username){
              this.sameuser = true;
              console.log("This is the same user that made the post :) ")
            } else {
              this.sameuser= false;
              console.log("Not the same user wah")
            }
          }
          // Get the role of user or admin
          if (res.role == "user") {
            this.user = true;
            Emitters.authEmitter.emit(true);
          } else if (res.role == "admin") {
            this.admin = true;
            Emitters.authEmitter.emit(true);
          } else {
            this.username = "";
          }
        },
          (err) => {
            console.log("There was an error getting the user, try logging in!"+err)
          })
    } catch (error) {
      console.log("no user"+error)
    }
     // ================== END GET USER  ==================
  };

    // ================== DELETE A POST (ADMIN ONLY) ==================
  delete(): void {
    this.http.post(API_ENDPOINT + "/delete", this.blogPost, {
      withCredentials: true
    }).subscribe(() => this.router.navigate(['/']), (err) => {
      console.log(err)
    })
    this.router.navigate(['/']);
  }
    // ================== END (ADMIN ONLY) ==================


  // ================== LIKE A POST ==================
  like(comment: any): void {
    let comments = this.commentsForm.getRawValue()
    comments.postId = this.blogPost._id;
    comments.username = this.username;
    comments.commentId = comment._id;
    this.http.post(API_ENDPOINT + '/like', comments, ({
      withCredentials: true
    })).subscribe((err) => {
      console.log(err);
    });
    // Reload to show the final work :()
    window.location.reload();
  }
  // ================== END  ==================

    // ================== SUBMIT A COMMENT ==================
  submit(): void {
    let comments = this.commentsForm.getRawValue()
    comments.postId = this.blogPost._id;
    comments.username = this.username;
    if (this.username == undefined) {
      this.errorMessage = "User not logged in! please log in an try again!";
    } else {
      this.http.post(API_ENDPOINT + '/comments', comments, ({
        withCredentials: true
      })).subscribe((err) => {
        console.log(err);
      });
    }
    window.location.reload()
  }
    // ================== END ==================

  disapprove():void{
    this.blogPost.approved = false; 
    this.http.post(API_ENDPOINT+'/approve', this.blogPost,{withCredentials:true})
    .subscribe((err)=>{console.log(err)});
  }

  approve():void{
    this.blogPost.approved = true; 
    this.http.post(API_ENDPOINT+'/approve', this.blogPost,{withCredentials:true})
    .subscribe((err)=>{console.log(err)});
  }

    // ================== APPROVE COMMENT BY USER ==================
  approveComment(comment: any):void{
    let comments = this.commentsForm.getRawValue()
    comments.postId = this.blogPost._id;
    comments.commentId = comment._id;
    // pass in all the comment information
    this.http.post(API_ENDPOINT+'/approve-comment', comments,{withCredentials:true})
    .subscribe((err)=>{console.log("There is an error hmm"+err)});
  }
    // ================== END ==================


}
