import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';

export interface Cliente {
  idCliente: number;
  apellido: string;
  nombre: string;
  situacionFiscal: string;
  dni: number;
}

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private http = inject(HttpClient);
  getClientes() {
    return this.http.get<Cliente[]>(`${API_URL}/clientes.php`);
  }
}
