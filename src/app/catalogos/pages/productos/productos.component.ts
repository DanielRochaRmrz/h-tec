import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { ProductosDialogComponent } from '../../dialogs/productos-dialog/productos-dialog.component';

import { ProductoData } from '../../interfaces/productos.interface';
import { ProductosService } from '../../services/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatPaginator, MatSort, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {

  displayedColumns: string[] = ['clave', 'descripcion', 'precio', 'acciones'];
  dataSource!: MatTableDataSource<ProductoData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _productosService: ProductosService, public dialog: MatDialog) {

  }

  ngAfterViewInit() {
    this.getDataProductos();
  }

  async getDataProductos() {
    try {
      const productos = await this._productosService.getProductos();
      console.log('Clientes:', productos);

      this.dataSource = new MatTableDataSource<ProductoData>(productos as ProductoData[]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
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
    const dialogRef = this.dialog.open(ProductosDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getDataProductos();
      const animal = result;
    });
  }

  consultar(row: any) {
    // Lógica para consultar
  }

  editar(row: any) {
    // Lógica para editar
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
        this._productosService.eliminarProducto(row.id).then(() => {
          Swal.fire(
            'Eliminado',
            'El producto ha sido eliminado.',
            'success'
          );
          this.getDataProductos();
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
}
