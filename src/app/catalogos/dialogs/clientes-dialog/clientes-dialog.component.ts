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

  myForm = this.formBuilder.group({
    cliente: [],
    rfc: [],
    claveASPEL: [],
    calleNumero: [],
    cp: [],
    colonia: [],
    ciudad: [],
    estado: [],
    whatsApp: [],
    telefono: [],
    correo: [],
  });

  constructor(
    private formBuilder: FormBuilder,
    private _clientesService: ClientesService,
    public dialogRef: MatDialogRef<ClientesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClienteData,
    private _catalogosService: CatalogosService
  ) {

    this.getColonias();

   }


  async onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.myForm.value);

    try {
      const resp = await this._clientesService.addCliente(this.myForm.value);
      console.info(resp);
      Swal.fire('Cliente agregado', 'El cliente se ha agregado correctamente', 'success');
      this.dialogRef.close();
    } catch (error) {
      console.error(error);
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
