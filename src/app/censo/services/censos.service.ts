import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, updateDoc, deleteDoc, getDoc, where, query } from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject } from "@angular/fire/storage";
import { Observable } from 'rxjs';
import { DateTime } from "luxon";

@Injectable({
  providedIn: 'root'
})
export class CensosService {

  private firestore: Firestore = inject(Firestore);
  private censosCollection = collection(this.firestore, 'censos');
  private dispositivosCollection = collection(this.firestore, 'dispositivos');
  private readonly storage: Storage = inject(Storage);

  constructor() { }

  addCenso(censo: any) {
    return addDoc(this.censosCollection, censo);
  }

  updateCenso(id: string, imagenes: any) {
    const censoRef = doc(this.firestore, 'censos', id);
    return updateDoc(censoRef, imagenes);
  }

  updateCensoData(id: string, censo: any) {
    const censoRef = doc(this.firestore, 'censos', id);
    return updateDoc(censoRef, censo);
  }

  getCensoById(id: string) {
    const censoRef = doc(this.firestore, 'censos', id);
    return getDoc(censoRef).then(doc => doc.exists() ? doc.data() : undefined);
  }

  async deleteImg(imgUrl: string, censoId: string): Promise<void> {

    // Elimina del almacenamiento
    const storage = getStorage();
    const imgRef = ref(storage, imgUrl);
    await deleteObject(imgRef);

    const censoRef = doc(this.firestore, 'censos', censoId);
    const censoDoc = await getDoc(censoRef);
    if (censoDoc.exists()) {
      const censoData = censoDoc.data();
      const updatedImages = (censoData['imagenes'] || []).filter((url: string) => url !== imgUrl);
      await updateDoc(censoRef, { imagenes: updatedImages });
    }

  }

  getCensos() {
    return new Promise((resolve, reject) => {
      const censosData = collectionData(this.censosCollection, { idField: 'id' }) as Observable<any[]>;
      censosData.subscribe({
        next: data => resolve(data),
        error: error => reject(error)
      });
    });
  }

  uploadImg(img: File, i: string): Promise<string> {
    const originalFileName = img.name;
    const timestamp = DateTime.now().toMillis();
    const fileExtension = originalFileName.split('.').pop();
    const newFileName = `${i}-${timestamp}.${fileExtension}`;
    const storageRef = ref(this.storage, 'imagenesCenso/' + newFileName);

    const uploadTask = uploadBytesResumable(storageRef, img);

    return new Promise<string>((resolve, reject) => {
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              // console.log('Upload is paused');
              break;
            case 'running':
              // console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log('File available at', downloadURL);
            resolve(downloadURL);
          }).catch((error) => {
            reject(error);
          });
        }
      );
    });
  }

  eliminarCenso(id: string) {
    const censoDoc = doc(this.firestore, `censos/${id}`);
    return deleteDoc(censoDoc);

  }

  convertTimestampToDate(timestamp: { seconds: number, nanoseconds: number }): string {
    const date = new Date(timestamp.seconds * 1000);
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  getItemsDispositivos(tipo: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const q = query(this.dispositivosCollection, where('tipo', 'in', [tipo]));
      const dispositivoData = collectionData(q, { idField: 'id' }) as Observable<any[]>;
      dispositivoData.subscribe({
        next: data => resolve(data),
        error: error => reject(error)
      });
    });
  }
}

