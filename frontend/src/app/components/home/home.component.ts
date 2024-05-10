import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from '../../emitters/authEmitter';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  message: string= "";

  constructor(private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
    this.http.get("http://localhost:5001/api/user", { withCredentials: true })
      .subscribe((res: any) => {
        if(res.role == "user"){
          this.router.navigate(['/'])
        } else {
          this.router.navigate(['/admin'])
        }
        this.message = `Hi ${res.username}`;
        Emitters.authEmitter.emit(true);
      }, (err) => {
        console.log("Error"+err)
        this.message = "You are not logged in!";
        Emitters.authEmitter.emit(false);
      })
  }
}
