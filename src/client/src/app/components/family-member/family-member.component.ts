import { Component, computed, inject, input, model, output } from '@angular/core';
import { FamilyMember } from '../../../models/Family.model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-family-member',
  imports: [FaIconComponent, ReactiveFormsModule],
  templateUrl: './family-member.component.html',
})
export class FamilyMemberComponent {
  private fb = inject(FormBuilder);

  readonly familyMember = model<FamilyMember | null>(null);
  readonly isValid = output<boolean>();

  readonly title = input<string | null>('Persona');
  readonly editable = input<boolean>(false);

  // Il titolo mostrato e' il ruolo del membro quando c'e', altrimenti quello
  // passato dal padre. Prima era l'input `title` riscritto dentro
  // ngOnChanges: essendo un valore derivato, `computed` lo esprime senza
  // scrivere sull'input e senza dipendere dall'ordine dei change detection.
  //
  // Il titolo e' il nome della persona: con il solo ruolo due figli
  // comparivano entrambi come "Figlio", indistinguibili finche' non si apriva
  // l'anagrafica. Il ruolo resta accanto, come dettaglio.
  protected readonly displayTitle = computed(() => {
    const persona = this.familyMember();
    return persona ? `${persona.name} ${persona.surname}` : this.title();
  });
  protected readonly roleName = computed(
    () => this.familyMember()?.role?.displayName ?? null
  );
  readonly save = input<Function | null>(null);

  familyMemberForm!: FormGroup;

  faFloppyDisk = faFloppyDisk;

  constructor() {
    this.familyMemberForm = this.fb.group({
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[0-9\s]+$/)]],
      role: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      gender: ['', [Validators.required, Validators.pattern(/^(M|F)$/)]],
      birthDate: ['', [Validators.required]],
      birthPlace: ['', [Validators.required]],
      id: [{ value: '', disabled: true }, [Validators.required]],
    });

    this.familyMemberForm.valueChanges.subscribe(() => {
      if (this.familyMemberForm.valid) {
        this.updateFamilyMember();
      }
      this.isValid.emit(this.familyMemberForm.valid);
    });
  }

  ngOnChanges(): void {
    const familyMember = this.familyMember();

    if (familyMember) {
      this.familyMemberForm.patchValue(
        {
          name: familyMember.name,
          surname: familyMember.surname,
          gender: familyMember.gender,
          email: familyMember.email,
          phone: familyMember.phone,
          birthDate: familyMember.birthDate,
          birthPlace: familyMember.birthPlace,
          id: familyMember.id,
        },
        { emitEvent: false }
      );
    }

    if (!this.editable()) {
      this.familyMemberForm.disable();
    } else {
      this.familyMemberForm.enable();
      this.familyMemberForm.get('id')?.disable();
    }
  }

  updateFamilyMember() {
    // `set` su un model aggiorna il valore ed emette `familyMemberChange`.
    this.familyMember.set({
      ...this.familyMember(),
      ...this.familyMemberForm.value,
    });
  }

  saveFamilyMember() {
    const save = this.save();
    if (this.editable() && save && this.familyMemberForm.valid) {
      save();
    }
  }
}
