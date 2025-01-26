import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-root',
    imports: [RouterModule, RouterOutlet, MatCardModule, MatButtonModule, MatIconModule, MatSidenavModule, MatToolbarModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  private router = inject(Router);
  public title = '';
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
}
