import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-header-nav',
  standalone: true,
  imports: [RouterModule, RouterOutlet, MatCardModule, MatButtonModule, MatIconModule, MatSidenavModule, MatToolbarModule],
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.scss'
})
export class HeaderNavComponent {
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
    this._authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
