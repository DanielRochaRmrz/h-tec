import { Component, inject, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClientesDialogComponent } from '../../dialogs/clientes-dialog/clientes-dialog.component';
import Swal from 'sweetalert2';
import { ClientesService } from '../../services/clientes.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { ClienteData } from '../../interfaces/clientes.interface';

@Component({
    selector: 'app-clientes',
    imports: [MatButtonModule, MatIconModule, MatPaginator, MatSort, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule],
    templateUrl: './clientes.component.html',
    styleUrl: './clientes.component.scss'
})
export class ClientesComponent {

  displayedColumns: string[] = ['clienteId', 'cliente', 'rfc', 'telefono', 'correo', 'acciones'];
  dataSource!: MatTableDataSource<ClienteData>;
  isSaveDisabled: boolean = false;
  type?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private _dialogService = inject(DialogService);
  private _clientesService = inject(ClientesService);

  ngAfterViewInit() {
    this.getDataClientes();
  }

  async getDataClientes() {
    try {
      const clientes = await this._clientesService.getClientes();
      console.log('Clientes:', clientes);

      this.dataSource = new MatTableDataSource<ClienteData>(clientes as ClienteData[]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
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
    const dialogRef = this._dialogService.abrirDialogo(ClientesDialogComponent, {
      isSaveDisabled: false,
      type: 'agregar'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._clientesService.addCliente(result).then(() => {
          Swal.fire(
            'Agregado',
            'El cliente ha sido agregado exitosamente.',
            'success'
          );
          this.getDataClientes();
        }).catch(error => {
          console.error('Error al agregar el cliente', error);
        });
      }
    });
  }

  consultar(row: any): void {
    this._dialogService.abrirDialogo(ClientesDialogComponent, {
      ...row,
      isSaveDisabled: true,
      type: 'ver'
    });
  }

  editar(row: any): void {
    const dialogRef = this._dialogService.abrirDialogo(ClientesDialogComponent, {
      ...row,
      isSaveDisabled: false,
      type: 'editar'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._clientesService.actualizarCliente(row.id, result).then(() => {
          Swal.fire(
            'Actualizado',
            'El cliente ha sido actualizado.',
            'success'
          );
          this.getDataClientes();
        }).catch(error => {
          Swal.fire(
            'Error',
            'Hubo un problema al actualizar el cliente.',
            'error'
          );
          console.error('Error al actualizar el cliente', error);
        });
      }
    });
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
       this._clientesService.eliminarCliente(row.id).then(() => {
         Swal.fire(
           'Eliminado',
           'El cliente ha sido eliminado.',
           'success'
         );
         this.getDataClientes();
       }).catch(error => {
         Swal.fire(
           'Error',
           'Hubo un problema al eliminar el cliente.',
           'error'
         );
         console.error('Error al eliminar el cliente', error);
       });
     }
   });
 }

}
