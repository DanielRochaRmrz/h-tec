import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { ProductoData } from '../interfaces/productos.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private firestore: Firestore = inject(Firestore);
  private productosCollection = collection(this.firestore, 'productos');

  addProducto(producto: any) {
    return addDoc(this.productosCollection, producto);
  }

  getProductos() {
    return new Promise((resolve, reject) => {
      const prodctosData = collectionData(this.productosCollection, { idField: 'id' }) as Observable<ProductoData[]>;
      prodctosData.subscribe({
        next: data => resolve(data),
        error: error => reject(error)
      });
    });
  }
}
