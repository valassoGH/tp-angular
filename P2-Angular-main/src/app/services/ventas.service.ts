import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';

export interface VentaMes {
  mes: number;
  idSucursal: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class VentasService {
  private http = inject(HttpClient);
  getVentas(anio = 2025) {
    return this.http.get<VentaMes[]>(`${API_URL}/ventas.php?anio=${anio}`);
  }
}
