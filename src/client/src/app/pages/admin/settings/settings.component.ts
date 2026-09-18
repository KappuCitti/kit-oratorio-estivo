import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FooterComponent } from '../../../components/footer/footer.component';
import {
  faEye,
  faPlus,
  faEyeLowVision,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { Shirt } from '../../../../models/Shirt.model';
import Week from '../../../../models/Week.model';
import { ApiService } from '../../../../services/api.service';
import { SessionService } from '../../../../services/session.service';
import { UtilsService } from '../../../../services/utils.service';
import { Class, School } from '../../../../models/School.model';
import { zip } from 'rxjs';

type tabTypes =
  | 'openings'
  | 'weeks'
  | 'shirts'
  | 'schools'
  | 'classes'
  | 'documents'
  | 'activities'
  | null;

type CRUD = 'create' | 'read' | 'update' | 'delete';
type otherTypes = null;

@Component({
  selector: 'app-settings',
  imports: [
    FooterComponent,
    FaIconComponent,
    RouterLink,
    NavbarComponent,
    DatePipe,
  ],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  private api = inject(ApiService);
  private session = inject(SessionService);
  private utils = inject(UtilsService);

  faPlus = faPlus;
  faEye = faEye;
  faEyeLowVision = faEyeLowVision;
  faPen = faPen;
  faTrash = faTrash;

  readonly shirts = signal<Shirt[]>([]);
  readonly schools = signal<School[]>([]);
  readonly classes = signal<Class[]>([]);

  readonly year = new Date().getFullYear();
  readonly weeks = signal<Week[]>([]);
  /** La settimana che si sta salvando, per bloccarne i controlli. */
  readonly savingWeek = signal<number | null>(null);
  readonly weekError = signal<string | null>(null);

  /** Limite di posti e comportamento a posti esauriti: PUT /weeks/{id}. */
  readonly canManageWeeks = computed(() => this.session.has('manage_weeks'));

  loading: Record<Exclude<tabTypes, null>, boolean> = {
    openings: true,
    weeks: true,
    shirts: true,
    schools: true,
    classes: true,
    documents: true,
    activities: true,
  };

  selectedTab: {
    name: tabTypes;
    action: CRUD | otherTypes;
    id: string | number | null;
  } = { id: null, name: null, action: null };

  ngOnInit(): void {
    this.api.getShirts().subscribe((response) => {
      if (response.status == 200 && response.body?.success) {
        this.shirts.set(response.body.data);
        this.loading.shirts = false;
      }
    });

    // Fetch schools and classes in parallel
    zip([this.api.getSchools(), this.api.getClasses()]).subscribe(
      ([schoolsResponse, classesResponse]) => {
        if (schoolsResponse.status == 200 && schoolsResponse.body?.success) {
          this.schools.set(schoolsResponse.body.data);
          this.loading.schools = false;
        }
        if (classesResponse.status == 200 && classesResponse.body?.success) {
          this.classes.set(classesResponse.body.data);
          this.loading.classes = false;
        }
      }
    );

    this.loadWeeks();
  }

  selectTab(
    id: string | number | null,
    tab: tabTypes,
    action: CRUD | otherTypes = null
  ) {
    this.selectedTab = { id: id, name: tab, action: action };
  }

  private loadWeeks() {
    this.api.getWeeks(this.year).subscribe({
      next: (response) => {
        if (response.body?.success) this.weeks.set(response.body.data);
        this.loading.weeks = false;
      },
      error: (error) => console.error(error),
    });
  }

  /**
   * Cambia il limite di posti o il comportamento quando e' raggiunto:
   * rifiutare le nuove richieste, oppure accettarle avvisando il genitore che
   * potrebbero non essere confermate e segnalandole a chi le approva.
   */
  updateWeek(
    week: Week,
    changes: { maxEnrollments?: number; allowOverbooking?: boolean }
  ) {
    if (
      changes.maxEnrollments !== undefined &&
      (!Number.isInteger(changes.maxEnrollments) || changes.maxEnrollments < 1)
    ) {
      this.weekError.set('Il limite di posti deve essere un numero intero positivo.');
      this.loadWeeks();
      return;
    }

    this.savingWeek.set(week.id);
    this.weekError.set(null);

    this.api.editWeek(week.id, changes).subscribe({
      next: () => {
        this.savingWeek.set(null);
        this.loadWeeks();
      },
      error: (error) => {
        console.error(error);
        this.savingWeek.set(null);
        this.weekError.set(this.utils.handleResponse(error, null));
        this.loadWeeks();
      },
    });
  }

  onMaxChange(week: Week, event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    if (value === week.maxEnrollments) return;
    this.updateWeek(week, { maxEnrollments: value });
  }

  onOverbookingChange(week: Week, event: Event) {
    const value = (event.target as HTMLSelectElement).value === 'accept';
    this.updateWeek(week, { allowOverbooking: value });
  }

  // TODO - Add functionality to delete, add and update shirts
}
