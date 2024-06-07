import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { ClienteData } from '../interfaces/clientes.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private firestore: Firestore = inject(Firestore);
  private clientesCollection = collection(this.firestore, 'clientes');

  addCliente(cliente: any) {
    return addDoc(this.clientesCollection, cliente);
  }

  getClientes() {
    return new Promise((resolve, reject) => {
      const clientesData = collectionData(this.clientesCollection, { idField: 'id' }) as Observable<ClienteData[]>;
      clientesData.subscribe({
        next: data => resolve(data),
        error: error => reject(error)
      });
    });
  }
}
