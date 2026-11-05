import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Sucursal, SucursalesService } from '../services/sucursales.service';
import { AuthService } from '../services/auth.service';
import { mensajeError } from '../services/api';

@Component({
  selector: 'app-sucursales',
  imports: [],
  templateUrl: './sucursales.html',
  styleUrl: './sucursales.css'
})
export class Sucursales implements OnInit {
  private svc = inject(SucursalesService);
  private auth = inject(AuthService);

  todas = signal<Sucursal[]>([]);
  cargando = signal(true);
  error = signal('');
  aviso = signal('');

  esAdmin = computed(() => this.auth.nivel() >= 2);
  // El empleado solo ve las sucursales activas; el administrador ve también las dadas de baja
  suc = computed(() => this.esAdmin() ? this.todas() : this.todas().filter(s => s.activo === 1));

  formAbierto = signal(false);
  nNombre = signal('');
  nCiudad = signal('');
  nDireccion = signal('');
  nEmpleados = signal('0');
  errorForm = signal('');
  guardando = signal(false);

  ngOnInit(): void { this.cargar(); }

  cargar() {
    this.svc.getSucursales().subscribe({
      next: datos => { this.todas.set(datos); this.cargando.set(false); this.error.set(''); },
      error: err => { this.error.set(mensajeError(err, 'No se pudieron cargar las sucursales.')); this.cargando.set(false); }
    });
  }

  campo(c: 'nNombre' | 'nCiudad' | 'nDireccion' | 'nEmpleados', e: Event) {
    this[c].set((e.target as HTMLInputElement).value);
  }

  crear(e: Event) {
    e.preventDefault();
    this.guardando.set(true);
    this.errorForm.set('');
    this.svc.crear({
      nombre: this.nNombre().trim(), ciudad: this.nCiudad().trim(),
      direccion: this.nDireccion().trim(), cantempleado: parseInt(this.nEmpleados(), 10) || 0
    }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.aviso.set(`Sucursal "${this.nNombre().trim()}" creada.`);
        this.nNombre.set(''); this.nCiudad.set(''); this.nDireccion.set(''); this.nEmpleados.set('0');
        this.formAbierto.set(false);
        this.cargar();
      },
      error: err => { this.guardando.set(false); this.errorForm.set(mensajeError(err, 'No se pudo crear la sucursal.')); }
    });
  }

  cambiarEstado(s: Sucursal, activo: boolean) {
    this.svc.cambiarEstado(s.idSucursal, activo).subscribe({
      next: () => { this.aviso.set(`Sucursal "${s.nombre}" ${activo ? 'reactivada' : 'dada de baja'}.`); this.cargar(); },
      error: err => this.error.set(mensajeError(err, 'No se pudo cambiar el estado de la sucursal.'))
    });
  }
}
