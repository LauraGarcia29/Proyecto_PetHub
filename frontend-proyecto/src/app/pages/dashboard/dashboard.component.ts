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
     this.obtenerMisMascotas(); // 📌 Obtener mascotas al cargar el Dashboard
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


  mascotas: any[] = [];
mensajeErrorMascotas = '';

obtenerMisMascotas() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    this.mensajeErrorMascotas = '⚠️ No hay usuario autenticado.';
    return;
  }

  fetch('http://localhost:3000/api/user/pets', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(data => {
    if (data.mascotas && Array.isArray(data.mascotas)) {
      this.mascotas = data.mascotas;
      this.mensajeErrorMascotas = '';
    } else {
      this.mensajeErrorMascotas = '❌ No se encontraron mascotas registradas.';
    }
  })
  .catch(error => {
    console.error('❌ Error al obtener mascotas:', error);
    this.mensajeErrorMascotas = '❌ Ocurrió un error al obtener las mascotas.';
  });
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
    if (data.specialists && Array.isArray(data.specialists)) {
      this.especialistas = data.specialists; // 📌 Acceder correctamente al array
    } else {
      console.error('❌ Respuesta inesperada:', data);
    }
  })
  .catch(error => console.error('❌ Error al obtener especialistas:', error));
}

citas: any[] = [];
mensajeErrorCitas = '';

obtenerCitas() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    this.mensajeErrorCitas = '⚠️ No hay usuario autenticado.';
    return;
  }

  fetch('http://localhost:3000/api/appointments', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(data => {
    if (data.citas && Array.isArray(data.citas)) {
      this.citas = data.citas;
      this.mensajeErrorCitas = '';
    } else {
      this.mensajeErrorCitas = '❌ No se encontraron citas registradas.';
    }
  })
  .catch(error => {
    console.error('❌ Error al obtener citas:', error);
    this.mensajeErrorCitas = '❌ Ocurrió un error al obtener las citas.';
  });
}

todasMascotas: any[] = [];
mensajeErrorTodasMascotas = '';

obtenerTodasMascotas() {
  fetch('http://localhost:3000/api/pets', {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    if (data.mascotas && Array.isArray(data.mascotas)) {
      this.todasMascotas = data.mascotas;
      this.mensajeErrorTodasMascotas = '';
    } else {
      this.mensajeErrorTodasMascotas = '❌ No se encontraron mascotas registradas.';
    }
  })
  .catch(error => {
    console.error('❌ Error al obtener mascotas:', error);
    this.mensajeErrorTodasMascotas = '❌ Ocurrió un error al obtener las mascotas.';
  });
}

misCitas: any[] = [];
mensajeErrorMisCitas = '';

obtenerMisCitas() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    this.mensajeErrorMisCitas = '⚠️ No hay usuario autenticado.';
    return;
  }

  fetch('http://localhost:3000/api/user/appointments', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(data => {
    if (data.citas && Array.isArray(data.citas)) {
      this.misCitas = data.citas;
      this.mensajeErrorMisCitas = '';
    } else {
      this.mensajeErrorMisCitas = '❌ No se encontraron citas registradas.';
    }
  })
  .catch(error => {
    console.error('❌ Error al obtener citas:', error);
    this.mensajeErrorMisCitas = '❌ Ocurrió un error al obtener las citas.';
  });
  }

citasEspecialista: any[] = [];
mensajeErrorCitasEspecialista = '';

obtenerCitasPorEspecialista() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    this.mensajeErrorCitasEspecialista = '⚠️ No hay usuario autenticado.';
    return;
  }

  fetch('http://localhost:3000/api/appointments/specialist', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(data => {
    if (data.citas && Array.isArray(data.citas)) {
      this.citasEspecialista = data.citas;
      this.mensajeErrorCitasEspecialista = '';
    } else {
      this.mensajeErrorCitasEspecialista = '❌ No se encontraron citas.';
    }
  })
  .catch(error => {
    console.error('❌ Error al obtener citas por especialista:', error);
    this.mensajeErrorCitasEspecialista = '❌ Ocurrió un error al obtener las citas.';
  });
}

usuarios: any[] = [];
mensajeErrorUsuarios = '';

obtenerUsuarios() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    this.mensajeErrorUsuarios = '⚠️ No hay usuario autenticado.';
    return;
  }

  fetch('http://localhost:3000/api/admin/users', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(data => {
    if (data.usuarios && Array.isArray(data.usuarios)) {
      this.usuarios = data.usuarios;
      this.mensajeErrorUsuarios = '';
    } else {
      this.mensajeErrorUsuarios = '❌ No se encontraron usuarios registrados.';
    }
  })
  .catch(error => {
    console.error('❌ Error al obtener usuarios:', error);
    this.mensajeErrorUsuarios = '❌ Ocurrió un error al obtener los usuarios.';
  });
}

actualizarMascota() {
  const token = localStorage.getItem('authToken');
  const petId = prompt("📌 Ingresa el ID de la mascota a actualizar:");
  const updatedData = { NAME: "NuevoNombre", TYPE: "NuevoTipo" }; // Puedes personalizarlo
  
  fetch(`http://localhost:3000/api/pets/${petId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  })
  .then(response => response.json())
  .then(data => console.log("✅ Mascota actualizada:", data))
  .catch(error => console.error("❌ Error al actualizar mascota:", error));
}

actualizarCita() {
  const token = localStorage.getItem('authToken');
  const appointmentId = prompt("📌 Ingresa el ID de la cita a actualizar:");
  const updatedData = { DATE: "2025-05-15 10:30:00", TYPE: "baño" };
  
  fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  })
  .then(response => response.json())
  .then(data => console.log("✅ Cita actualizada:", data))
  .catch(error => console.error("❌ Error al actualizar cita:", error));
}

eliminarMascota() {
  const token = localStorage.getItem('authToken');
  const petId = prompt("📌 Ingresa el ID de la mascota a eliminar:");
  
  fetch(`http://localhost:3000/api/pets/${petId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(data => console.log("✅ Mascota eliminada:", data))
  .catch(error => console.error("❌ Error al eliminar mascota:", error));
}

eliminarCita() {
  const token = localStorage.getItem('authToken');
  const appointmentId = prompt("📌 Ingresa el ID de la cita a eliminar:");
  
  fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(data => console.log("✅ Cita eliminada:", data))
  .catch(error => console.error("❌ Error al eliminar cita:", error));
}

consultarPerfilSesion() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    console.error('⚠️ No hay usuario autenticado.');
    return;
  }

  fetch('http://localhost:3000/api/profile/session', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(data => console.log("✅ Perfil en sesión:", data))
  .catch(error => console.error("❌ Error al consultar perfil:", error));
}

rolUsuario: string = '';

obtenerPerfilSesion() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    console.error('⚠️ No hay usuario autenticado.');
    return;
  }

  fetch('http://localhost:3000/api/profile/session', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(data => {
    if (data.ROL) {
      this.rolUsuario = data.ROL;
      console.log('✅ Rol del usuario:', this.rolUsuario);
    } else {
      console.error('❌ Error al obtener el rol del usuario.');
    }
  })
  .catch(error => console.error('❌ Error al obtener perfil en sesión:', error));
}

}


