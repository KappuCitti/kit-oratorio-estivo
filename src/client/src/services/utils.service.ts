import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '../models/User.model';

/**
 * Formatta una data come YYYY-MM-DD **nel fuso locale**, che e' il formato
 * preteso dal server (z.string().date()).
 *
 * Non si usa toISOString(): quello converte prima in UTC, quindi in Italia una
 * data locale fra mezzanotte e le 01:00/02:00 diventa il giorno precedente. Per
 * le presenze "di oggi" significherebbe mostrare il giorno sbagliato.
 */
export function toDateOnly(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  handleResponse(
    response: HttpResponse<any>,
    success: string | null
  ): string | null {
    switch (response.status) {
      case 200:
        if (success) window.location.href = success;
        return null;

      case 400:
        return 'Richiesta non valida!';

      case 401:
        return 'Username o password errati!';

      case 403:
        return 'Non hai i permessi necessari!';

      case 404:
        return 'Elemento non trovato!';

      case 409:
        return 'Conflitto nella richiesta!';

      case 422:
        return 'Il server non riesce a processare questa richiesta!';

      case 500:
      default:
        return 'Si è verificato un errore, riprova più tardi!';
    }
  }

  getDate(date: string) {
    return new Date(date).toLocaleDateString();
  }
}
