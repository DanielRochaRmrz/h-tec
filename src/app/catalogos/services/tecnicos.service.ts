import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, getDoc, setDoc, deleteDoc, updateDoc, query, getCountFromServer } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { TecnicosData, clasificacionesData } from '../interfaces/tecnicos.interfaces';
import { AuthService } from '../../auth/services/auth.service';
import { error } from 'console';
import { get } from 'http';

@Injectable({
  providedIn: 'root'
})
export class TecnicosService {

  private firestore: Firestore = inject(Firestore);
  private tecnicosCollection = collection(this.firestore, 'tecnicos');
  private clasificacionesnCollection = collection(this.firestore, 'tecnicosClasificaciones');
  private auth: AuthService = inject(AuthService);

  addTecnico(tecnico: any) {
    return this.auth.createUser(tecnico.correo, tecnico.password).then(() => {
      return addDoc(this.tecnicosCollection, tecnico);
    }).catch((error) => {
      console.error('Error al crear el usuario:', error);
      throw error;
    });
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

  updateTecnicosCounter(documento: string, counter: number) {
    return setDoc(doc(this.firestore, 'tecnicosCounters', documento), { counter });
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

  eliminarTecnico(id: string) {
    const tecnicoDoc = doc(this.firestore, `tecnicos/${id}`);
    return deleteDoc(tecnicoDoc);
  }

  actualizarTecnico(id: string, tecnico: any) {
    const tecnicoDoc = doc(this.firestore, `tecnicos/${id}`);
    return updateDoc(tecnicoDoc, tecnico);
  }

  eliminarItem(id: string) {

    const itemDoc = doc(this.firestore, `tecnicosClasificaciones/${id}`);
    return deleteDoc(itemDoc);

  }

  actualizarItem(id: string, clasificacion: any) {
    const itemDoc = doc(this.firestore, `tecnicosClasificaciones/${id}`);
    try {
      return updateDoc(itemDoc, clasificacion);
    } catch (error) {
      console.error("Error updating document: ", error);
      throw error;
    }
  }

  async contarDocumentosTc() {
    const coleccionRef = this.clasificacionesnCollection;
    const q = query(coleccionRef);
    try {
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count; // El conteo de documentos
    } catch (error) {
      console.error("Error getting document count: ", error);
      throw error;
    }
  }
}


