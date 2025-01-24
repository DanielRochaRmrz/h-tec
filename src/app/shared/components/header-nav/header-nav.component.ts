import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header-nav',
  standalone: true,
  imports: [RouterModule, RouterOutlet, MatCardModule, MatButtonModule, MatIconModule, MatSidenavModule, MatToolbarModule],
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.scss'
})
export class HeaderNavComponent {

@ViewChild('drawer') drawer!: MatDrawer;

@HostListener('window:resize', ['$event'])

onResize(event: Event) {
  this.checkScreenSize();
}

ngOnInit(){
  this.checkScreenSize();
}

checkScreenSize(){
  if(window.innerWidth < 768){
    this.drawer.close();
  }
}

toggleDrawer(){
  this.drawer.toggle();
}
  
  private router = inject(Router);
  public title = '';
  constructor(private _authService: AuthService) {
    this.router.events.subscribe((router: any) => {
      switch (router.url) {
        case '/catalogos/clientes':
          this.title = 'Clientes';
          break;
        case '/catalogos/productos':
          this.title = 'Productos';
          break;
        case '/catalogos/tecnicos':
          this.title = 'Técnicos';
          break;
        case '/censo/censo':
          this.title = 'Censos';
          break;
        default:
          this.title = '';
          break;
      }
    });
  }

  logout(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._authService.logout();
        Swal.fire(
          'Cerrado',
          'Has cerrado sesión exitosamente.',
          'success'
        );
      }
    });
  }
}
