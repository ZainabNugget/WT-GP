import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from '../../emitters/authEmitter';
import { API_ENDPOINT } from '../../../config';
import { CommonModule } from '@angular/common';
import { AdminComponent } from '../admin/admin.component';
import { PostDetailsComponent } from '../post-details/post-details.component';
import { BlogComponent } from '../blog/blog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AdminComponent,
    PostDetailsComponent,
    BlogComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  message: string= "";
  user: boolean = false;
  admin: boolean = false;

  constructor(private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
    this.http.get(API_ENDPOINT+"/user", { withCredentials: true })
      .subscribe((res: any) => {
        if(res.role == "user"){
          this.user = true;
        } else {
          this.admin = true;
        }
        this.router.navigate(['/'])
        this.message = `Hi ${res.username}`;
        Emitters.authEmitter.emit(true);
      }, (err) => {
        this.message = "You are not logged in!";
        Emitters.authEmitter.emit(false);
      })
  }
}
