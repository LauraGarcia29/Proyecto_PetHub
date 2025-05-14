import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import necesario
import { LoginComponent } from './pages/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,     
    LoginComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend-proyecto';
}
