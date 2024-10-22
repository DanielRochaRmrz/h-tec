import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { TecnicosData } from '../../interfaces/tecnicos.interfaces';
import { TecnicosService } from '../../services/tecnicos.service';
import { TecnicosDialogComponent } from '../../dialogs/tecnicos-dialog/tecnicos-dialog.component';
import { error } from 'console';

@Component({
  selector: 'app-tecnicos',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatPaginator, MatSort, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule],
  templateUrl: './tecnicos.component.html',
  styleUrl: './tecnicos.component.scss'
})
export class TecnicosComponent {

  displayedColumns: string[] = ['clave', 'clasificacion', 'nombre', 'whatsApp', 'correo', 'acciones'];
  dataSource!: MatTableDataSource<TecnicosData>;
  isSaveDisabled: boolean = false;
  type?: string;

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
      data: { isSaveDisabled: false, type: 'agregar' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._tecnicoService.addTecnico(result).then(() => {
          Swal.fire(
            'Agregado',
            'El técnico ha sido agregado exitosamente.',
            'success'
          );
          this.getDataTecnicos();
        }).catch(error => {
          console.error('Error al agregar el técnico');
        })
      }
    });
  }

  consultar(row: any) { 
    this.dialog.open(TecnicosDialogComponent, {
      data: { ...row, isSaveDisabled: true, type: 'ver' }
    });
  }

  editar(row: any) {
    const dialogRef = this.dialog.open(TecnicosDialogComponent, {
      data: { ...row, isSaveDisables: false, type: 'editar' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._tecnicoService.actualizarTecnico(row.id, result).then(() => {
          Swal.fire(
            'Actualizado',
            'El técnico fue actulizado',
            'success'
          );
          this.getDataTecnicos();
        }).catch(error => {
          Swal.fire(
            'Error',
            'Hubo un problema al actualizar el técnico',
            'error'
          );
          console.error('Error al actualizar técnico', error);
        });
      }
    })
  }

  eliminar(row: any) {
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
        this._tecnicoService.eliminarTecnico(row.id).then(() => {
          Swal.fire(
            'Eliminado',
            'El técnico ha sido eliminado.',
            'success'
          );
          this.getDataTecnicos();
        }).catch(error => {
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el técnico.',
            'error'
          );
          console.error('Error al eliminar el técnico', error);
        });
      }
    });
  }

}
