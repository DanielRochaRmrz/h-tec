import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CodigoPostal } from '../interfaces/codigo-postal';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  private apiKey = environment.API_KEY_DOPIMEX;

  constructor(private http: HttpClient) { }

  getColoniasByCP(cp: string): Observable<CodigoPostal> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.apiKey}`);
    return this.http.get<CodigoPostal>(environment.API_DOPIMEX+`codigo_postal?cp=${cp}`, { headers });
  }
}
