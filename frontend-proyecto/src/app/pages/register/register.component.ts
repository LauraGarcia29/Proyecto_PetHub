import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule]
})
export class RegisterComponent {
  name: string = ''; // 📌 Definir la propiedad
  email: string = ''; // 📌 Definir la propiedad
  password: string = ''; // 📌 Esto es lo que falta

  constructor() {}

  register() {
    console.log('Intentando registrarse...');
    
    if (!this.name || !this.email || !this.password) {
      console.error('Todos los campos son requeridos');
      return;
    }

    console.log('Registro exitoso:', { name: this.name, email: this.email, password: this.password });
  }
}