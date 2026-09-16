import { Component, OnChanges, inject, input, model, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  faFloppyDisk,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Team from '../../../models/Team.model';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApiService } from '../../../services/api.service';
import { TeamUpdateRequest } from '../../../models/Request.model';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-team',
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './team.component.html',
})
export class TeamComponent implements OnChanges {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private utils = inject(UtilsService);

  readonly team = model<Team | null>(null);
  readonly teamDelete = output<number>();
  readonly isValid = output<boolean>();

  readonly editable = input<boolean>(false);
  readonly save = input<Function | null>(null);

  teamForm!: FormGroup;

  readonly error = signal<string | null>(null);
  readonly errorDelete = signal<string | null>(null);

  faFloppyDisk = faFloppyDisk;
  faPen = faPen;
  faTrash = faTrash;

  readonly isEditModalOpen = signal(false);
  readonly isDeleteModalOpen = signal(false);

  constructor() {
    this.teamForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        color: ['', [Validators.required]],
      },
      { validators: this.teamModifiedValidator.bind(this) }
    );

    this.teamForm.valueChanges.subscribe(() => {
      this.isValid.emit(this.teamForm.valid);
    });
  }

  private teamModifiedValidator(
    form: AbstractControl
  ): ValidationErrors | null {
    const name = form.get('name')?.value;
    const color = form.get('color')?.value;
    const team = this.team();

    if (name === team?.name && color === team?.color) {
      return { noChanges: true }; // Errore se non ci sono modifiche
    }

    return null; // Valido se almeno un campo è cambiato
  }

  ngOnChanges(): void {
    const team = this.team();

    if (team) {
      this.teamForm.patchValue({
        name: team.name || '',
        color: team.color || '',
      });
    }
  }

  deleteTeam() {
    const team = this.team();
    if (!team) return;

    this.api.deleteTeam(team.id).subscribe(() => {
      this.teamDelete.emit(team.id);
      this.closeEditModal();
    });
  }

  closeEditModal() {
    const team = this.team();

    this.teamForm.patchValue({
      name: team?.name || '',
      color: team?.color || '',
    });

    this.isEditModalOpen.set(false);
  }

  saveTeam() {
    const team = this.team();

    if (this.teamForm.valid && team) {
      this.error.set(null);

      const data: TeamUpdateRequest = {
        id: team.id,
      };

      if (this.teamForm.value.name !== team.name) {
        data.name = this.teamForm.value.name;
      }
      if (this.teamForm.value.color !== team.color) {
        data.color = this.teamForm.value.color;
      }

      if (data.name || data.color) {
        this.api.updateTeam(data).subscribe({
          next: (response) => {
            if (response.status == 200) {
              // Prima qui si emetteva `teamChange` e in piu' si mutava
              // l'oggetto `team` sul posto. `set` fa entrambe le cose, e in
              // piu' produce un nuovo oggetto invece di modificare quello
              // condiviso con la lista del componente padre.
              this.team.set({
                id: team.id,
                name: this.teamForm.value.name,
                color: this.teamForm.value.color,
              });

              this.closeEditModal();
            }
          },
          error: (error) => {
            console.error(error);
            this.error.set(this.utils.handleResponse(error, null));
          },
        });
      }
    } else {
      this.error.set('Modifica prima di salvare!');
    }
  }
}
