import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  usuario = signal('');
  clave = signal('');
  error = signal('');
  enviando = signal(false);

  escribir(campo: 'usuario' | 'clave', e: Event) {
    this[campo].set((e.target as HTMLInputElement).value);
  }

  ingresar(e: Event) {
    e.preventDefault();
    if (!this.usuario() || !this.clave()) {
      this.error.set('Completá usuario y contraseña');
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    this.auth.login(this.usuario(), this.clave()).subscribe({
      next: () => { this.enviando.set(false); this.router.navigate(['/home']); },
      error: err => {
        this.enviando.set(false);
        this.error.set(err.status === 401
          ? 'Usuario o contraseña incorrectos'
          : 'No se pudo conectar con el servidor. ¿Está Apache encendido en XAMPP?');
      }
    });
  }
}
