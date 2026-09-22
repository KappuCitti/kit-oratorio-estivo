import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs/operators';
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
  private router = inject(Router);

  faHeart = faHeart;
  faGithub = faGithub;

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  /**
   * Il collegamento all'altra meta' del sito, per chi ha pagine da
   * responsabile: porta a quella dove non si trova in questo momento.
   *
   * Prima era un "Dashboard admin" fisso, mostrato a chiunque: un genitore lo
   * vedeva e ci finiva contro, perche' quelle pagine non sono sue.
   */
  readonly switchLink = computed(() => {
    if (!this.session.has('see_users')) return null;
    return this.url().startsWith('/admin')
      ? { url: '/user/dashboard', label: 'Dashboard utente' }
      : { url: '/admin/dashboard', label: 'Dashboard admin' };
  });
}
