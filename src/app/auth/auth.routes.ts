import { Route } from "@angular/router";

export default [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent)
  },
] satisfies Route[];
