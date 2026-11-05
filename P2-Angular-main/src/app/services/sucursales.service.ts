import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';

export interface Sucursal {
  idSucursal: number;
  nombre: string;
  ciudad: string;
  direccion: string;
  cantempleado: number;
  activo: number;
}

@Injectable({ providedIn: 'root' })
export class SucursalesService {
  private http = inject(HttpClient);

  getSucursales() {
    return this.http.get<Sucursal[]>(`${API_URL}/sucursales.php`);
  }
  crear(s: { nombre: string; ciudad: string; direccion: string; cantempleado: number }) {
    return this.http.post(`${API_URL}/sucursal_alta.php`, s);
  }
  cambiarEstado(idSucursal: number, activo: boolean) {
    return this.http.post(`${API_URL}/sucursal_estado.php`, { idSucursal, activo });
  }
}
