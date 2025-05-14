import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';  // Asegúrate de importar correctamente el servicio
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,  // Esto indica que LoginComponent es independiente
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule, 
    FormsModule
  ]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // Para mostrar mensajes de error

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    // Llamada al servicio de autenticación
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Si el login es exitoso, redirige a /dashboard
        console.log('Login exitoso', response);
        this.router.navigate(['/dashboard']);  // Redirige al dashboard
      },
      error: (err) => {
        // Si ocurre un error, muestra un mensaje
        console.error('Error en login', err);
        this.errorMessage = 'Credenciales incorrectas';  // Muestra mensaje de error
      }
    });
  }
}
