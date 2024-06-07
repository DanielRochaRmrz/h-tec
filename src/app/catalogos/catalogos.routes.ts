import { Route } from "@angular/router";

export default [
  {
    path: 'clientes',
    loadComponent: () => import('./pages/clientes/clientes.component').then(m => m.ClientesComponent)
  },
  {
    path: 'productos',
    loadComponent: () => import('./pages/productos/productos.component').then(m => m.ProductosComponent)
  },
  {
    path: 'tecnicos',
    loadComponent: () => import('./pages/tecnicos/tecnicos.component').then(m => m.TecnicosComponent)
  }
] satisfies Route[];
