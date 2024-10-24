import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CodigoPostal, ColoniasResponse, Estados, MunicipiosResponse } from '../interfaces/catalogos.interface';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  private apiKey = environment.API_KEY_DOPIMEX;

  constructor(private http: HttpClient) { }

  getColoniasByCP(cp: string): Observable<CodigoPostal> {
    const headers = new HttpHeaders({ 'APIKEY': this.apiKey });
    return this.http.get<CodigoPostal>(`${environment.API_DOPIMEX}/codigo_postal?cp=${cp}`, { headers });
  }

  getEstados(): Observable<Estados>{
    const headers = new HttpHeaders({ 'APIKEY': this.apiKey });
    return this.http.get<Estados>(`${environment.API_DOPIMEX}/estados`, { headers });
  }

  getMunicipiosByEstado(id_estado: string): Observable<MunicipiosResponse> {
    const headers = new HttpHeaders({ 'APIKEY': this.apiKey });
    return this.http.get<MunicipiosResponse>(`${environment.API_DOPIMEX}/municipios?id_estado=${id_estado}`, { headers });
  }
}
