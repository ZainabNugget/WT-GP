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
    CommonModule, // we need this for ngIf and ngFor operations
    ReactiveFormsModule, // to build the form
    PostDetailsComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  username: string = ""; // will contain the current username
  form: FormGroup; // to create the form that will be sent over to the server.
  errorMessage: string = ""; // for error logging
  filename: string = ""; // filename for the picture.

  // All needed variables
  constructor(
    private FormBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    // Build the form with form builder.
    this.form = this.FormBuilder.group({
      title: "",
      body: "",
      summary: "",
      username: "",
      filename: "../assets/images/"
    });
    //  Use the api service to get the user from the server
    this.apiService.getUser().subscribe((res: any) => {
      // equal the username to the response username,
      this.username = res.username;
      Emitters.authEmitter.emit(true);
    }, (err: any) => {
      // Error logging
      //  console.log("Not logged in!")
      Emitters.authEmitter.emit(false);
    })
  }

  post(): void {
    // Get the raw data to manipulate later
    let post = this.form.getRawValue()
    // Post username get
    post.username = this.username;
    // Get the file name
    post.filename += this.filename;

    // Checks, if empty dont proceed.
    if (post.title == '' || post.body == '' || post.summary == "") {
      this.errorMessage = "Please enter your details!"
    } else {
      this.http.post(API_ENDPOINT + "/post", post, {
        withCredentials: true
      }).subscribe(() => {
        // After successful postage, redirect the user to the home page
        this.router.navigate(['/']);
        this.errorMessage = "POSTED!  ";
      }, (err: any) => {
        this.errorMessage = "We could not post your blog! :( "
        // Error logging
        // console.log("Error", err)
      })
    }
  }

  upload(event: any) {
    // For image upload, on the event of a file upload :)
    const file = event.target.files[0];
    // Error logging
    // console.log(file.originalname);
    const formData = new FormData();
    formData.append("file", file);
    // Post to the server to save a file.
    this.http.post(API_ENDPOINT + '/file', formData, { withCredentials: true })
      .subscribe((err: any) => { console.log(err) });
    let post = this.form.getRawValue();
    this.filename = file.name;
  }

}
