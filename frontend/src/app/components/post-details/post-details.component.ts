import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API_ENDPOINT } from '../../../config';
import { Emitters } from '../../emitters/authEmitter';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [
    CommentsComponent,
    CommonModule
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

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router){}

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      this.slug = params['slug'];
      console.log(this.slug)
      this.http.get(API_ENDPOINT+`/${this.slug}`)
      .subscribe(
        (data) => {
          this.blogPost = data; // Store the fetched data in the property
        },
        (error) => {
          console.error('Error fetching blog post:', error);
        }
      );
    })
    try {
      this.http.get(API_ENDPOINT+"/user", { withCredentials: true })
      .subscribe((res: any) => {
        if(res.role == "user"){
          this.user = true;
          Emitters.authEmitter.emit(true);
        } else if(res.role =="admin"){
          this.admin = true;
          Emitters.authEmitter.emit(true);
        } else {
          console.log(false)
        }
      })
    } catch (error) {
      console.log("no user")
    }
    this.http.post(API_ENDPOINT+"/post-comments",this.postId,{withCredentials: true})
    .subscribe((data) => {
      this.comments = data; // Store the fetched data in the property
      console.log(data)
    },
    (error) => {
      console.error('Error fetching blog post:', error);
    }
  )};

  delete() :void {
    this.http.post(API_ENDPOINT+"/delete", this.blogPost, {
      withCredentials:true
    }).subscribe(()=>this.router.navigate(['/']),(err)=>{
      console.log(err)
    })
    this.router.navigate(['/']);
  }
  
}
