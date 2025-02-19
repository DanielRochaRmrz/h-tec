import { Injectable, inject, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog = inject(MatDialog);

  abrirDialogo<T>(component: Type<T>, data?: any): MatDialogRef<T> {
    const isMobile = window.innerWidth < 768;

    const config: MatDialogConfig = {
      width: isMobile ? '100vw' : window.innerWidth < 1200 ? '80vw' : '60vw',
      height: isMobile ? '100vh' : 'auto',
      maxWidth: '90vw',
      panelClass: isMobile ? 'full-screen-dialog' : 'large-dialog',
      data
    };

    return this.dialog.open(component, config);
  }
}
