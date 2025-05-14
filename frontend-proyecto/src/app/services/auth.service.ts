import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiLoginUrl = 'http://localhost:3000/api/login'; // 📌 URL de login
  private apiRegisterUrl = 'http://localhost:3000/api/register'; // 📌 URL de registro

  constructor(private http: HttpClient) {}

  // Método para hacer login
  login(email: string, password: string): Observable<any> {
    console.log('Enviando:', { email, password }); 

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { EMAIL: email, PASSWORD: password };

    return this.http.post<any>(this.apiLoginUrl, body, { headers, withCredentials: true }).pipe(
      tap((response) => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token); // 📌 Guardar token
        }
      }),
      catchError((err) => {
        console.error('Error en login:', err);
        throw err;
      })
    );
  }

  // Método para registrar usuarios
  register(name: string, email: string, password: string): Observable<any> {
    console.log('Enviando al backend:', { NAME: name, EMAIL: email, PASSWORD: password });

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { NAME: name, EMAIL: email, PASSWORD: password }; // 📌 Usar nombres correctos

    return this.http.post<any>(this.apiRegisterUrl, body, { headers }).pipe(
      tap((response) => {
        console.log('Usuario registrado:', response);
      }),
      catchError((err) => {
        console.error('Error en registro:', err);
        throw err;
      })
    );
  }
}