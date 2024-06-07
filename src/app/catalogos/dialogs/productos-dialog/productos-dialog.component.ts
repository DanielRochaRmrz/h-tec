import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import Swal from 'sweetalert2';

import { ProductoData } from '../../interfaces/productos.interface';

import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productos-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './productos-dialog.component.html',
  styleUrl: './productos-dialog.component.scss'
})
export class ProductosDialogComponent {
  myForm = this.formBuilder.group({
    clave: [],
    descripcion: [],
    observación: [],
    precio: [],
  });

  constructor(
    private formBuilder: FormBuilder,
    private _productosService: ProductosService,
    public dialogRef: MatDialogRef<ProductosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductoData,
  ) { }


  async onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.myForm.value);

    try {
      const resp = await this._productosService.addProducto(this.myForm.value);
      console.info(resp);
      Swal.fire('Producto agregado', 'El producto se ha agregado correctamente', 'success');
      this.dialogRef.close();
    } catch (error) {
      console.error(error);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
