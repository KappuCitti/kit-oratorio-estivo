import { Component, OnInit } from '@angular/core';
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
  styleUrl: './teams-search.component.css',
})
export class TeamsSearchComponent implements OnInit {
  teams: Team[] = [];
  loading = true;

  faPlus = faPlus;

  teamForm: FormGroup;
  error: string | null = null;

  isAddModalOpen = false;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private utils: UtilsService
  ) {
    this.teamForm = this.fb.group({
      name: ['', [Validators.required]],
      color: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loading = true;
    this.api.getTeams().subscribe((response) => {
      this.teams = response.body?.data || [];
      this.loading = false;
    });
  }

  onTeamChange(team: Team | null) {
    if (team) this.teams = this.teams.map((t) => (t.id === team.id ? team : t));
  }

  onTeamDelete(id: number) {
    this.teams = this.teams.filter((t) => t.id !== id);
  }

  closeEditModal() {
    this.teamForm.reset();
    this.error = null;

    this.isAddModalOpen = false;
  }

  onSaveNewTeam() {
    if (this.teamForm.invalid) {
      return;
    }

    this.api.createTeam(this.teamForm.value).subscribe({
      next: (response) => {
        if (response.body?.data) {
          this.teams.push({ id: response.body?.data, ...this.teamForm.value });
        }

        this.closeEditModal();
      },
      error: (error) => {
        console.error(error);
        this.error = this.utils.handleResponse(error, null);
      },
    });
  }
}
