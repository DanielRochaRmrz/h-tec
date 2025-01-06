import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ItemsDispositivoComponent } from '../items-dispositivo/items-dispositivo.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Component({
  selector: 'app-censo-dialog',
  standalone: true,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  imports: [ReactiveFormsModule, NgFor, MatCardModule, MatDatepickerModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatRadioModule, MatStepperModule, MatExpansionModule, NgxGalleryModule, CommonModule, MatSelectModule, MatOptionModule],
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
  public equipos: any[] = [];
  public impresoras: any[] = [];
  isSmallScreen: boolean = false;
  isSmallScreenImpresora: boolean = false;
  private readonly customBreakpoint = '(max-width: 800px)';
  selectedEquipo: any;

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

  public expansionPanelEquipoDisabled: boolean = false;
  public expansionPanelImpresoraDisabled: boolean = false;
  public expansionPanelEquipoExpanded: boolean = false;
  public expansionPanelImpresoraExpanded: boolean = false;
  public highlightInvalidPanels: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private _censosSevice: CensosService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CensoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClienteRegistradoData,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {

    const fechaRegistro = data?.cliente?.fechaRegistro && typeof data.cliente.fechaRegistro === 'string'
      ? moment(data.cliente.fechaRegistro, 'DD/MM/YYYY').toDate()
      : null;

    const fechaRegistroEquipo = data?.equipo?.fechaCaducidadAnti && typeof data?.equipo?.fechaCaducidadAnti === 'string'
      ? moment(data?.equipo?.fechaCaducidadAnti, 'DD/MM/YYYY').toDate()
      : null;

    this.clientForm = this.formBuilder.group({
      cliente: [{ value: data?.cliente?.['cliente'], disabled: true }, Validators.required],
      claveASPEL: [{ value: data?.cliente?.['claveASPEL'], disabled: true }, Validators.required],
      whatsApp: [{ value: data?.cliente?.['whatsApp'], disabled: true }, Validators.required],
      telefono: [{ value: data?.cliente?.['telefono'], disabled: true }, Validators.required],
      correo: [{ value: data?.cliente?.['correo'], disabled: true }, Validators.required],
      fechaRegistro: [{ value: fechaRegistro, disabled: false }, Validators.required]
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
      tipo: [data?.equipo?.tipo || '', Validators.required]
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

    this.cdr.detectChanges;
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = this.data.editMod;
      this.censoId = this.data.id;
      if (this.isEditMode) {
        this.loadCenso(this.censoId);
      }
    }
    this.getDataDispositivo("equipo", this.equipos);
    this.getDataDispositivo("impresora", this.impresoras);
    this.breakpointObserver
      .observe([this.customBreakpoint])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
        this.isSmallScreenImpresora = result.matches;
      });
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
      console.log('Censo:', censo);

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
        Swal.fire('Error', 'Debe llenar la sección de "Descripción" ya sea "Descripción de equipo" o "Descripción de impresora"', 'error');
        return;
      } else if (this.clientForm.getRawValue().cliente === undefined) {
        Swal.fire('Error', 'Debe seleccionar un cliente', 'error');
        return;
      } else if (this.filesUpladed.length === 0 && this.existingImages.length === 0) {
        Swal.fire('Error', 'Debe subir al menos una imagen', 'error');
        return;
      }

      Swal.fire({
        title: 'Procesando...',
        text: 'Por favor espere mientras se guarda la información.',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
      });

      let censo: any;

      const clientData = this.clientForm.getRawValue();
      clientData.fechaRegistro = clientData.fechaRegistro ? moment(clientData.fechaRegistro).format('DD/MM/YYYY') : null;

      const equipoData = this.equipoForm.getRawValue();
      equipoData.fechaCaducidadAnti = equipoData.fechaCaducidadAnti ? moment(equipoData.fechaCaducidadAnti).format('DD/MM/YYYY') : null;

      if (this.equipoForm.valid) {
        censo = {
          cliente: clientData,
          equipo: equipoData,
        };
      } else if (this.impresoraForm.valid) {
        censo = {
          cliente: clientData,
          impresora: this.impresoraForm.value,
        };
      }

      let respCenso;
      let idCenso: string;

      if (this.data.editMod) {
        respCenso = await this._censosSevice.updateCensoData(this.data.id, censo);
        idCenso = this.data.id;

        const uploadPromises = Array.from(this.filesUpladed).map(async (file: File) => {
          const resp = await this._censosSevice.uploadImg(file, idCenso);
          return resp;
        });

        const nuevasImagenes = await Promise.all(uploadPromises);

        const imagenesFinales = [...this.data.imagenes, ...nuevasImagenes];
        await this._censosSevice.updateCenso(idCenso, { imagenes: imagenesFinales });

        const deletePromises = this.imagesToDelete.map(async (imgUrl: string) => {
          await this._censosSevice.deleteImg(imgUrl, idCenso);
        });
        await Promise.all(deletePromises);

        Swal.close(); // Cerrar el alert de Procesando
        Swal.fire('Censo actualizado', 'El censo se ha actualizado con éxito', 'success').then(() => {
          this.dialogRef.close();
          window.location.reload();
        })
      } else {
        respCenso = await this._censosSevice.addCenso(censo);
        idCenso = respCenso.id;

        const uploadPromises = Array.from(this.filesUpladed).map(async (file: File) => {
          const resp = await this._censosSevice.uploadImg(file, idCenso);
          return resp;
        });

        const updateCenso = this._censosSevice.updateCenso(idCenso, { imagenes: await Promise.all(uploadPromises) });

        await Promise.all([respCenso, uploadPromises, updateCenso]);

        Swal.close(); // Cerrar el alert de Procesando
        Swal.fire('Censo guardado', 'El censo se ha guardado con éxito', 'success');
      }

      this.dialogRef.close();
    } catch (error) {
      console.error(error);
      Swal.close();
      Swal.fire('Error', 'Hubo un problema al guardar el censo', 'error');
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  async getDataDispositivo(tipo: string, targetArray: any[]) {
    try {
      const data = await this._censosSevice.getItemsDispositivos(tipo) as any[];
      targetArray.length = 0; // Limpia el array antes de llenarlo
      targetArray.push(...data); // Llena el array con los nuevos datos
      console.log(`${tipo}s:`, targetArray);
    } catch (error) {
      console.error(`Error al obtener los ${tipo}s:`, error);
    }
  }

  openDialogDispositivos(tipo: string) {
    const dialogRef = this.dialog.open(ItemsDispositivoComponent, {
      data: { tipo },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getDataDispositivo("equipo", this.equipos);
      this.getDataDispositivo("impresora", this.impresoras);
    })
  }


  editDispositivo(item: any, dispositivo: string) {

    var editMod: boolean = true;
    const dialogRef = this.dialog.open(ItemsDispositivoComponent, {
      data: { item, editMod }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let targetArray = dispositivo === "equipo" ? this.equipos : this.impresoras;
        const index = targetArray.findIndex(c => c.id === item.id);
        if (index !== -1) {
          targetArray[index] = { ...targetArray[index], ...result };
        }
      }
    })
  }

  deleteDispositivo(item: any, dispositivo: string) {
    Swal.fire({
      title: '¿Estás seguro de eliminar el item?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this._censosSevice.eliminarItem(item.id).then(() => {

          if (dispositivo === 'impresora') {
            this.getDataDispositivo('impresora', this.impresoras);
          } else {
            this.getDataDispositivo('equipo', this.equipos);
          }

          Swal.fire(
            'Eliminado',
            'El item ha sido eliminado.',
            'success'
          );
        }).catch(error => {
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el item.',
            'error'
          );
          console.error('Error al eliminar el item', error);
        });
      }
    });
  }

  toggleExpansionPanel(type: 'equipo' | 'impresora') {
    const otherType = type === 'equipo' ? 'impresora' : 'equipo';
    const otherForm = type === 'equipo' ? this.impresoraForm : this.equipoForm;

    if (otherForm.dirty || otherForm.touched) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: `¡El formulario de ${otherType} se va a borrar o resetear si eliges complementar la información del ${type}!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, continuar"
      }).then((result) => {
        if (result.isConfirmed) {
          otherForm.reset();
          this.setPanelState(type, true);
        }
      });
    } else {
      this.setPanelState(type, true);
    }
  }

  private setPanelState(type: 'equipo' | 'impresora', expanded: boolean) {
    if (type === 'equipo') {
      this.expansionPanelEquipoDisabled = false;
      this.expansionPanelImpresoraDisabled = true;
      this.expansionPanelEquipoExpanded = expanded;
      this.expansionPanelImpresoraExpanded = !expanded;
    } else {
      this.expansionPanelEquipoDisabled = true;
      this.expansionPanelImpresoraDisabled = false;
      this.expansionPanelEquipoExpanded = !expanded;
      this.expansionPanelImpresoraExpanded = expanded;
    }
  }

  isFormPanelInvalid(type: 'equipo' | 'impresora'): boolean {
    return type === 'equipo' ? this.equipoForm.invalid : this.impresoraForm.invalid;
  }

  highlightInvalid() {
    this.highlightInvalidPanels = true;
  }


}
