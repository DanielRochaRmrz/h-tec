import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
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
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatIconModule, ReactiveFormsModule],
  templateUrl: './clasificacion-dialog.component.html',
  styleUrl: './clasificacion-dialog.component.scss'
})
export class ClasificacionDialogComponent {
  myForm = this.formBuilder.group({
    nombre: [],
  });

  constructor(
    private formBuilder: FormBuilder,
    private _tecnicosService: TecnicosService,
    public dialogRef: MatDialogRef<ClasificacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: clasificacionesData,
  ) { }

  async onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.myForm.value);

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
    await this._tecnicosService.updateCounter('clasificaciones', counter + 1);

      console.info(resp);
      Swal.fire('Clasificación agregada', 'La clasificación se ha agregado correctamente', 'success');
      this.dialogRef.close();
    } catch (error) {
      console.error(error);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
