import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { API_ENDPOINT } from '../../../config';
import { Emitters } from '../../emitters/authEmitter';
import { ApiService } from '../../service/api.service';

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
  slug: string; // for the post to be handled properly
  blogPost: any; // gets all the posts
  user: boolean = false; // returns true if role is user
  admin: boolean = false; // return true if role admin
  comments: any; // get all the comments 
  postId: any; // the current postId
  commentsForm: FormGroup; // comment info 
  username: string = ""; // current users username
  errorMessage: string = ""; // error logging
  sameuser: boolean = false; 
  loggedIn = false;

  // All needed variables for the post-details page
  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private FormBuilder: FormBuilder,
    private api: ApiService) { }

  ngOnInit(): void {
    this.commentsForm = this.FormBuilder.group({
      postId: "",
      comment: "",
      username: "",
      commentId: ""
    })
    // Get the post slug from the parameters of the website
    this.route.params.subscribe((params: { [x: string]: string; }) => {
      this.slug = params['slug'];
      // Error logging
      // console.log(this.slug)
      
      // Get the post based on slug
      this.http.get(API_ENDPOINT + `/${this.slug}`)
        .subscribe(
          (data: any) => {
            // Get all data into the blogpost var
            this.blogPost = data; // Store the fetched data in the property

            // Error logging
            // console.log(this.blogPost.approved)
          },
          (error: any) => {
            this.errorMessage = "Error getting post";
          }
        );
    })
    // ================== GET SPECIFIC USER  ==================
    try {
      this.api.getUser().subscribe((res: any) => {
          this.username = res.username; //save the current username
          if (this.username == undefined) { // a bunch of error logging
            console.log("Not logged in!");
            this.loggedIn = false;
          } else {
            this.loggedIn = true;
            if (this.username == this.blogPost.username) {
              this.sameuser = true; // for the approval buttons
              console.log("This is the same user that made the post :) ")
            } else {
              this.sameuser = false;
              console.log("Not the same user wah")
            }
          }

          // Get the role of user or admin
          if (res.role == "user") {
            this.user = true;
            Emitters.authEmitter.emit(true); // for navigation
          } else if (res.role == "admin") {
            this.admin = true;
            Emitters.authEmitter.emit(true); // for navigation
          } else {
            this.username = "";
          }
        },
          (err: any) => {
            // Error logging
            // console.log("Not logged in!")
          })
    } catch (error) {
      console.log("no user" + error)
    }
    // ================== END GET USER  ==================
  };

  // ================== DELETE A POST (ADMIN ONLY) ==================
  delete(): void {
    // Send request to delete the post based on blogpost information
    this.http.post(API_ENDPOINT + "/delete", this.blogPost, {
      withCredentials: true
    }).subscribe(() => this.router.navigate(['/']), (err: any) => {
      console.log(err)
    })
    // Navigate to home page after your done
    this.router.navigate(['/']);
  }
  // ================== END (ADMIN ONLY) ==================


  // ================== LIKE A POST ==================
  like(comment: any): void {
    // Get the comment you want to like
    let comments = this.commentsForm.getRawValue()
    comments.postId = this.blogPost._id;
    comments.username = this.username;
    comments.commentId = comment._id;

    // Post to the server to like the comment
    this.http.post(API_ENDPOINT + '/like', comments, ({
      withCredentials: true
    })).subscribe((err: any) => {
      console.log(err);
    });

    // Reload to show the final work :()
    window.location.reload();
  }
  // ================== END  ==================

  // ================== SUBMIT A COMMENT ==================
  submit(): void {
    // Get the users comment info into a form
    let comments = this.commentsForm.getRawValue()
    comments.postId = this.blogPost._id;
    comments.username = this.username;

    // Some error handling!
    if (!this.loggedIn) {
      this.errorMessage = "User not logged in!"
    } else {
      if (this.username == undefined) {
        this.errorMessage = "User not logged in! please log in an try again!";
      } else {
        this.http.post(API_ENDPOINT + '/comments', comments, {
          withCredentials: true
        }).subscribe((err: any) => {
          this.errorMessage = "An error occured! Try again later";
        });
      }
      window.location.reload()
    }
  }
  // ================== END ==================

  disapprove(): void {
    this.blogPost.approved = false;
    this.http.post(API_ENDPOINT + '/approve', this.blogPost, { withCredentials: true })
      .subscribe((err: any) => { console.log(err) });
  }

  approve(): void {
    this.blogPost.approved = true;
    this.http.post(API_ENDPOINT + '/approve', this.blogPost, { withCredentials: true })
      .subscribe((err: any) => { console.log(err) });
  }

  // ================== APPROVE COMMENT BY USER ==================
  approveComment(comment: any): void {
    let comments = this.commentsForm.getRawValue()
    comments.postId = this.blogPost._id;
    comments.commentId = comment._id;
    // pass in all the comment information
    this.http.post(API_ENDPOINT + '/approve-comment', comments, { withCredentials: true })
      .subscribe((err: any) => { console.log("There is an error hmm" + err) });
  }
  // ================== END ==================

}
