import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule]
})
export class RegisterComponent {
  name: string = ''; 
  email: string = ''; 
  password: string = ''; 
  errorMessage: string = '';
  successMessage: string = ''; // 📌 Nuevo mensaje de éxito

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    console.log('Intentando registrarse...');
    
    if (!this.name.trim() || !this.email.trim() || !this.password.trim()) {
      this.errorMessage = '⚠️ Todos los campos son requeridos⚠️.';
      console.error(this.errorMessage);
      return;
    }

    this.errorMessage = ''; // 📌 Limpiar mensaje de error
    console.log('Enviando solicitud a AuthService...');
    
    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.successMessage = '🎉 Registro exitoso! Redirigiendo al login...';
        console.log(this.successMessage);

        // 📌 Esperar 3 segundos antes de redirigir
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
      console.error('Error en registro:', err);
      this.errorMessage = err.error?.error === 'El correo ya está registrado'
        ? '❌ Usuario ya registrado, por favor loguearse.'
        : err.error?.error || 'Error al registrar usuario.';
    }
    });
  }
}