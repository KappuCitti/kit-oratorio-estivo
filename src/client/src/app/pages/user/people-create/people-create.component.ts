import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ManagedPersonCreateRequest } from '../../../../models/Request.model';
import { ApiService } from '../../../../services/api.service';
import { UtilsService } from '../../../../services/utils.service';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

/**
 * Il genitore aggiunge un ragazzo al proprio nucleo.
 *
 * Prima la pagina conteneva soltanto uno switch "Ragazzo / Genitore" copiato
 * da un selettore di tema, senza alcun form. Ora raccoglie cio' che chiede
 * POST /users; il ruolo lo assegna il server, e il ragazzo viene collegato a
 * chi lo crea.
 */
@Component({
  selector: 'app-people-create',
  imports: [
    NavbarComponent,
    FooterComponent,
    ReactiveFormsModule,
    RouterLink,
    FaIconComponent,
  ],
  templateUrl: './people-create.component.html',
})
export class PeopleCreateComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private utils = inject(UtilsService);
  private router = inject(Router);

  faArrowLeft = faArrowLeft;

  form: FormGroup;
  readonly error = signal<string | null>(null);
  readonly saving = signal(false);

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      cf: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ],
      gender: ['M', [Validators.required]],
      birthDate: ['', [Validators.required]],
      birthPlace: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      street: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.minLength(2)]],
      country: ['Italia', [Validators.required, Validators.minLength(2)]],
    });
  }

  save() {
    if (this.form.invalid || this.saving()) return;

    const v = this.form.value;
    const persona: ManagedPersonCreateRequest = {
      cf: (v.cf as string).toUpperCase(),
      password: v.password,
      name: v.name,
      surname: v.surname,
      gender: v.gender,
      birthDate: v.birthDate,
      birthPlace: v.birthPlace,
      address: {
        street: v.street,
        city: v.city,
        postalCode: v.postalCode,
        country: v.country,
      },
    };
    if (v.email) persona.email = v.email;

    this.saving.set(true);
    this.error.set(null);

    this.api.addManagedPerson(persona).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigateByUrl('/user/people');
      },
      error: (error) => {
        console.error(error);
        this.saving.set(false);
        this.error.set(this.utils.handleResponse(error, null));
      },
    });
  }
}
