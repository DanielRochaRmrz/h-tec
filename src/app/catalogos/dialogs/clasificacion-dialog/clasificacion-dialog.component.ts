import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import Swal from 'sweetalert2';
import { clasificacionesData } from '../../interfaces/tecnicos.interfaces';
import { TecnicosService } from '../../services/tecnicos.service';

@Component({
    selector: 'app-clasificacion-dialog',
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatIconModule, ReactiveFormsModule],
    templateUrl: './clasificacion-dialog.component.html',
    styleUrl: './clasificacion-dialog.component.scss'
})
export class ClasificacionDialogComponent implements OnInit {

  myForm: FormGroup;
  isEditMode?: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private _tecnicosService: TecnicosService,
    public dialogRef: MatDialogRef<ClasificacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: clasificacionesData,
  ) {

    this.isEditMode = data.editMod;

    this.myForm = this.formBuilder.group({
      nombre: [data?.item?.nombre || '', Validators.required]
    });
  }

  ngOnInit(): void { }

  async onSubmit() {
    if (this.data.item) {
      const updatedClasificacion = this.myForm.value;
      try {
        try {
          await this._tecnicosService.actualizarItem(this.data.item.id, updatedClasificacion);
          Swal.fire('Actualizado', 'El item ha sido actualizado correctamente.', 'success');
          this.dialogRef.close(updatedClasificacion);
        } catch (error) {
          Swal.fire('Error', 'Hubo un problema al actualizar el item.', 'error');
          console.error('Error al actualizar el item', error);
        }
      } catch (error) {
        console.error(error);
      }

    } else {

      try {
        // Obtén el contador actual
        const counterDoc = await this._tecnicosService.getCounter('clasificaciones');
        const counter = counterDoc.exists() ? counterDoc.data()['counter'] : 0;

        // Incrementa el contador y agrega la clasificación
        const resp = await this._tecnicosService.addClasificacion({
          ...this.myForm.value,
          counter: counter + 1
        });

        // Actualiza el contador en la base de datos
        await this._tecnicosService.updateTecnicosCounter('clasificaciones', counter + 1);

        console.info(resp);
        Swal.fire('Clasificación agregada', 'La clasificación se ha agregado correctamente', 'success');
        this.dialogRef.close();
      } catch (error) {
        console.error(error);
      }

    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
