import { Component, Inject, viewChild, ViewChild  } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
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
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryModule, NgxGalleryOptions, NgxGalleryComponent } from '@kolkov/ngx-gallery';
import { CensosService } from '../../services/censos.service';
import { ClienteRegistradoData } from './../../../catalogos/interfaces/censo.interface';
import { ClientesDialogComponent } from '../clientes-dialog/clientes-dialog.component';

@Component({
  selector: 'app-censo-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, NgFor, MatCardModule, MatDatepickerModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatRadioModule, MatStepperModule, MatExpansionModule, NgxGalleryModule, CommonModule],
  templateUrl: './censo-dialog.component.html',
  styleUrl: './censo-dialog.component.scss'
})
export class CensoDialogComponent {

  @ViewChild(NgxGalleryComponent) gallery!: NgxGalleryComponent;
  currentImageIndex: number = 0;
  currentDate = DateTime.local().toISODate();
  clientForm: FormGroup;
  equipoForm: FormGroup;
  impresoraForm: FormGroup;
  existingImages: string[] = []; // Lista para las imágenes existentes
  imagesToDelete: string[] = []; // Lista para las imágenes a eliminar
  isLinear = true;
  step = 0;
  isEditMode = false;
  censoId = '';

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
        cliente: [{ value: data?.cliente?.['cliente'], disabled: true }, Validators.required],
        claveASPEL: [{ value: data?.cliente?.['claveASPEL'], disabled: true }, Validators.required],
        whatsApp: [{ value: data?.cliente?.['whatsApp'], disabled: true }, Validators.required],
        telefono: [{ value: data?.cliente?.['telefono'], disabled: true }, Validators.required],
        correo: [{ value: data?.cliente?.['correo'], disabled: true }, Validators.required],
        fechaRegistro: [{ value: fechaRegistro, disabled: false }, Validators.required],
      });

    this.equipoForm = this.formBuilder.group({
      modelo: [data?.equipo?.modelo || '', Validators.required],
      marca: [data?.equipo?.marca || '', Validators.required],
      numeroSerie: [data?.equipo?.numeroSerie || '', Validators.required],
      sistemOperativoV: [data?.equipo?.sistemOperativoV || '', Validators.required],
      officeV: [data?.equipo?.officeV || '', Validators.required],
      antivirus: [data?.equipo?.antivirus || '', Validators.required],
      fechaCaducidadAnti: [fechaRegistroEquipo || '', Validators.required],
      qr: [data?.equipo?.qr || '', Validators.required],
      areaDepartamento: [data?.equipo?.areaDepartamento || '', Validators.required],
      reponsableEquipo: [data?.equipo?.reponsableEquipo || '', Validators.required],
      responsableCorreo: [data?.equipo?.responsableCorreo || '', Validators.required],
      tipo: [data?.equipo?.tipo || '', Validators.required],
    });

    this.impresoraForm = this.formBuilder.group({
      tipo: [data?.impresora?.tipo || '', Validators.required],
      modelo: [data?.impresora?.modelo || '', Validators.required],
      marca: [data?.impresora?.marca || '', Validators.required],
      numeroSerie: [data?.impresora?.numeroSerie || '', Validators.required],
      toner: [data?.impresora?.toner || '', Validators.required],
      qr: [data?.impresora?.qr || '', Validators.required],
      areaDepartamento: [data?.impresora?.areaDepartamento || '', Validators.required]
    });

    this.existingImages = data.imagenes || [];
    this.loadGalleryImages();

    this.galleryImages = (data.imagenes || []).map((url: string) => ({
      small: url,
      medium: url,
      big: url
    }));
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = this.data.editMod;
      this.censoId = this.data.id;
      if (this.isEditMode) {
        this.loadCenso(this.censoId);
      }
    }
  }

  isFormValid(): boolean {
    return this.equipoForm.valid || this.impresoraForm.valid;
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
    this.galleryImages = [
      ...this.existingImages.map((url, index) => ({
        small: url,
        medium: url,
        big: url,
        index: index
      })),
      ...this.previewUrls.map((url: string | ArrayBuffer, index: number) => ({
        small: url as string,
        medium: url as string,
        big: url as string,
        index: this.existingImages.length + index
      }))
    ];
  }
  

  async loadCenso(id: string) {
    try {
      const censo = await this._censosSevice.getCensoById(id);
      if (censo) {
        this.existingImages = censo['imagenes'] || [];
        this.loadGalleryImages();
      }
     } 
    catch (error) {
      console.error(error);
    }
  }
  removeImage(index: number) {
  
    if (index < this.existingImages.length) {
      const imgUrl = this.existingImages[index];
      this.imagesToDelete.push(imgUrl);
      this.existingImages.splice(index, 1);
    } else {
      const newIndex = index - this.existingImages.length;
      this.previewUrls.splice(newIndex, 1);
      this.filesUpladed.splice(newIndex, 1);
    }
  
    this.loadGalleryImages();
  }

  onImageChange(event: any) {
    this.currentImageIndex = event.index;    
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
      if (this.equipoForm.invalid && this.impresoraForm.invalid) {
        // Mostrar un mensaje de error si ambos formularios son inválidos
        Swal.fire('Error', 'Debe llenar la sección de "Descripción" ya sea "Descripción de equipo" o "Descripción de impresora"  ', 'error');
        return;
      }

      let censo: any;

      if (this.equipoForm.valid) {
        censo = {
          cliente: this.clientForm.getRawValue(),
          equipo: this.equipoForm.value,
        };
      } else if (this.impresoraForm.valid) {
        censo = {
          cliente: this.clientForm.getRawValue(),
          impresora: this.impresoraForm.value,
        };
      }

      let respCenso;
      let idCenso: string;

      if (this.data.editMod) {

        respCenso = await this._censosSevice.updateCensoData(this.data.id, censo);
        idCenso = this.data.id;

        // Subir imagenes 
        const upLoadPromises = Array.from(this.filesUpladed).map(async (file: File) => {
          const resp = await this._censosSevice.uploadImg(file, idCenso);
          return resp;
        });

        const nuevasImagenes = await Promise.all(upLoadPromises);

        // Combinar imagenes anteriores con las nuevas
        const imagenesFinales = [...this.data.imagenes, ...nuevasImagenes];
        await this._censosSevice.updateCenso(idCenso, { imagenes: imagenesFinales });

        // Eliminar imágenes de Firebase
        const deletePromises = this.imagesToDelete.map(async (imgUrl: string) => {
          await this._censosSevice.deleteImg(imgUrl, idCenso);
        });
        await Promise.all(deletePromises);

        Swal.fire('Censo actualizado', 'El censo se ha actualizado con éxito', 'success');

      } else {

        respCenso = await this._censosSevice.addCenso(censo);
        idCenso = respCenso.id;

        const uploadPromises = Array.from(this.filesUpladed).map(async (file: File) => {
          const resp = await this._censosSevice.uploadImg(file, idCenso);
          return resp;
        });

        const updateCenso = this._censosSevice.updateCenso(idCenso, { imagenes: await Promise.all(uploadPromises) });

        Promise.all([respCenso, uploadPromises, updateCenso]).then(() => {
          Swal.fire('Censo agregado', 'El censo se ha agregado con éxito', 'success');
        });

      }

      this.dialogRef.close();
    } catch (error) {
      console.error(error);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
