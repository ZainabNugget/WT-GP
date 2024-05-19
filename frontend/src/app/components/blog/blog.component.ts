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
  randomPost: number = 0;

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    // Fetch the blog post data from the backend
    this.http.get<any>(API_ENDPOINT+'/blog-post')
      .subscribe(
        (data:any) => {
          this.blogPost = data; // Store the fetched data in the property
          this.randomPost = Math.floor(Math.random() * this.blogPost.length-1) + 1;
        },
        (error:any) => {
          console.error('Error fetching blog post:', error);
        }
      );
  }

  searchText: string = '';
  closestMatch: any;

  onSearchInput(event: any) {
    this.searchText = event.target.value.trim(); // Trim any leading/trailing whitespace
     this.closestMatch = this.blogPost.filter((post: { title: string; }) => {
      return post.title.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }
}
