import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { PersonDetail, Role } from '../../../../models/Person.model';
import { PersonUpdateRequest } from '../../../../models/Request.model';
import { ApiService } from '../../../../services/api.service';
import { UtilsService } from '../../../../services/utils.service';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

/**
 * Modifica di una persona della rubrica.
 *
 * Prima la pagina si sdoppiava in "genitore" e "ragazzo" e chiamava
 * /parents/{id} e /childs/{id}, che sul server non sono mai esistiti: non
 * caricava nulla. Il server ha un'unica persona con un ruolo, quindi la pagina
 * e' una sola e il ruolo e' un campo come gli altri.
 */
@Component({
  selector: 'app-people-edit',
  imports: [
    FooterComponent,
    NavbarComponent,
    ReactiveFormsModule,
    FaIconComponent,
    RouterLink,
  ],
  templateUrl: './people-edit.component.html',
})
export class PeopleEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private utils = inject(UtilsService);
  private fb = inject(FormBuilder);

  faFloppyDisk = faFloppyDisk;

  private id: string | null = null;

  readonly person = signal<PersonDetail | null>(null);
  readonly roles = signal<Role[]>([]);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly saved = signal(false);

  personForm: FormGroup;

  constructor() {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      surname: ['', [Validators.required, Validators.maxLength(255)]],
      gender: ['', [Validators.required]],
      birthDate: [''],
      birthPlace: [''],
      email: ['', [Validators.email]],
      phone: [''],
      roleId: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.api.getRoles().subscribe({
      next: (response) => {
        if (response.body?.success) this.roles.set(response.body.data);
      },
      error: (error) => console.error(error),
    });

    this.route.paramMap.subscribe((params) => {
      // L'identificativo di una persona e' il codice fiscale: una stringa, non
      // un numero. Prima veniva passato a parseInt e diventava NaN.
      this.id = params.get('id');
      if (!this.id) {
        this.router.navigateByUrl('/admin/people');
        return;
      }
      this.loadPerson();
    });
  }

  private loadPerson() {
    if (!this.id) return;
    this.loading.set(true);

    this.api.getPerson(this.id).subscribe({
      next: (response) => {
        if (response.body?.success) {
          const persona = response.body.data;
          this.person.set(persona);

          this.personForm.patchValue({
            name: persona.name,
            surname: persona.surname,
            gender: persona.gender ?? '',
            birthDate: persona.birthDate ?? '',
            birthPlace: persona.birthPlace ?? '',
            email: persona.email ?? '',
            phone: persona.phone ?? '',
            roleId: persona.role.id,
          });
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.error.set(this.utils.handleResponse(error, null));
        this.loading.set(false);
      },
    });
  }

  save() {
    if (!this.id || this.personForm.invalid || this.saving()) return;

    const form = this.personForm.value;

    // Il server accetta tutti i campi come opzionali e aggiorna solo quelli che
    // arrivano; i campi di testo vuoti significano "nessun valore", quindi
    // vanno inviati come null e non come stringa vuota (che fallirebbe il
    // min(1) di Zod).
    const modifiche: PersonUpdateRequest = {
      name: form.name,
      surname: form.surname,
      gender: form.gender === 'M' || form.gender === 'F' ? form.gender : undefined,
      birthDate: form.birthDate || null,
      birthPlace: form.birthPlace || null,
      email: form.email || null,
      phone: form.phone || null,
      roleId: Number(form.roleId),
    };

    this.saving.set(true);
    this.error.set(null);
    this.saved.set(false);

    this.api.updatePerson(this.id, modifiche).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
        this.loadPerson();
      },
      error: (error) => {
        console.error(error);
        this.saving.set(false);
        this.error.set(this.utils.handleResponse(error, null));
      },
    });
  }
}
