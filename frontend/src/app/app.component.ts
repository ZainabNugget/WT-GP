import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
=======
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavigationComponent } from './components/navigation/navigation.component';
>>>>>>> origin/zainab

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationComponent,
<<<<<<< HEAD
    FooterComponent
=======
    LoginComponent,
    AdminComponent,
    HomeComponent
>>>>>>> origin/zainab
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
