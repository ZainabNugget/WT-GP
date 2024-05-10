import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Emitters } from '../../emitters/authEmitter';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit{
    authenticated = false

    constructor(private http:HttpClient){}
  ngOnInit(): void {
    Emitters.authEmitter.subscribe((auth:boolean) => {
      this.authenticated = auth
    })
  }

  logout():void{
    this.http.post("http://localhost:5001/api/logout",{}, {withCredentials:true})
    .subscribe(() => this.authenticated = false, (err)=>{
      console.log("Error", err)
    });
  }


}
