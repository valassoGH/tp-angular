import { Component, OnInit, inject, signal } from '@angular/core';
import { UsuarioFila, UsuariosService } from '../services/usuarios.service';
import { AuthService } from '../services/auth.service';
import { mensajeError } from '../services/api';

@Component({
  selector: 'app-usuarios',
  imports: [],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {
  private svc = inject(UsuariosService);
  protected auth = inject(AuthService);

  lista = signal<UsuarioFila[]>([]);
  cargando = signal(true);
  error = signal('');
  aviso = signal('');

  formAbierto = signal(false);
  nUsuario = signal('');
  nClave = signal('');
  nNivel = signal('1');
  errorForm = signal('');
  guardando = signal(false);

  ngOnInit(): void { this.cargar(); }

  cargar() {
    this.svc.getUsuarios().subscribe({
      next: u => { this.lista.set(u); this.cargando.set(false); this.error.set(''); },
      error: err => { this.error.set(mensajeError(err, 'No se pudieron cargar los usuarios.')); this.cargando.set(false); }
    });
  }

  campo(c: 'nUsuario' | 'nClave' | 'nNivel', e: Event) {
    this[c].set((e.target as HTMLInputElement | HTMLSelectElement).value);
  }

  esYo(u: UsuarioFila) { return u.idUsuario === this.auth.usuario()?.idUsuario; }

  crear(e: Event) {
    e.preventDefault();
    this.guardando.set(true);
    this.errorForm.set('');
    this.svc.crear({ usuario: this.nUsuario().trim(), clave: this.nClave(), nivel: +this.nNivel() }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.aviso.set(`Usuario "${this.nUsuario().trim()}" creado.`);
        this.nUsuario.set(''); this.nClave.set(''); this.nNivel.set('1');
        this.formAbierto.set(false);
        this.cargar();
      },
      error: err => { this.guardando.set(false); this.errorForm.set(mensajeError(err, 'No se pudo crear el usuario.')); }
    });
  }

  cambiarEstado(u: UsuarioFila, activo: boolean) {
    this.svc.cambiarEstado(u.idUsuario, activo).subscribe({
      next: () => { this.aviso.set(`Usuario "${u.usuario}" ${activo ? 'dado de alta' : 'dado de baja'}.`); this.cargar(); },
      error: err => this.error.set(mensajeError(err, 'No se pudo cambiar el estado del usuario.'))
    });
  }
}
