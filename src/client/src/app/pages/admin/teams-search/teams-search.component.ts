import { Component, OnInit, inject, signal } from '@angular/core';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import Team from '../../../../models/Team.model';
import { ApiService } from '../../../../services/api.service';
import { TeamComponent } from '../../../components/team/team.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-teams-search',
  imports: [
    FooterComponent,
    NavbarComponent,
    TeamComponent,
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
  templateUrl: './teams-search.component.html',
})
export class TeamsSearchComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private utils = inject(UtilsService);

  readonly teams = signal<Team[]>([]);
  readonly loading = signal(true);

  faPlus = faPlus;

  teamForm: FormGroup;
  readonly error = signal<string | null>(null);

  readonly isAddModalOpen = signal(false);

  constructor() {
    this.teamForm = this.fb.group({
      name: ['', [Validators.required]],
      color: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loading.set(true);
    this.api.getTeams().subscribe((response) => {
      if (response.body?.success) this.teams.set(response.body.data);
      this.loading.set(false);
    });
  }

  onTeamChange(team: Team | null) {
    if (team) {
      this.teams.update((teams) =>
        teams.map((t) => (t.id === team.id ? team : t))
      );
    }
  }

  onTeamDelete(id: number) {
    this.teams.update((teams) => teams.filter((t) => t.id !== id));
  }

  closeEditModal() {
    this.teamForm.reset();
    this.error.set(null);

    this.isAddModalOpen.set(false);
  }

  onSaveNewTeam() {
    if (this.teamForm.invalid) {
      return;
    }

    this.api.createTeam(this.teamForm.value).subscribe({
      next: (response) => {
        if (response.body?.success) {
          // Aggiornamento immutabile al posto di push: un signal notifica
          // solo se cambia il riferimento dell'array.
          this.teams.update((teams) => [
            ...teams,
            { id: response.body!.success, ...this.teamForm.value },
          ]);
        }

        this.closeEditModal();
      },
      error: (error) => {
        console.error(error);
        this.error.set(this.utils.handleResponse(error, null));
      },
    });
  }
}
