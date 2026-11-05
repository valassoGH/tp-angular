import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';

export interface UsuarioFila {
  idUsuario: number;
  usuario: string;
  categoria: string;
  nivel: number;
  activo: number;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private http = inject(HttpClient);

  getUsuarios() {
    return this.http.get<UsuarioFila[]>(`${API_URL}/usuarios.php`);
  }
  crear(u: { usuario: string; clave: string; nivel: number }) {
    return this.http.post(`${API_URL}/usuario_alta.php`, u);
  }
  cambiarEstado(idUsuario: number, activo: boolean) {
    return this.http.post(`${API_URL}/usuario_estado.php`, { idUsuario, activo });
  }
}
