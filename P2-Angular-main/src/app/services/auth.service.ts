import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from './api';

export interface Usuario {
  idUsuario: number;
  usuario: string;
  categoria: string;
  nivel: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  usuario = signal<Usuario | null>(this.leerSesion());
  nivel = computed(() => this.usuario()?.nivel ?? 0);
  logueado = computed(() => this.usuario() !== null);

  login(usuario: string, clave: string) {
    return this.http
      .post<{ ok: boolean; usuario: Usuario }>(`${API_URL}/login.php`, { usuario, clave })
      .pipe(tap(r => {
        this.usuario.set(r.usuario);
        this.guardarSesion(r.usuario);
      }));
  }

  logout() {
    this.http.post(`${API_URL}/logout.php`, {}).subscribe({ complete: () => {}, error: () => {} });
    this.cerrarLocal();
  }

  // Limpia la sesión del navegador (también se usa cuando el servidor informa que la sesión venció)
  cerrarLocal() {
    this.usuario.set(null);
    this.guardarSesion(null);
    this.router.navigate(['/login']);
  }

  // sessionStorage solo existe en el navegador
  private leerSesion(): Usuario | null {
    if (typeof sessionStorage === 'undefined') return null;
    try {
      return JSON.parse(sessionStorage.getItem('usuario') ?? 'null');
    } catch {
      return null;
    }
  }

  private guardarSesion(u: Usuario | null) {
    if (typeof sessionStorage === 'undefined') return;
    if (u) sessionStorage.setItem('usuario', JSON.stringify(u));
    else sessionStorage.removeItem('usuario');
  }
}
