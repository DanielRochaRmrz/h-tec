import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import Swal from 'sweetalert2';
@Component({
    selector: 'app-root',
    imports: [RouterModule, RouterOutlet, MatCardModule, MatButtonModule, MatIconModule, MatSidenavModule, MatToolbarModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  private router = inject(Router);
  public title = '';
  protected deferredPrompt: any;
  constructor() {
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

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    this.deferredPrompt = event;

    // Esperar 5 segundos antes de mostrar la alerta
    setTimeout(() => {
      this.showInstallAlert();
    }, 5000);
  }

  showInstallAlert() {
    Swal.fire({
      title: 'Instalar App',
      text: '¿Deseas instalar la aplicación?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('Usuario aceptó la instalación');
          } else {
            console.log('Usuario canceló la instalación');
          }
        });
      }
    });
  }

}
