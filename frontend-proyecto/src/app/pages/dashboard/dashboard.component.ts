  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { Router } from '@angular/router';
  import { RouterModule } from '@angular/router';
  import { FormsModule } from '@angular/forms';

  @Component({
    standalone: true,
    selector: 'app-dashboard',
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    })
    
  export class DashboardComponent {
    userData: any = null;
    mostrarFormulario = false; // Controla la visibilidad del formulario
    mostrarFormularioCita = false    

    petData = { NAME: '', SPECIE: '', AGE: null, USER_ID: 1 };
    mensajeExito = '';
    mensajeError = '';

    appointmentData = { DATE: '', TYPE: 'consulta', PET_ID: null, USER_ID: 1, SPECIALIST_ID: null };
    mensajeExitoCita = '';
    mensajeErrorCita = '';


    toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario; // Alternar visibilidad
    this.mensajeExito = ''; // Limpiar mensajes cuando se abre el formulario
    this.mensajeError = '';

  }
    toggleFormularioCita() {
    this.mostrarFormularioCita = !this.mostrarFormularioCita;
    this.mensajeExitoCita = ''; 
    this.mensajeErrorCita = '';
  }

    constructor(private router: Router) {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        this.userData = JSON.parse(userDataString);
        this.petData.USER_ID = this.userData.id; 
    }
     this.obtenerMascotas(); // 📌 Obtener mascotas al cargar el Dashboard
  this.obtenerEspecialistas(); // 📌 Obtener especialistas al cargar el Dashboard
}

    logout() {
      localStorage.removeItem('authToken'); //Eliminar token de sesión
      localStorage.removeItem('userData'); //Actualiza info
        this.router.navigate(['/login']); // Redirigir al login
    }

     agregarMascota() {
    if (!this.petData.NAME.trim() || !this.petData.SPECIE.trim() || !this.petData.AGE) {
      this.mensajeError = '⚠️ Requiere todos los campos.';
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      this.mensajeError = '⚠️ No hay token de autenticación.';
      return;
    }

    fetch('http://localhost:3000/api/pets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(this.petData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        this.mensajeError = `❌ ${data.error}`;
      } else {
        this.mensajeExito = '✅ Registro de mascota exitoso.';
        this.petData = { NAME: '', SPECIE: '', AGE: null, USER_ID: 1 };
      }
    })
    .catch(error => {
      console.error('❌ Error al registrar mascota:', error);
      this.mensajeError = '❌ Ocurrió un error al registrar la mascota.';
    });
  }

  agendarCita() {
    if (!this.appointmentData.DATE || !this.appointmentData.TYPE || !this.appointmentData.PET_ID || !this.appointmentData.SPECIALIST_ID) {
      this.mensajeErrorCita = '⚠️ Todos los campos son requeridos.';
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      this.mensajeErrorCita = '⚠️ No hay token de autenticación.';
      return;
    }

    fetch('http://localhost:3000/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(this.appointmentData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        this.mensajeErrorCita = `❌ ${data.error}`;
      } else {
        this.mensajeExitoCita = '✅ Cita agendada con éxito.';
        this.appointmentData = { DATE: '', TYPE: 'consulta', PET_ID: null, USER_ID: 1, SPECIALIST_ID: null };
        this.mostrarFormularioCita = false;
      }
    })
    .catch(error => {
      console.error('❌ Error al agendar cita:', error);
      this.mensajeErrorCita = '❌ Ocurrió un error al registrar la cita.';
    });
  }
  mascotas: any[] = []; // 📌 Lista para almacenar mascotas del usuario

obtenerMascotas() {
  const token = localStorage.getItem('authToken'); // 📌 Obtener el token

  if (!token) {
    console.error('⚠️ No hay usuario autenticado.');
    return;
  }

  fetch('http://localhost:3000/api/user/pets', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(data => {
    console.log('🐶 Respuesta de API:', data);
    this.mascotas = data.mascotas || [];// 📌 Guardamos las mascotas en la lista
  })
  .catch(error => console.error('❌ Error al obtener mascotas:', error));
}

especialistas: any[] = []; // 📌 Lista para almacenar especialistas

obtenerEspecialistas() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    console.error('⚠️ No hay usuario autenticado.');
    return;
  }

  fetch('http://localhost:3000/api/specialists', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(data => {
    this.especialistas = data; // 📌 Guardamos los especialistas en la lista
  })
  .catch(error => console.error('❌ Error al obtener especialistas:', error));
}
}



