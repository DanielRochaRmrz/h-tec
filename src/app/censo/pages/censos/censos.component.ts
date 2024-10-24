import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { TecnicosData } from './../../../catalogos/interfaces/tecnicos.interfaces';
import { CensosService } from '../../services/censos.service';
import { CensosData } from '../../interfaces/cesos.interface';

import { CensoDialogComponent } from '../../dialogs/censo-dialog/censo-dialog.component';
import { CensoDetalleDialogComponent } from '../../dialogs/censo-detalle-dialog/censo-detalle-dialog.component';


@Component({
  selector: 'app-censos',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatPaginator, MatSort, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule],
  templateUrl: './censos.component.html',
  styleUrl: './censos.component.scss'
})
export class CensosComponent {

  displayedColumns: string[] = ['censoNo', 'cliente', 'equipo', 'qr', 'acciones'];
  dataSource!: MatTableDataSource<CensosData>;

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

      this.dataSource = new MatTableDataSource<CensosData>(censos as CensosData[]);
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

  }

  editar(row: any): void {

  }

}
