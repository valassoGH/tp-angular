import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Cliente, ClientesService } from '../services/clientes.service';
import { Sucursal, SucursalesService } from '../services/sucursales.service';
import { EstadoFactura, Factura, FacturasService } from '../services/facturas.service';
import { mensajeError } from '../services/api';

@Component({
  selector: 'app-facturas',
  imports: [],
  templateUrl: './facturas.html',
  styleUrl: './facturas.css'
})
export class Facturas implements OnInit {
  private svc = inject(FacturasService);
  private clientesSvc = inject(ClientesService);
  private sucSvc = inject(SucursalesService);

  readonly estados: EstadoFactura[] = ['Pendiente', 'Pagado', 'Atrasado'];

  filas = signal<Factura[]>([]);
  total = signal(0);
  suma = signal(0);
  pagina = signal(1);
  porPagina = signal(15);
  cargando = signal(true);
  error = signal('');
  aviso = signal('');

  // filtros
  fEstado = signal('');
  fSucursal = signal('');
  fBuscar = signal('');
  private temporizador: ReturnType<typeof setTimeout> | null = null;

  sucursales = signal<Sucursal[]>([]);
  clientes = signal<Cliente[]>([]);
  sucursalesActivas = computed(() => this.sucursales().filter(s => s.activo === 1));

  // formulario de alta
  formAbierto = signal(false);
  nCliente = signal('');
  nSucursal = signal('');
  nImporte = signal('');
  nFecha = signal(new Date().toISOString().slice(0, 10));
  errorForm = signal('');
  guardando = signal(false);

  paginas = computed(() => Math.max(1, Math.ceil(this.total() / this.porPagina())));
  ivaPrevio = computed(() => Math.round((parseFloat(this.nImporte()) || 0) * 21) / 100);

  ngOnInit(): void {
    this.sucSvc.getSucursales().subscribe(s => this.sucursales.set(s));
    this.clientesSvc.getClientes().subscribe(c => this.clientes.set(c));
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.svc.getFacturas({
      pagina: this.pagina(), estado: this.fEstado(), sucursal: this.fSucursal(), buscar: this.fBuscar()
    }).subscribe({
      next: r => {
        this.filas.set(r.filas); this.total.set(r.total); this.suma.set(r.suma);
        this.porPagina.set(r.porPagina); this.cargando.set(false); this.error.set('');
      },
      error: err => { this.error.set(mensajeError(err, 'No se pudieron cargar las facturas.')); this.cargando.set(false); }
    });
  }

  filtrar(campo: 'fEstado' | 'fSucursal', e: Event) {
    this[campo].set((e.target as HTMLSelectElement).value);
    this.pagina.set(1);
    this.cargar();
  }

  buscar(e: Event) {
    this.fBuscar.set((e.target as HTMLInputElement).value);
    if (this.temporizador) clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => { this.pagina.set(1); this.cargar(); }, 350);
  }

  irA(p: number) {
    if (p < 1 || p > this.paginas()) return;
    this.pagina.set(p);
    this.cargar();
  }

  cambiarEstado(f: Factura, e: Event) {
    const estado = (e.target as HTMLSelectElement).value as EstadoFactura;
    this.svc.cambiarEstado(f.NroFactura, estado).subscribe({
      next: () => { this.aviso.set(`Factura ${f.NroFactura} marcada como ${estado}.`); this.cargar(); },
      error: err => { this.error.set(mensajeError(err, 'No se pudo cambiar el estado.')); this.cargar(); }
    });
  }

  campo(c: 'nCliente' | 'nSucursal' | 'nImporte' | 'nFecha', e: Event) {
    this[c].set((e.target as HTMLInputElement | HTMLSelectElement).value);
  }

  guardar(e: Event) {
    e.preventDefault();
    const importe = parseFloat(this.nImporte());
    if (!this.nCliente() || !this.nSucursal() || !(importe > 0)) {
      this.errorForm.set('Elegí cliente, sucursal e ingresá un importe mayor a cero.');
      return;
    }
    this.guardando.set(true);
    this.errorForm.set('');
    this.svc.crear({
      idCliente: +this.nCliente(), idSucursal: +this.nSucursal(), importe, fecha: this.nFecha()
    }).subscribe({
      next: r => {
        this.guardando.set(false);
        this.aviso.set(`Factura ${r.nroFactura} creada (IVA 21 % incluido).`);
        this.nImporte.set(''); this.nCliente.set(''); this.nSucursal.set('');
        this.formAbierto.set(false);
        this.pagina.set(1);
        this.cargar();
      },
      error: err => { this.guardando.set(false); this.errorForm.set(mensajeError(err, 'No se pudo guardar la factura.')); }
    });
  }

  fmt(n: number): string {
    return n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
