import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from './api';

export type EstadoFactura = 'Pendiente' | 'Pagado' | 'Atrasado';

export interface Factura {
  NroFactura: number;
  FechaFactura: string;
  cliente: string;
  sucursal: string;
  Importe: number;
  IVA: number;
  total: number;
  Estado: EstadoFactura;
}

export interface PaginaFacturas {
  total: number;
  suma: number;
  pagina: number;
  porPagina: number;
  filas: Factura[];
}

export interface FiltroFacturas {
  pagina: number;
  estado: string;
  sucursal: string;
  buscar: string;
}

@Injectable({ providedIn: 'root' })
export class FacturasService {
  private http = inject(HttpClient);

  getFacturas(f: FiltroFacturas) {
    let params = new HttpParams().set('pagina', f.pagina);
    if (f.estado) params = params.set('estado', f.estado);
    if (f.sucursal) params = params.set('sucursal', f.sucursal);
    if (f.buscar) params = params.set('buscar', f.buscar);
    return this.http.get<PaginaFacturas>(`${API_URL}/facturas.php`, { params });
  }
  crear(f: { idCliente: number; idSucursal: number; importe: number; fecha: string }) {
    return this.http.post<{ ok: boolean; nroFactura: number }>(`${API_URL}/factura_alta.php`, f);
  }
  cambiarEstado(nroFactura: number, estado: EstadoFactura) {
    return this.http.post(`${API_URL}/factura_estado.php`, { nroFactura, estado });
  }
}
