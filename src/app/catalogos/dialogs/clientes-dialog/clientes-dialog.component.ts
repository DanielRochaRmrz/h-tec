import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
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
import { ClientesService } from '../../services/clientes.service';
import { ClienteData } from '../../interfaces/clientes.interface';
import { CatalogosService } from '../../services/catalogos.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-clientes-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, HttpClientModule],
  templateUrl: './clientes-dialog.component.html',
  styleUrl: './clientes-dialog.component.scss'
})
export class ClientesDialogComponent {
  myForm: FormGroup;
  isEditMode?: boolean;
  isSaveDisabled: boolean = false;
  type?: string; 


  constructor(
    private formBuilder: FormBuilder,
    private _clientesService: ClientesService,
    public dialogRef: MatDialogRef<ClientesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClienteData,
    private _catalogosService: CatalogosService
  ) {

    this.isSaveDisabled = data.isSaveDisabled || false;
    this.type = data.type || '';
    this.isEditMode = !!data; // Si hay datos, estamos en modo edición
    this.myForm = this.formBuilder.group({
      cliente: [data?.cliente || '', Validators.required],
      rfc: [data?.rfc || '', Validators.required],
      claveASPEL: [data?.claveASPEL || '', Validators.required],
      calleNumero: [data?.calleNumero || '', Validators.required],
      cp: [data?.cp || '', Validators.required],
      colonia: [data?.colonia || '', Validators.required],
      ciudad: [data?.ciudad || '', Validators.required],
      estado: [data?.estado || '', Validators.required],
      whatsApp: [data?.whatsApp || '', Validators.required],
      telefono: [data?.telefono || '', Validators.required],
      correo: [data?.correo || '', Validators.required],
    });

   }


  onSave():void{
    if (this.myForm.valid) {
      this.dialogRef.close(this.myForm.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getColonias() {
    this._catalogosService.getColoniasByCP("37408").subscribe(data => {
      console.log("Colonias", data);
    })
  }
}
