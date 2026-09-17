import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  FaIconComponent,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import {
  faArrowRotateLeft,
  faChild,
  faChildDress,
  faPen,
  faPerson,
  faPersonDress,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { PersonListItem } from '../../../../models/Person.model';
import { PeopleGetRequest } from '../../../../models/Request.model';
import { ApiService } from '../../../../services/api.service';
import { UtilsService } from '../../../../services/utils.service';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

/**
 * La rubrica: cerca, apre e cancella le persone registrate.
 *
 * Usa GET /admin/people, che accetta ricerca, filtro per sesso e per ruolo, e
 * paginazione. Prima chiamava /people, /childs e /parents, che sul server non
 * sono mai esistiti: la pagina si apriva sempre vuota.
 */
@Component({
  selector: 'app-people-search',
  imports: [
    FooterComponent,
    NavbarComponent,
    FaIconComponent,
    ReactiveFormsModule,
    RouterLink,
    PaginationComponent,
  ],
  templateUrl: './people-search.component.html',
})
export class PeopleSearchComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private utils = inject(UtilsService);

  searchForm: FormGroup;

  readonly people = signal<PersonListItem[]>([]);

  readonly peopleToDelete = signal<PersonListItem | null>(null);
  readonly isDeleteModalOpen = signal(false);
  readonly errorDelete = signal<string | null>(null);

  readonly elements = signal(0);
  page: number = 1;
  size: number = 25;

  faArrowRotateLeft = faArrowRotateLeft;
  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;
  faPerson = faPerson;
  faPersonDress = faPersonDress;
  faChild = faChild;
  faChildDress = faChildDress;

  constructor() {
    this.searchForm = this.fb.group({
      query: ['', [Validators.minLength(2), Validators.maxLength(100)]],
      gender: [''],
    });

    this.searchForm.valueChanges.subscribe(() => {
      if (this.searchForm.valid) this.loadPeople();
    });
  }

  ngOnInit() {
    this.loadPeople();
  }

  onResetSearch() {
    this.searchForm.reset({ query: '', gender: '' });
  }

  loadPeople() {
    const params: PeopleGetRequest = {
      page: this.page,
      size: this.size,
    };

    const query = this.searchForm.get('query')?.value;
    if (query) params.query = query;

    // Il server accetta solo 'M' o 'F': il valore vuoto della select significa
    // "nessun filtro" e non va inviato.
    const gender = this.searchForm.get('gender')?.value;
    if (gender === 'M' || gender === 'F') params.gender = gender;

    this.api.getPeople(params).subscribe({
      next: (response) => {
        if (response.body?.success) {
          this.people.set(response.body.data.elements);
          this.elements.set(response.body.data.count);
        }
      },
      error: (error) => console.error(error),
    });
  }

  /** Il ruolo mostrato e' quello che dice il server, non piu' dedotto. */
  getPersonType(person: PersonListItem): string {
    return person.role.displayName;
  }

  getPersonIcon(person: PersonListItem): IconDefinition {
    const isChild = person.role.name === 'child';
    if (isChild) return person.gender === 'M' ? faChild : faChildDress;
    return person.gender === 'M' ? faPerson : faPersonDress;
  }

  openDeleteModal(p: PersonListItem) {
    this.peopleToDelete.set(p);
    this.isDeleteModalOpen.set(true);
    this.errorDelete.set(null);
  }

  closeDeleteModal() {
    this.peopleToDelete.set(null);
    this.isDeleteModalOpen.set(false);
  }

  deletePerson() {
    const persona = this.peopleToDelete();
    if (!persona) return;

    this.api.deletePerson(persona.id).subscribe({
      next: () => {
        this.loadPeople();
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error(error);
        // Il server rifiuta con 409 chi e' l'unico a gestire un minore: il
        // messaggio va mostrato, altrimenti la modale resta li' senza spiegare.
        this.errorDelete.set(this.utils.handleResponse(error, null));
      },
    });
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadPeople();
  }

  onSizeChange(size: number) {
    this.size = size;
    this.loadPeople();
  }
}
