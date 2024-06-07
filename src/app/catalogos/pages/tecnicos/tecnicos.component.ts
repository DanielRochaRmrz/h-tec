import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { TecnicosData } from '../../interfaces/tecnicos.interfaces';
import { TecnicosService } from '../../services/tecnicos.service';
import { TecnicosDialogComponent } from '../../dialogs/tecnicos-dialog/tecnicos-dialog.component';

@Component({
  selector: 'app-tecnicos',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatPaginator, MatSort, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule],
  templateUrl: './tecnicos.component.html',
  styleUrl: './tecnicos.component.scss'
})
export class TecnicosComponent {

  displayedColumns: string[] = ['clave', 'clasificacion', 'nombre', 'whatsApp', 'correo'];
  dataSource!: MatTableDataSource<TecnicosData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _tecnicoService: TecnicosService, public dialog: MatDialog) {

  }

  ngAfterViewInit() {
    this.getDataTecnicos();
  }

  async getDataTecnicos() {
    try {
      const tecnicos = await this._tecnicoService.getTecnicos();
      console.log('Tecnicos:', tecnicos);

      this.dataSource = new MatTableDataSource<TecnicosData>(tecnicos as TecnicosData[]);
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
    const dialogRef = this.dialog.open(TecnicosDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getDataTecnicos();
      const animal = result;
    });
  }

}
