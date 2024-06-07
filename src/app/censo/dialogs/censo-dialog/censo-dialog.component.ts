import { Component, Inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';

import { DateTime } from 'luxon';
import Swal from 'sweetalert2';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryModule, NgxGalleryOptions } from '@kolkov/ngx-gallery';

import { CensosService } from '../../services/censos.service';

import { ClienteData } from './../../../catalogos/interfaces/clientes.interface';

import { ClientesDialogComponent } from '../clientes-dialog/clientes-dialog.component';

@Component({
  selector: 'app-censo-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, NgFor, MatCardModule, MatDatepickerModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatRadioModule, MatStepperModule, MatExpansionModule, NgxGalleryModule],
  templateUrl: './censo-dialog.component.html',
  styleUrl: './censo-dialog.component.scss'
})
export class CensoDialogComponent {  currentDate = DateTime.local().toISODate();

  clientForm = this.formBuilder.group({
    cliente: ['', Validators.required],
    claveASPEL: ['', Validators.required],
    whatsApp: ['', Validators.required],
    telefono: ['', Validators.required],
    correo: ['', Validators.required],
    fechaRegistro: [this.currentDate, Validators.required],
  });

  equipoForm = this.formBuilder.group({
    modelo: [],
    marca: [],
    numeroSerie: [],
    sistemOperativoV: [],
    officeV: [],
    antivirus: [],
    fechaCaducidadAnti: [],
    qr: [],
    areaDepartamento: [],
    reponsableEquipo: [],
    responsableCorreo: [],
    tipo: [],
  });

  impresoraForm = this.formBuilder.group({
    modelo: [],
    marca: [],
    numeroSerie: [],
    sistemOperativoV: [],
    officeV: [],
    antivirus: [],
    fechaCaducidadAnti: [],
    qr: [],
    areaDepartamento: [],
    tipo: [],
  });

  isLinear = true;

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  galleryOptions: NgxGalleryOptions[] = [
    {
      width: '280px',
      height: '280px',
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      lazyLoading: true,
      previewCloseOnClick: true,
      closeIcon: 'fa fa-times-circle',
      spinnerIcon: 'fa fa-spinner fa-pulse fa-3x fa-fw',
    },
    // max-width 800
    {
      breakpoint: 800,
      width: '100%',
      height: '600px',
      imagePercent: 80,
      thumbnailsPercent: 20,
      thumbnailsMargin: 20,
      thumbnailMargin: 20
    },
    // max-width 400
    {
      breakpoint: 400,
      preview: false
    }
  ];

  galleryImages: NgxGalleryImage[] = [
    {
      small: './../../../assets/imgs/camera.png',
      medium: './../../../assets/imgs/camera.png',
      big: './../../../assets/imgs/camera.png'
    },
  ];

  files!: FileList;
  filesUpladed: any[] = [];
  previewUrls: (string | ArrayBuffer)[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private _censosSevice: CensosService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CensoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClienteData,
  ) { }

  onFileSelected(event: any) {
    this.files = event.target.files;
    Array.from(this.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.previewUrls.push(reader.result);
          this.loadGalleryImages();
        }
      };
      reader.readAsDataURL(file);
      this.filesUpladed.push(file);
    });
  }

  loadGalleryImages() {
    this.galleryImages = this.previewUrls.map((url: string | ArrayBuffer) => {
      return {
        small: url as string,
        medium: url as string,
        big: url as string
      };
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ClientesDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.clientForm.patchValue({
        cliente: result.cliente,
        claveASPEL: result.claveASPEL,
        whatsApp: result.whatsApp,
        telefono: result.telefono,
        correo: result.correo,
      });
    });
  }

  async onSubmit() {
    try {
      const formValues = this.equipoForm.value;
      const isEmpty = Object.values(formValues).every(x => (x === null || x === ''));

      let censo: any;

      if (isEmpty) {
        censo = {
          cliente: this.clientForm.value,
          impresora: this.impresoraForm.value,
        }
      } else {
        censo = {
          cliente: this.clientForm.value,
          equipo: this.equipoForm.value,
        }
      }

      const respCenso = await this._censosSevice.addCenso(censo);

      const uploadPromises = Array.from(this.filesUpladed).map(async (file: File) => {
        const resp = await this._censosSevice.uploadImg(file, respCenso.id);
        return resp;
      });

      const updateCenso = this._censosSevice.updateCenso(respCenso.id, { imagenes: await Promise.all(uploadPromises) });

      Promise.all([respCenso, uploadPromises, updateCenso]).then(() => {
        Swal.fire('Censo agregado', 'El censo se ha agregado con éxito', 'success');
      });

      this.dialogRef.close();
    } catch (error) {
      console.error(error);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
