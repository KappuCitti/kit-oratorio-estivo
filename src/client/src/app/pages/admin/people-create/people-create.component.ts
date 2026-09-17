import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../../../models/Person.model';
import {
  FamilyCreateRequest,
  FamilyPersonRequest,
} from '../../../../models/Request.model';
import { ApiService } from '../../../../services/api.service';
import { UtilsService } from '../../../../services/utils.service';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

/**
 * Creazione di un nucleo familiare: chi gestisce e chi viene gestito.
 *
 * Il form e' scritto qui invece di riusare `app-parent` e `app-child` perche'
 * quei componenti raccolgono i campi dello schema v1 (`phoneNumber`, nessun
 * codice fiscale, nessuna password, nessun ruolo), mentre il server pretende
 * `cf`, `password` e `roleId` per ogni persona: il codice fiscale e' la chiave
 * primaria dell'utente e la password gli serve per accedere.
 *
 * Il server crea tutto in una transazione e collega ogni gestore a ogni
 * gestito, quindi o riesce tutto o non viene creato nulla.
 */
@Component({
  selector: 'app-people-create',
  imports: [
    FooterComponent,
    NavbarComponent,
    ReactiveFormsModule,
    FaIconComponent,
  ],
  templateUrl: './people-create.component.html',
})
export class PeopleCreateComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private utils = inject(UtilsService);
  private fb = inject(FormBuilder);

  faPlus = faPlus;
  faTrash = faTrash;

  readonly roles = signal<Role[]>([]);
  readonly error = signal<string | null>(null);
  readonly saving = signal(false);

  familyForm: FormGroup;

  /**
   * I ruoli proposti per i due gruppi.
   *
   * Il server non impone quale ruolo stia da che parte: il legame `manages` e'
   * quello che conta. La distinzione qui e' solo un aiuto alla compilazione, e
   * ogni tendina resta libera.
   */
  readonly managerRoles = computed(() =>
    this.roles().filter((role) => role.name !== 'child')
  );

  constructor() {
    this.familyForm = this.fb.group({
      managers: this.fb.array([this.createPersonGroup()]),
      managed: this.fb.array([this.createPersonGroup()]),
    });
  }

  ngOnInit() {
    this.api.getRoles().subscribe({
      next: (response) => {
        if (response.body?.success) this.roles.set(response.body.data);
      },
      error: (error) => console.error(error),
    });
  }

  get managers(): FormArray {
    return this.familyForm.get('managers') as FormArray;
  }

  get managed(): FormArray {
    return this.familyForm.get('managed') as FormArray;
  }

  private createPersonGroup(): FormGroup {
    return this.fb.group({
      // Il codice fiscale e' esattamente 16 caratteri: e' l'id dell'utente.
      cf: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      surname: ['', [Validators.required, Validators.maxLength(255)]],
      gender: ['M', [Validators.required]],
      roleId: [null, [Validators.required]],
      email: ['', [Validators.email]],
      phone: [''],
      birthDate: [''],
      birthPlace: [''],
    });
  }

  addManager() {
    this.managers.push(this.createPersonGroup());
  }

  removeManager(index: number) {
    // I gestori possono essere zero: e' il caso di un maggiorenne che si
    // iscrive da solo. I gestiti no, il server ne pretende almeno uno.
    this.managers.removeAt(index);
  }

  addManaged() {
    this.managed.push(this.createPersonGroup());
  }

  removeManaged(index: number) {
    if (this.managed.length > 1) this.managed.removeAt(index);
  }

  private toRequest(value: Record<string, any>): FamilyPersonRequest {
    return {
      cf: (value['cf'] as string).toUpperCase(),
      password: value['password'],
      name: value['name'],
      surname: value['surname'],
      gender: value['gender'],
      roleId: Number(value['roleId']),
      // I campi facoltativi lasciati vuoti vanno inviati come null: la stringa
      // vuota non passerebbe i controlli del server (email, min(1)).
      email: value['email'] || null,
      phone: value['phone'] || null,
      birthDate: value['birthDate'] || null,
      birthPlace: value['birthPlace'] || null,
    };
  }

  createFamily() {
    if (this.familyForm.invalid || this.saving()) return;

    const richiesta: FamilyCreateRequest = {
      managers: this.managers.value.map((v: Record<string, any>) =>
        this.toRequest(v)
      ),
      managed: this.managed.value.map((v: Record<string, any>) =>
        this.toRequest(v)
      ),
    };

    this.saving.set(true);
    this.error.set(null);

    this.api.createFamily(richiesta).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigateByUrl('/admin/people');
      },
      error: (error) => {
        console.error(error);
        this.saving.set(false);
        // Il server rifiuta con 409 i codici fiscali o le email gia' presenti,
        // sia fra loro sia rispetto al database: il messaggio va mostrato.
        this.error.set(this.utils.handleResponse(error, null));
      },
    });
  }
}
