import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AddPetComponent } from './pages/add-pet/add-pet.component';


export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }, // 📌 Ruta para el Dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'add-pet', component: AddPetComponent }, 
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }

];