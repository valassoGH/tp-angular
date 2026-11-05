import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Ventas } from './ventas/ventas';
import { Sucursales } from './sucursales/sucursales';
import { Clientes } from './clientes/clientes';
import { Facturas } from './facturas/facturas';
import { Usuarios } from './usuarios/usuarios';
import { Login } from './login/login';
import { nivelMinimo } from './guards/auth.guard';

// nivel 1 = Empleado, 2 = Administrador
export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'clientes', component: Clientes, canActivate: [nivelMinimo(1)] },
  { path: 'sucursales', component: Sucursales, canActivate: [nivelMinimo(1)] },
  { path: 'ventas', component: Ventas, canActivate: [nivelMinimo(1)] },
  { path: 'facturas', component: Facturas, canActivate: [nivelMinimo(1)] },
  { path: 'usuarios', component: Usuarios, canActivate: [nivelMinimo(2)] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
