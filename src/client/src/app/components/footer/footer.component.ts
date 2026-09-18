import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private session = inject(SessionService);

  faHeart = faHeart;
  faGithub = faGithub;

  /**
   * Il passaggio all'altra area, solo per chi e' sia responsabile sia genitore
   * o ragazzo. Prima "Dashboard admin" compariva a chiunque, genitori compresi,
   * e portava a una pagina che la guard rifiutava.
   */
  readonly switchLink = computed(() => {
    if (!this.session.hasBothAreas()) return null;
    return this.session.area() === 'admin'
      ? { url: '/user/dashboard', label: 'Dashboard utente' }
      : { url: '/admin/dashboard', label: 'Dashboard admin' };
  });
}
