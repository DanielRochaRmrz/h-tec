import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ClientesService } from '../../services/clientes.service';
import { ClienteData } from '../../interfaces/clientes.interface';
import { CatalogosService } from '../../services/catalogos.service';
import { HttpClientModule } from '@angular/common/http';
import { CodigoPostal, Estado, Estados, Municipio, MunicipiosResponse } from '../../interfaces/catalogos.interface';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-clientes-dialog',
    imports: [ReactiveFormsModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, HttpClientModule, MatSelectModule, MatOptionModule, CommonModule],
    templateUrl: './clientes-dialog.component.html',
    styleUrl: './clientes-dialog.component.scss'
})
export class ClientesDialogComponent implements OnInit {
  myForm: FormGroup;
  isEditMode?: boolean;
  isSaveDisabled: boolean = false;
  type?: string;
  colonias: string[] = [];
  estados: Estado[] = [];
  municipios: Municipio[] = [];

  constructor(
    private formBuilder: FormBuilder,
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
      cp: [data?.cp || '', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      colonia: [data?.colonia || '', Validators.required],
      municipio: [data?.municipio || '', Validators.required],
      urlMaps: [data?.urlMaps || '', Validators.required],
      estado: [data?.estado || '', Validators.required],
      whatsApp: [data?.whatsApp || '', Validators.required],
      telefono: [data?.telefono || '', Validators.required],
      correo: [data?.correo || '', Validators.required],
    });

  }

  ngOnInit(): void {

    if (this.isEditMode) {
      this.loadInitialData();
    }

    this.myForm.get('cp')?.valueChanges.subscribe(cp => {
      const cpString = cp.toString();

      if (cpString.length === 5) {
        this.getColonias(cp);
      }

    })

    this.getEstados();

    this.myForm.get("estado")?.valueChanges.subscribe((estado: Estado) => {
      this.getMunicipios(estado.ESTADO_ID);
    })
  }


  onSave(): void {
    if (this.myForm.valid) {
      const formValue = this.myForm.value;
      formValue.estado = formValue.estado.ESTADO;
      this.dialogRef.close(formValue);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getColonias(cp: string): void {
    this._catalogosService.getColoniasByCP(cp).subscribe((data: CodigoPostal) => {
      this.colonias = data.codigo_postal.colonias;
    })
  }

  getEstados(): void {
    this._catalogosService.getEstados().subscribe((data: Estados) => {
      this.estados = data.estados;
      if (this.isEditMode) {
        this.loadInitialData();
      }
    })
  }

  getMunicipios(id_estado: string): void {
    this._catalogosService.getMunicipiosByEstado(id_estado).subscribe((data: MunicipiosResponse) => {
      this.municipios = data.municipios;
    })

  }

  loadInitialData(): void {
    // INICIALIZAMOS COLONIAS
    const cp = this.myForm.get('cp')?.value;
    if (cp) {
      this.getColonias(cp);
    }

    // INCIALIZAMOS ESTADO
    const estadoNombre = this.myForm.get('estado')?.value;
    if (estadoNombre) {
      const estado = this.estados.find(e => e.ESTADO === estadoNombre);
      if (estado) {
        this.myForm.get('estado')?.setValue(estado);
        this.getMunicipios(estado.ESTADO_ID);
      }
    }

  }

}
