import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductosDialogComponent } from '../../dialogs/productos-dialog/productos-dialog.component';
import { ProductoData } from '../../interfaces/productos.interface';
import { ProductosService } from '../../services/productos.service';
import { DialogService } from '../../../shared/services/dialog.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-productos',
    imports: [MatButtonModule, MatIconModule, MatPaginator, MatSort, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule, CommonModule],
    templateUrl: './productos.component.html',
    styleUrl: './productos.component.scss'
})
export class ProductosComponent {

  displayedColumns: string[] = ['clave', 'descripcion', 'precio', 'acciones'];
  dataSource!: MatTableDataSource<ProductoData>;
  isSaveDisabled: boolean = false;
  type?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private _dialogService = inject(DialogService);
  private _productosService = inject(ProductosService);

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
    this._dialogService.abrirDialogo(ProductosDialogComponent, {
      isSaveDisabled: false,
      type: 'agregar'
    }).afterClosed().subscribe(result => {
      if (result) {
        this._productosService.addProducto(result).then(() => {
          Swal.fire(
            'Agregado',
            'El producto ha sido agregado exitosamente.',
            'success'
          );
          this.getDataProductos();
        }).catch(error => {
          console.error('Error al agregar el producto', error);
        });
      }
    });
  }

  consultar(row: any): void {
    this._dialogService.abrirDialogo(ProductosDialogComponent, {
      ...row,
      isSaveDisabled: true,
      type: 'ver'
    });
  }

  editar(row: any): void {
    const dialogRef = this._dialogService.abrirDialogo(ProductosDialogComponent, {
      ...row,
      isSaveDisabled: false,
      type: 'editar'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._productosService.actualizarProducto(row.id, result).then(() => {
          Swal.fire(
            'Actualizado',
            'El producto ha sido actualizado.',
            'success'
          );
          this.getDataProductos();
        }).catch(error => {
          Swal.fire(
            'Error',
            'Hubo un problema al actualizar el producto.',
            'error'
          );
          console.error('Error al actualizar el producto', error);
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
