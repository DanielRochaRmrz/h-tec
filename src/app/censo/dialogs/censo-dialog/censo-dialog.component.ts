import { Component, Inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ClienteRegistradoData } from './../../../catalogos/interfaces/censo.interface';
import { ClientesDialogComponent } from '../clientes-dialog/clientes-dialog.component';
import { url } from 'inspector';


@Component({
  selector: 'app-censo-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, NgFor, MatCardModule, MatDatepickerModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatRadioModule, MatStepperModule, MatExpansionModule, NgxGalleryModule],
  templateUrl: './censo-dialog.component.html',
  styleUrl: './censo-dialog.component.scss'
})
export class CensoDialogComponent {  currentDate = DateTime.local().toISODate();

  clientForm: FormGroup;
  equipoForm: FormGroup;
  impresoraForm: FormGroup;

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
    @Inject(MAT_DIALOG_DATA) public data: ClienteRegistradoData,
  ) { 

    const fechaRegistro = data?.cliente?.fechaRegistro && typeof data.cliente.fechaRegistro === 'object' 
      ? this._censosSevice.convertTimestampToDate(data.cliente.fechaRegistro) 
      : '';

    const fechaRegistroEquipo = data?.equipo?.fechaCaducidadAnti && typeof data.equipo.fechaCaducidadAnti === 'object' 
      ? this._censosSevice.convertTimestampToDate(data.equipo.fechaCaducidadAnti) 
      : '';
    
    this.clientForm = this.formBuilder.group({
      cliente: [{ value: data?.cliente?.cliente, disabled: true }, Validators.required],
      claveASPEL: [{ value: data?.cliente?.claveASPEL, disabled: true }, Validators.required],
      whatsApp: [{ value: data?.cliente?.whatsApp, disabled: true }, Validators.required],
      telefono: [{ value: data?.cliente?.telefono, disabled: true }, Validators.required],
      correo: [{ value: data?.cliente?.correo, disabled: true }, Validators.required],
      fechaRegistro: [{ value: fechaRegistro, disabled: false }, Validators.required],
    });

    this.equipoForm = this.formBuilder.group({    
      modelo: [ data?.equipo?.modelo || '', Validators.required],
      marca: [ data?.equipo?.marca || '', Validators.required],
      numeroSerie: [ data?.equipo?.numeroSerie || '', Validators.required],
      sistemOperativoV: [ data?.equipo?.sistemOperativoV || '', Validators.required],
      officeV: [ data?.equipo?.officeV || '', Validators.required],
      antivirus: [ data?.equipo?.antivirus || '', Validators.required],
      fechaCaducidadAnti: [ fechaRegistroEquipo || '', Validators.required],
      qr: [ data?.equipo?.qr || '', Validators.required],
      areaDepartamento: [ data?.equipo?.areaDepartamento || '', Validators.required],
      reponsableEquipo: [ data?.equipo?.reponsableEquipo || '', Validators.required],
      responsableCorreo: [ data?.equipo?.responsableCorreo || '', Validators.required],
      tipo: [ data?.equipo?.tipo || '', Validators.required],
    });
  
    this.impresoraForm = this.formBuilder.group({
      modelo: [data?.equipo?.modelo || '', Validators.required],
      marca: [ data?.equipo?.marca || '', Validators.required],
      numeroSerie: [ data?.equipo?.numeroSerie || '', Validators.required],
      sistemOperativoV: [ data?.equipo?.sistemOperativoV || '', Validators.required],
      officeV: [ data?.equipo?.officeV || '', Validators.required],
      antivirus: [ data?.equipo?.antivirus || '', Validators.required],
      fechaCaducidadAnti: [ fechaRegistroEquipo || '', Validators.required],
      qr: [ data?.equipo?.qr || '', Validators.required],
      areaDepartamento: [ data?.equipo?.areaDepartamento || '', Validators.required],
      tipo: [ data?.equipo?.tipo || '', Validators.required],
    });

    this.galleryImages = (data.imagenes || []).map((url: string) => ({
      small: url,
      medium: url,
      big: url
    }));
  }

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
          cliente: this.clientForm.getRawValue(),
          impresora: this.impresoraForm.value,
        }
      } else {
        censo = {
          cliente: this.clientForm.getRawValue(),
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
