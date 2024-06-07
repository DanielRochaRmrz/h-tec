import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button'

import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryModule, NgxGalleryOptions } from '@kolkov/ngx-gallery';

import { CensosData } from '../../interfaces/cesos.interface';

@Component({
  selector: 'app-censo-detalle-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, NgxGalleryModule],
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

  constructor(
    public dialogRef: MatDialogRef<CensoDetalleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CensosData,
  ) {
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

}
