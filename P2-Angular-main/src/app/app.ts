import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Footer } from './footer/footer';
import { Reloj } from './reloj/reloj';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Footer, Reloj],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Sistema de Facturación');
  protected auth = inject(AuthService);

  // Cada opción se muestra si el nivel del usuario es >= nivelMin
  private readonly opciones = [
    { etiqueta: 'Home', ruta: '/home', nivelMin: 0 },
    { etiqueta: 'Clientes', ruta: '/clientes', nivelMin: 1 },
    { etiqueta: 'Sucursales', ruta: '/sucursales', nivelMin: 1 },
    { etiqueta: 'Ventas', ruta: '/ventas', nivelMin: 1 },
    { etiqueta: 'Facturas', ruta: '/facturas', nivelMin: 1 },
    { etiqueta: 'Usuarios', ruta: '/usuarios', nivelMin: 2 },
  ];

  protected menu = computed(() => this.opciones.filter(o => this.auth.nivel() >= o.nivelMin));
}
