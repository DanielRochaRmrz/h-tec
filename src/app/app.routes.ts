import { Routes } from '@angular/router';
import { HeaderNavComponent } from './shared/components/header-nav/header-nav.component';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes')
  },
  {
    path: '',
    component: HeaderNavComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'catalogos',
        loadChildren: () => import('./catalogos/catalogos.routes')
      },
      {
        path: 'censo',
        loadChildren: () => import('./censo/censo.routes')
      }
    ]
  }
];
