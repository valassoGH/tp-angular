import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Sucursal, SucursalesService } from '../services/sucursales.service';
import { VentaMes, VentasService } from '../services/ventas.service';

const COLORES = ['#0f766e', '#f59e0b', '#6366f1', '#ef4444', '#0ea5e9', '#84cc16', '#ec4899'];
const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const ANCHO = 600;
const ALTO = 300;

@Component({
  selector: 'app-ventas',
  imports: [],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class Ventas implements OnInit {
  private ventasSvc = inject(VentasService);
  private sucSvc = inject(SucursalesService);

  readonly anio = 2025;
  readonly meses = MESES;

  sucursales = signal<Sucursal[]>([]);
  ventas = signal<VentaMes[]>([]);
  cargando = signal(true);
  error = signal('');

  // Matriz [mes][sucursal] con el total facturado
  matriz = computed(() =>
    MESES.map((nombre, i) => ({
      nombre,
      valores: this.sucursales().map(s =>
        this.ventas().find(v => v.mes === i + 1 && v.idSucursal === s.idSucursal)?.total ?? 0
      ),
    }))
  );

  totales = computed(() =>
    this.sucursales().map((_, c) => this.matriz().reduce((acc, f) => acc + f.valores[c], 0))
  );

  leyenda = computed(() =>
    this.sucursales().map((s, i) => ({ nombre: s.nombre, color: COLORES[i % COLORES.length] }))
  );

  lineas = computed(() => {
    const filas = this.matriz();
    const max = Math.max(1, ...filas.flatMap(f => f.valores));
    return this.sucursales().map((s, c) => ({
      color: COLORES[c % COLORES.length],
      puntos: filas
        .map((f, i) => `${(i / (filas.length - 1)) * ANCHO},${ALTO - 20 - (f.valores[c] / max) * (ALTO - 40)}`)
        .join(' '),
    }));
  });

  barras = computed(() => {
    const filas = this.matriz();
    const maxTotal = Math.max(1, ...filas.map(f => f.valores.reduce((a, b) => a + b, 0)));
    const grupo = ANCHO / filas.length;
    return filas.map((f, i) => {
      let acumulado = 0;
      const segmentos = f.valores.map((v, c) => {
        const h = (v / maxTotal) * (ALTO - 40);
        const y = ALTO - 20 - acumulado - h;
        acumulado += h;
        return { x: i * grupo, y, w: grupo - 4, h, color: COLORES[c % COLORES.length] };
      });
      return { etiquetaX: i * grupo + grupo / 2, nombre: f.nombre, segmentos };
    });
  });

  ngOnInit(): void {
    forkJoin({
      sucursales: this.sucSvc.getSucursales(),
      ventas: this.ventasSvc.getVentas(this.anio),
    }).subscribe({
      next: ({ sucursales, ventas }) => {
        this.sucursales.set(sucursales);
        this.ventas.set(ventas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las ventas. ¿Está Apache encendido en XAMPP?');
        this.cargando.set(false);
      },
    });
  }

  fmt(n: number): string {
    return n.toLocaleString('es-AR', { maximumFractionDigits: 0 });
  }
}
