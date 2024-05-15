import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Router } from 'express';
import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    {
        path: '', component:HomeComponent
    }, 
    {
        path: 'login', component:LoginComponent
    }, 
    {
        path: 'admin', component:AdminComponent
    },
    {
        path: 'register', component:RegisterComponent
    }
];

