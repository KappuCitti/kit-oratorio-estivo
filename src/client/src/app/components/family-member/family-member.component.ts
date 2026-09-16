import { Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectionStrategy, inject } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './family-member.component.html',
})
export class FamilyMemberComponent {
  private fb = inject(FormBuilder);

  @Input() familyMember: FamilyMember | null = null;
  @Output() familyMemberChange = new EventEmitter<FamilyMember | null>();
  @Output() isValid = new EventEmitter<boolean>(false);

  @Input() title: string | null = 'Persona';
  @Input() editable: boolean = false;
  @Input() save: Function | null = null;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.familyMember) {
      this.familyMemberForm.patchValue(
        {
          name: this.familyMember?.name,
          surname: this.familyMember?.surname,
          gender: this.familyMember?.gender,
          email: this.familyMember?.email,
          phone: this.familyMember?.phone,
          birthDate: this.familyMember?.birthDate,
          birthPlace: this.familyMember?.birthPlace,
          id: this.familyMember?.id,
        },
        { emitEvent: false }
      );

      this.title = this.familyMember.role.displayName || 'Persona';
    }

    if (!this.editable) {
      this.familyMemberForm.disable();
    } else {
      this.familyMemberForm.enable();
      this.familyMemberForm.get('id')?.disable();
    }
  }

  updateFamilyMember() {
    const updateFamilyMember: FamilyMember = {
      ...this.familyMember,
      ...this.familyMemberForm.value,
    };

    this.familyMember = updateFamilyMember;
    this.familyMemberChange.emit(updateFamilyMember);
  }

  saveFamilyMember() {
    if (this.editable && this.save && this.familyMemberForm.valid) {
      this.save();
    }
  }
}
