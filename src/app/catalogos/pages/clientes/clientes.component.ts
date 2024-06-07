import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { ClientesDialogComponent } from '../../dialogs/clientes-dialog/clientes-dialog.component';

import { ClientesService } from '../../services/clientes.service';
import { ClienteData } from '../../interfaces/clientes.interface';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatPaginator, MatSort, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent {

  displayedColumns: string[] = ['clienteId', 'cliente', 'rfc', 'telefono', 'correo'];
  dataSource!: MatTableDataSource<ClienteData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _clientesService: ClientesService, public dialog: MatDialog) {

  }

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
    const dialogRef = this.dialog.open(ClientesDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getDataClientes();
      const animal = result;
    });
  }

}
