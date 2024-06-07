import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, getDoc, setDoc } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { TecnicosData, clasificacionesData } from '../interfaces/tecnicos.interfaces';

@Injectable({
  providedIn: 'root'
})
export class TecnicosService {

  private firestore: Firestore = inject(Firestore);
  private tecnicosCollection = collection(this.firestore, 'tecnicos');
  private clasificacionesnCollection = collection(this.firestore, 'tecnicosClasificaciones');

  addTecnico(tecnico: any) {
    return addDoc(this.tecnicosCollection, tecnico);
  }

  getTecnicos() {
    return new Promise((resolve, reject) => {
      const tecnicosData = collectionData(this.tecnicosCollection, { idField: 'id' }) as Observable<TecnicosData[]>;
      tecnicosData.subscribe({
        next: data => resolve(data),
        error: error => reject(error)
      });
    });
  }

  getCounter(collection: string) {
    return getDoc(doc(this.firestore, 'tecnicosCounters', collection));
  }

  updateCounter(collection: string, counter: number) {
    return setDoc(doc(this.firestore, 'tecnicosCounters', collection), { counter });
  }

  addClasificacion(clasificacion: any) {
    return addDoc(this.clasificacionesnCollection, clasificacion);
  }

  getClasificaciones() {
    return new Promise((resolve, reject) => {
      const clasificacionesData = collectionData(this.clasificacionesnCollection, { idField: 'id' }) as Observable<clasificacionesData[]>;
      clasificacionesData.subscribe({
        next: data => resolve(data),
        error: error => reject(error)
      });
    });
  }

}
