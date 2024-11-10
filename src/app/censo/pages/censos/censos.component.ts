import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { CensosService } from '../../services/censos.service';
import { CensosData } from '../../interfaces/cesos.interface';
import { CensoDialogComponent } from '../../dialogs/censo-dialog/censo-dialog.component';
import { CensoDetalleDialogComponent } from '../../dialogs/censo-detalle-dialog/censo-detalle-dialog.component';
import { ClienteRegistradoData } from './../../../catalogos/interfaces/censo.interface';

@Component({
  selector: 'app-censos',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatPaginator, MatSort, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule, CommonModule],
  templateUrl: './censos.component.html',
  styleUrl: './censos.component.scss'
})
export class CensosComponent {

  displayedColumns: string[] = ['censoNo', 'cliente', 'equipo', 'qr', 'acciones'];
  dataSource!: MatTableDataSource<ClienteRegistradoData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _censosService: CensosService, public dialog: MatDialog) {

  }

  ngAfterViewInit() {
    this.getDataCensos();
  }

  async getDataCensos() {
    try {
      const censos = await this._censosService.getCensos();
      console.log('Censos:', censos);

      this.dataSource = new MatTableDataSource<ClienteRegistradoData>(censos as ClienteRegistradoData[]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
      console.error('Error al obtener los tecnicos:', error);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CensoDialogComponent, {
      data: {},
      panelClass: 'full-screen-modal',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getDataCensos();
    });
  }

  openCensoDetalleDialog(row: CensosData): void {
    const dialogRef = this.dialog.open(CensoDetalleDialogComponent, {
      data: row,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getDataCensos();
    });
  }

  eliminar(row: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this._censosService.eliminarCenso(row.id).then(() => {
          Swal.fire(
            'Eliminado',
            'El producto ha sido eliminado.',
            'success'
          );
          this.getDataCensos();
        }).catch(error => {
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el producto.',
            'error'
          );
          console.error('Error al eliminar el producto', error);
        });
      }
    });
  }

  editar(row: any): void {
   this.dialog.open(CensoDialogComponent, {
      data: {...row, editMod: true},
      panelClass: 'full-screen-modal',
    }); 
  }
}
