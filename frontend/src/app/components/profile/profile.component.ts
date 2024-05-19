import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { API_ENDPOINT } from '../../../config';
import { Emitters } from '../../emitters/authEmitter';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  users: any;
  allUsers: any;
  admin: boolean = false;
  constructor(private api:ApiService,
    private http:HttpClient,
    private router: Router){}
  ngOnInit(): void {
    // Get all users
    this.api.getUser().subscribe(
        (data:any) => {
          this.users = data; // Store the fetched data in the property
          if(this.users.role == "admin"){
            this.admin = true;
          }
          Emitters.authEmitter.emit(true);
          console.log(this.users);
        },
        (error:any) => {
          Emitters.authEmitter.emit(false);
          this.router.navigate(['/'])
          console.error('Error fetching blog post:', error);
        }
      );
      this.api.getAllUser().subscribe(
        (data:any) => {
          this.allUsers = data; // Store the fetched data in the property
          console.log(this.users);
        },
        (error:any) => {
          console.error('Error fetching users:', error);
        }
      );
  }

}
