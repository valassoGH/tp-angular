import { RenderMode, ServerRoute } from '@angular/ssr';

// Las pantallas dependen del login y de datos de la API (XAMPP),
// por eso se renderizan solo en el navegador.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
