import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { clasificacionesData, TecnicosData } from '../../interfaces/tecnicos.interfaces';
import { TecnicosService } from '../../services/tecnicos.service';
import { NgFor, NgIf } from '@angular/common';
import { ClasificacionDialogComponent } from '../clasificacion-dialog/clasificacion-dialog.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-tecnicos-dialog',
    imports: [ReactiveFormsModule, MatCheckboxModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, NgFor, NgIf],
    templateUrl: './tecnicos-dialog.component.html',
    styleUrl: './tecnicos-dialog.component.scss'
})
export class TecnicosDialogComponent implements OnInit {
  myForm: FormGroup;
  isEditMode: boolean;
  isSaveDisabled: boolean = false;
  type?: string;

  public selectedNumbers: any[] = [];
  public clasificaciones: any[] = [];
  clasificacion?: any[];

  constructor(
    private formBuilder: FormBuilder,
    private _tecnicosService: TecnicosService,
    public dialogRef: MatDialogRef<TecnicosDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TecnicosData,
  ) {

    this.isSaveDisabled = data.isSaveDisabled || false;
    this.type = data.type || '';
    this.isEditMode = !!data;
    this.myForm = this.formBuilder.group({
      nombre: [data?.nombre || '', Validators.required],
      direccion: [data?.direccion || '', Validators.required],
      whatsApp: [data?.whatsApp || '', Validators.required],
      correo: [data?.correo || '', [Validators.required, Validators.email]],
      password: [data?.password || '', [Validators.required, Validators.minLength(6)]],
      clave: [data?.clave || '', Validators.required],
      clasificacion: [data?.clasificacion || '']
    });
  }

  ngOnInit() {
    this.getDataClasificaciones();
  }

  openDialogClasificacion(): void {
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
      this.clasificaciones.sort((a, b) =>  a.counter - b.counter);
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
    this.myForm.get('clasificacion')?.setValue(this.selectedNumbers.map(c => c.counter).join(''));
  }

  onSave(): void {
    if (this.myForm.valid) {
      console.log('Formulario válido:', this.myForm.value);
      this.dialogRef.close(this.myForm.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editClasificacion(item: any) {

    var editMod: boolean = true;
    const dialogRef = this.dialog.open(ClasificacionDialogComponent, {
      data: { item, editMod },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Encuentra el índice del elemento editado
        const index = this.clasificaciones.findIndex(c => c.id === item.id);
        if (index !== -1) {
          // Actualiza el elemento en la lista
          this.clasificaciones[index] = { ...this.clasificaciones[index], ...result };
        }
      }
    });
  }

  deleteClasificacion(item: clasificacionesData) {
    Swal.fire({
      title: '¿Estás seguro de eliminar el item?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then(async ( result ) => {
      if (result.isConfirmed) {
        try {
          await this._tecnicosService.eliminarItem(item.id);
          this.clasificaciones = this.clasificaciones.filter(c => c.id !== item.id);
          this.clasificaciones.sort((a, b) => a.counter - b.counter);
          for (const cfs of this.clasificaciones) {
            if (item.counter < cfs.counter) {
              await this._tecnicosService.actualizarItem(cfs.id, { counter: cfs.counter - 1 });
            }
          }
          const documentosTc = await this._tecnicosService.contarDocumentosTc();
          await this._tecnicosService.updateTecnicosCounter('clasificaciones', documentosTc);
          this.getDataClasificaciones();
          Swal.fire('Eliminado', 'El item ha sido eliminado.', 'success');
        } catch (error) {
          Swal.fire('Error', 'Hubo un problema al eliminar el producto.', 'error');
          console.error('Error al eliminar el producto', error);
        }
      }
    });
  }

  isChecked(counter: number): boolean {

    if (this.type != "agregar") {
      return this.data?.clasificacion.includes(counter);
    } else {

      return false;
    }
  }


}
