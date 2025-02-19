import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
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
    imports: [RouterModule, RouterOutlet, NgIf, MatCardModule, MatButtonModule, MatIconModule, MatSidenavModule, MatToolbarModule],
    templateUrl: './header-nav.component.html',
    styleUrl: './header-nav.component.scss'
})
export class HeaderNavComponent {
  @ViewChild('drawer') drawer!: MatDrawer;
  windowWidth = window.innerWidth;
  isMobile = false;
  submenuOpen = false;

  private router = inject(Router);
  public title = '';

  constructor(private _authService: AuthService) {
    this.onResize();
    this.router.events.subscribe((router: any) => {
      switch (router.url) {
        case '/catalogos/clientes':
        case '/catalogos/productos':
        case '/catalogos/tecnicos':
          this.title = router.url.split('/').pop()?.charAt(0).toUpperCase() + router.url.split('/').pop()?.slice(1);
          this.submenuOpen = true;
          break;
        case '/censo/censo':
          this.title = 'Censos';
          this.submenuOpen = false;
          break;
        default:
          this.title = '';
          this.submenuOpen = false;
          break;
      }
      localStorage.setItem('submenuOpen', JSON.stringify(this.submenuOpen));
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth = window.innerWidth;
    this.isMobile = this.windowWidth < 768;
    setTimeout(() => {
      if (this.isMobile && this.drawer.opened) {
        this.drawer.close();
      }
    }, 10);
  }

  ngOnInit() {
  const savedSubmenuState = localStorage.getItem('submenuOpen');
  this.submenuOpen = savedSubmenuState ? JSON.parse(savedSubmenuState) : false;
}

  ngAfterViewInit() {
    setTimeout(() => {
      this.windowWidth = window.innerWidth;
    });
  }

  toggleDrawer() {
    this.drawer.toggle();
  }

  closeDrawer() {
    if (this.isMobile && this.drawer) {
      this.drawer.close();
    }
  }

  toggleSubmenu(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.submenuOpen = !this.submenuOpen;
    localStorage.setItem('submenuOpen', JSON.stringify(this.submenuOpen));
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
        Swal.fire('Cerrado', 'Has cerrado sesión exitosamente.', 'success');
      }
    });
  }
}
