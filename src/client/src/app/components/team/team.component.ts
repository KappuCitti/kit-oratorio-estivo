import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
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
  styleUrl: './team.component.css',
})
export class TeamComponent implements OnChanges {
  @Input() team: Team | null = null;
  @Output() teamChange = new EventEmitter<Team | null>();
  @Output() teamDelete = new EventEmitter<number>();
  @Output() isValid = new EventEmitter<boolean>(false);

  @Input() editable: boolean = false;
  @Input() save: Function | null = null;

  teamForm!: FormGroup;

  error: string | null = null;

  faFloppyDisk = faFloppyDisk;
  faPen = faPen;
  faTrash = faTrash;

  isEditModalOpen = false;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private utils: UtilsService
  ) {
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

    if (name === this.team?.name && color === this.team?.color) {
      return { noChanges: true }; // Errore se non ci sono modifiche
    }

    return null; // Valido se almeno un campo è cambiato
  }

  ngOnChanges(): void {
    if (this.team) {
      this.teamForm.patchValue({
        name: this.team.name || '',
        color: this.team.color || '',
      });
    }
  }

  deleteTeam(id: number) {
    this.api.deleteTeam(id).subscribe(() => {
      this.teamDelete.emit(this.team!.id);
      this.closeEditModal();
    });
  }

  closeEditModal() {
    this.teamForm.patchValue({
      name: this.team?.name || '',
      color: this.team?.color || '',
    });

    this.isEditModalOpen = false;
  }

  saveTeam() {
    if (this.teamForm.valid && this.team) {
      this.error = null;

      const data: TeamUpdateRequest = {
        id: this.team.id,
      };

      if (this.teamForm.value.name !== this.team.name) {
        data.name = this.teamForm.value.name;
      }
      if (this.teamForm.value.color !== this.team.color) {
        data.color = this.teamForm.value.color;
      }

      if (data.name || data.color) {
        this.api.updateTeam(data).subscribe({
          next: (response) => {
            if (response.status == 200) {
              this.teamChange.emit({
                id: this.team!.id,
                name: this.teamForm.value.name,
                color: this.teamForm.value.color,
              });

              if (this.team) {
                this.team.name = this.teamForm.value.name;
                this.team.color = this.teamForm.value.color;
              }

              this.closeEditModal();
            }
          },
          error: (error) => {
            this.error = this.utils.handleResponse(error, null);
          },
        });
      }
    } else {
      this.error = 'Modifica prima di salvare!';
    }
  }
}
