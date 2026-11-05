// Dirección base de los PHP en XAMPP (carpeta htdocs/api)
export const API_URL = 'http://localhost/api';

// Saca el mensaje que mandó el PHP ({ error: "..." }) o usa uno por defecto
export function mensajeError(err: any, porDefecto: string): string {
  if (err?.status === 0) return 'No se pudo conectar con el servidor. ¿Está Apache encendido en XAMPP?';
  return err?.error?.error ?? porDefecto;
}
