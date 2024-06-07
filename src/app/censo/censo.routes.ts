import { Route } from "@angular/router";

export default [
  {
    path: 'censo',
    loadComponent: () => import('./pages/censos/censos.component').then(m => m.CensosComponent)
  },
] satisfies Route[];
