import { Component, Inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ClienteData } from '../../../catalogos/interfaces/clientes.interface';
import { ClientesService } from '../../../catalogos/services/clientes.service';

import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-clientes-dialog',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule, MatAutocompleteModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './clientes-dialog.component.html',
  styleUrl: './clientes-dialog.component.scss'
})
export class ClientesDialogComponent {
  myControl = new FormControl('');
  options: ClienteData[] = [];
  filteredOptions!: Observable<ClienteData[]>;

  constructor(
    public dialogRef: MatDialogRef<ClientesDialogComponent>,
    private _clientesService: ClientesService,
    @Inject(MAT_DIALOG_DATA) public data: ClienteData,
  ) {}

  ngOnInit() {
    this.loadclientes();
  }

  async loadclientes() {
    try {
      const clientes: ClienteData[] = await this._clientesService.getClientes() as ClienteData[];
      this.options = clientes;
      console.log('Clientes:', clientes);
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          const cliente = typeof value === 'string' ? value : value.cliente;
          return cliente ?  this._filter(cliente as string) : this.options.slice();
        }),
      );

    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  }

  displayFn(user: ClienteData): string {
    return user && user.cliente ? user.cliente : '';
  }

  private _filter(cliente: string): ClienteData[] {
    console.log('value:', cliente);
    const filterValue = cliente.toLowerCase();
    return this.options.filter(option => option.cliente.toLowerCase().includes(filterValue));
  }

}
