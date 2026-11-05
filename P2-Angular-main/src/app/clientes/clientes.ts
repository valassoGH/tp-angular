import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Cliente, ClientesService } from '../services/clientes.service';

@Component({
  selector: 'app-clientes',
  imports: [],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {
  private svc = inject(ClientesService);

  clientes = signal<Cliente[]>([]);
  cargando = signal(true);
  error = signal('');
  filtro = signal('');

  visibles = computed(() => {
    const f = this.filtro().toLowerCase().trim();
    return this.clientes().filter(c =>
      `${c.apellido} ${c.nombre} ${c.dni}`.toLowerCase().includes(f));
  });

  ngOnInit(): void {
    this.svc.getClientes().subscribe({
      next: datos => { this.clientes.set(datos); this.cargando.set(false); },
      error: () => { this.error.set('No se pudieron cargar los clientes. ¿Está Apache encendido en XAMPP?'); this.cargando.set(false); }
    });
  }

  buscar(e: Event) {
    this.filtro.set((e.target as HTMLInputElement).value);
  }
}
