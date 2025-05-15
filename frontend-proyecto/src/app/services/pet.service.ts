import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  constructor(private http: HttpClient) {}

  addPet(petData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>('http://localhost:3000/api/pets', petData, { headers });
  }
}