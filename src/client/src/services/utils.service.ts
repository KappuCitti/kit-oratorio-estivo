import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
