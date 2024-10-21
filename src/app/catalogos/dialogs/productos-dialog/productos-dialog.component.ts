import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators  } from '@angular/forms';

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
export class ProductosDialogComponent implements OnInit {
  myForm: FormGroup;
  isEditMode: boolean;
  isSaveDisabled: boolean = false;
  type?: string;  

  constructor(
    private formBuilder: FormBuilder,
    private _productosService: ProductosService,
    public dialogRef: MatDialogRef<ProductosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductoData,
  ) { 

    this.isSaveDisabled = data.isSaveDisabled || false;
    this.type = data.type || '';
    this.isEditMode = !!data; // Si hay datos, estamos en modo edición
    this.myForm = this.formBuilder.group({
      clave: [data?.clave || '', Validators.required],
      descripcion: [data?.descripcion || '', Validators.required],
      observacion: [data?.observacion || '', Validators.required],
      precio: [data?.precio || '', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSave(): void {
    if (this.myForm.valid) {
      this.dialogRef.close(this.myForm.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
