import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Emitters } from '../../emitters/authEmitter';
import { API_ENDPOINT } from '../../../config';
import { Router } from '@angular/router';
import { EmitterVisitorContext, ThisReceiver } from '@angular/compiler';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms'; // Import NgForm for form data access
import { TestserviceService } from '../../service/testservice.service';
import { ApiService } from '../../service/api.service';
import { catchError } from 'rxjs';


@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit{
    authenticated = false
    errorMessage: string ="";

    constructor(private http:HttpClient,
      private router: Router,
      private apiService: ApiService){}
  ngOnInit(): void {
    Emitters.authEmitter.subscribe((auth:boolean) => {
      this.authenticated = auth
    })
  }

  logout(): void {
    if(!this.authenticated){
      console.log("yippe")
    } else {
      this.http.post(API_ENDPOINT+"/logout",{},{ withCredentials:true
    })
    .subscribe(( )=>{
      this.authenticated = false
      Emitters.authEmitter.emit(false);
    },(err:any)=>{
      console.log("its not working")
      console.log(err)
    });
    }
  
  }

}
