import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryModule, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { ClienteRegistradoData } from './../../../catalogos/interfaces/censo.interface';
import { CommonModule } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';


@Component({
  selector: 'app-censo-detalle-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, NgxGalleryModule, CommonModule],
  templateUrl: './censo-detalle-dialog.component.html',
  styleUrl: './censo-detalle-dialog.component.scss'
})
export class CensoDetalleDialogComponent {

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

  formattedFechaCaducidadAnti: string = '';
  formattedFecha: string = '';

  constructor(
    public dialogRef: MatDialogRef<CensoDetalleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClienteRegistradoData,
  ) {
    
    const timestamp = new Timestamp(this.data?.equipo?.fechaCaducidadAnti.seconds, this.data?.equipo?.fechaCaducidadAnti.nanoseconds);
    this.formattedFechaCaducidadAnti = this.formatTimestamp(timestamp);
    const timestamp2 = new Timestamp(this.data.cliente.fechaRegistro.seconds, this.data.cliente.fechaRegistro.nanoseconds);
    this.formattedFechaCaducidadAnti = this.formatTimestamp(timestamp);
    this.formattedFecha = this.formatTimestamp(timestamp2);

    if (data.imagenes) {
      this.galleryImages = data.imagenes.map((img) => {
        return {
          small: img,
          medium: img,
          big: img
        };
      });
    }
  }

  formatTimestamp(timestamp: Timestamp) {
    const date = timestamp.toDate();
    return date.toLocaleDateString();

  }

}
