import { Component, OnChanges, ChangeDetectionStrategy, inject, input, model, output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { Parent } from '../../../models/Family.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-parent',
  imports: [FaIconComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './parent.component.html',
})
export class ParentComponent implements OnChanges {
  private fb = inject(FormBuilder);

  readonly parent = model<Parent | null>(null);
  readonly isValid = output<boolean>();

  readonly title = input<string | null>('Genitore');
  readonly editable = input<boolean>(false);
  readonly save = input<Function | null>(null);

  parentForm!: FormGroup;

  faFloppyDisk = faFloppyDisk;

  constructor() {
    this.parentForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      gender: ['', [Validators.required, Validators.pattern(/^(M|F)$/)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
    });

    this.parentForm.valueChanges.subscribe(() => {
      if (this.parentForm.valid) {
        this.updateParent();
      }
      this.isValid.emit(this.parentForm.valid);
    });
  }

  ngOnChanges(): void {
    const parent = this.parent();

    if (parent) {
      this.parentForm.patchValue(
        {
          name: parent.name,
          surname: parent.surname,
          gender: parent.gender,
          email: parent.email,
          phoneNumber: parent.phoneNumber,
        },
        { emitEvent: false }
      );
    }

    if (!this.editable()) {
      this.parentForm.disable();
    } else {
      this.parentForm.enable();
    }
  }

  updateParent() {
    // `set` su un model aggiorna il valore ed emette `parentChange`.
    this.parent.set({
      ...this.parent(),
      ...this.parentForm.value,
    });
  }

  saveParent() {
    const save = this.save();
    if (this.editable() && save && this.parentForm.valid) {
      save();
    }
  }
}
