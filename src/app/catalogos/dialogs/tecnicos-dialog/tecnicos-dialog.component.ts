import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialog,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import Swal from 'sweetalert2';

import { TecnicosData } from '../../interfaces/tecnicos.interfaces';
import { TecnicosService } from '../../services/tecnicos.service';
import { NgFor, NgIf } from '@angular/common';
import { ClasificacionDialogComponent } from '../clasificacion-dialog/clasificacion-dialog.component';

@Component({
  selector: 'app-tecnicos-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, NgFor, NgIf],
  templateUrl: './tecnicos-dialog.component.html',
  styleUrl: './tecnicos-dialog.component.scss'
})
export class TecnicosDialogComponent {
  myForm = this.formBuilder.group({
    nombre: [],
    direccion: [],
    whatsApp: [],
    correo: [],
    clave: [],
    clasificacion: [],
  });

  public selectedNumbers: any[] = [];
  public clasificaciones: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private _tecnicosService: TecnicosService,
    public dialogRef: MatDialogRef<TecnicosDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TecnicosData,
  ) { }

  ngAfterViewInit() {
    this.getDataClasificaciones();
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(ClasificacionDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      this.getDataClasificaciones();
    });
  }

  async getDataClasificaciones() {
    try {
      this.clasificaciones = await this._tecnicosService.getClasificaciones() as any[];
      console.log('Clasificaciones:', this.clasificaciones);
    } catch (error) {
      console.error('Error al obtener los clasificaciones:', error);
    }
  }

  onCheckboxChange(e: any, clasificacion: any) {
    if (e.checked) {
      this.selectedNumbers.push(clasificacion);
    } else {
      const index = this.selectedNumbers.findIndex(c => c.id === clasificacion.id);
      if (index !== -1) {
        this.selectedNumbers.splice(index, 1);
      }
    }
    // Actualiza el valor del campo 'clasificacion' en el formulario
    this.myForm.get('clasificacion')?.setValue(this.selectedNumbers.map(c => c.counter) as unknown as null);
  }

  async onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.myForm.value);

    try {
      const resp = await this._tecnicosService.addTecnico(this.myForm.value);
      console.info(resp);
      Swal.fire('Técnico agregado', 'El técnico se ha agregado correctamente', 'success');
      this.dialogRef.close();
    } catch (error) {
      console.error(error);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
