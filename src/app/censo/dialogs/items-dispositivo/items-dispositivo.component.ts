import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CensosService } from '../../services/censos.service';
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

@Component({
    selector: 'app-items-dispositivo',
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatIconModule, ReactiveFormsModule],
    templateUrl: './items-dispositivo.component.html',
    styleUrl: './items-dispositivo.component.scss'
})
export class ItemsDispositivoComponent {

  myForm: FormGroup;
  isEditMode?: boolean;
  tipo?: string;

  constructor(
    private formBuilder: FormBuilder,
    private _censoService: CensosService,
    public dialogRef: MatDialogRef<ItemsDispositivoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {    

    this.isEditMode = data.editMod;
    this.tipo = data.tipo;
    
    this.myForm = this.formBuilder.group({
      nombre: [data?.item?.nombre || '', Validators.required]
    });
  }

  
  ngOnInit(): void { }

  async onSubmit() {
    if (this.data.item) {
      const updateDispositivo = this.myForm.value;
      try {
        try {
          await this._censoService.actualizarItemDispositivo(this.data.item.id, updateDispositivo);
          Swal.fire('Actualizado', 'El item ha sido actualizado correctamente.', 'success');
          this.dialogRef.close(updateDispositivo);
        } catch (error) {
          Swal.fire('Error', 'Hubo un problema al actualizar el item.', 'error');
          console.error('Error al actualizar el item', error);
        }
      } catch (error) {
        console.error(error);
      }

    } else {

      try {

        const newItem = {
          ...this.myForm.value,
          tipo: this.tipo
        };

        const resp = await this._censoService.addItemDispositivo(newItem);
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
