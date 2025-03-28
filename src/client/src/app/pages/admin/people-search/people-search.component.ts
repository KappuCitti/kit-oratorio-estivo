import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
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
import { ApiService } from '../../../../services/api.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { PeopleSearch } from '../../../../models/Family.model';
import { PeopleGetRequest } from '../../../../models/Request.model';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-people-search',
  imports: [
    FooterComponent,
    NavbarComponent,
    FaIconComponent,
    ReactiveFormsModule,
    RouterLink,
    PaginationComponent,
    CommonModule,
  ],
  templateUrl: './people-search.component.html',
  styleUrl: './people-search.component.css',
})
export class PeopleSearchComponent implements OnInit {
  searchForm: FormGroup;

  people: PeopleSearch[] = [];

  peopleToDelete: PeopleSearch | null = null;
  isDeleteModalOpen: boolean = false;
  errorDelete: string | null = null;

  elements: number = 0;
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

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private utils: UtilsService
  ) {
    this.searchForm = this.fb.group({
      query: ['', [Validators.minLength(2), Validators.maxLength(100)]],
      gender: [''],
      type: [''],
    });

    this.searchForm.valueChanges.subscribe(() => {
      if (this.searchForm.valid) {
        this.loadPeople();
      }
    });
  }

  ngOnInit() {
    this.loadPeople();
  }

  onResetSearch() {
    this.searchForm.reset();
  }

  loadPeople() {
    let params: PeopleGetRequest = {
      page: this.page,
      size: this.size,
    };

    if (this.searchForm.get('query')?.value) {
      params.query = this.searchForm.get('query')?.value;
    }

    if (this.searchForm.get('gender')?.value) {
      params.gender = this.searchForm.get('gender')?.value;
    }

    switch (this.searchForm.get('type')?.value) {
      case 'Child':
        this.api.getChilds(params).subscribe((response) => {
          if (response.status == 200 && response.body?.data) {
            this.people = response.body.data.childs as PeopleSearch[];
            this.elements = response.body.data.count;
          }
        });
        break;
      case 'Parent':
        this.api.getParents(params).subscribe((response) => {
          if (response.status == 200 && response.body?.data) {
            this.people = response.body.data.parents as PeopleSearch[];
            this.elements = response.body.data.count;
          }
        });
        break;
      default:
        this.api.getPeople(params).subscribe((response) => {
          if (response.status == 200 && response.body?.data) {
            this.people = response.body.data.people as PeopleSearch[];
            this.elements = response.body.data.count;
            console.log(response.body.data.count);
          }
        });
    }
  }

  getPersonType(person: PeopleSearch): string {
    const type: string = this.searchForm.get('type')?.value;

    if (person.type == 'Parent' || type == 'Parent') {
      return 'Genitore';
    } else if (person.type == 'Child' || type == 'Child') {
      return person.gender == 'M' ? 'Ragazzo' : 'Ragazza';
    }
    return 'Persona';
  }

  getRawPersonType(person: PeopleSearch): string {
    const type: string = this.searchForm.get('type')?.value;

    if (person.type == 'Parent' || type == 'Parent') {
      return 'Parent';
    } else if (person.type == 'Child' || type == 'Child') {
      return 'Child';
    }
    return type;
  }

  getPersonIcon(person: PeopleSearch): IconDefinition {
    const type: string = this.searchForm.get('type')?.value;

    if (person.type == 'Parent' || type == 'Parent') {
      return person.gender == 'M' ? faPerson : faPersonDress;
    } else if (person.type == 'Child' || type == 'Child') {
      return person.gender == 'M' ? faChild : faChildDress;
    }
    return faPerson;
  }

  openDeleteModal(p: PeopleSearch) {
    this.peopleToDelete = p;
    this.isDeleteModalOpen = true;

    this.errorDelete = null;
  }

  closeDeleteModal() {
    this.peopleToDelete = null;
    this.isDeleteModalOpen = false;
  }

  deletePerson() {
    const type = this.searchForm.get('type')?.value;

    if (!this.peopleToDelete) return;
    if (this.peopleToDelete.type == 'Parent' || type == 'Parent') {
      this.api.deleteParent(this.peopleToDelete.id).subscribe({
        next: (response) => {
          if (response.status == 200) {
            this.loadPeople();
            this.closeDeleteModal();
          }
        },
        error: (error) => {
          this.errorDelete = this.utils.handleResponse(error, null);
        },
      });
    } else if (this.peopleToDelete.type == 'Child' || type == 'Child') {
      this.api.deleteChild(this.peopleToDelete.id).subscribe({
        next: (response) => {
          if (response.status == 200) {
            this.loadPeople();
            this.closeDeleteModal();
          }
        },
        error: (error) => {
          this.errorDelete = this.utils.handleResponse(error, null);
        },
      });
    } else {
      this.errorDelete = 'Ruolo non trovato';
    }
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
