import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { API_ENDPOINT } from '../../../config';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  blogPost: any;
  title: string = "";
  body: string ="";
  showAll: boolean = true;

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    // Fetch the blog post data from the backend
    this.http.get<any>(API_ENDPOINT+'/blog-post')
      .subscribe(
        (data) => {
          this.blogPost = data; // Store the fetched data in the property
          console.log(this.blogPost)
        },
        (error) => {
          console.error('Error fetching blog post:', error);
        }
      );
  }

  click() : void{

  }
}
