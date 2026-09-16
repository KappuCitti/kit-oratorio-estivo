import { Component, OnChanges, inject, input, model, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { Child } from '../../../models/Family.model';

@Component({
  selector: 'app-child',
  imports: [FaIconComponent, ReactiveFormsModule],
  templateUrl: './child.component.html',
})
export class ChildComponent implements OnChanges {
  private fb = inject(FormBuilder);

  readonly child = model<Child | null>(null);
  readonly isValid = output<boolean>();

  readonly title = input<string | null>('Ragazzo');
  readonly editable = input<boolean>(false);
  readonly save = input<(() => void) | null>(null);

  childForm!: FormGroup;
  addressForm!: FormGroup;

  faFloppyDisk = faFloppyDisk;

  constructor() {
    this.childForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      gender: ['', [Validators.required, Validators.pattern(/^(M|F)$/)]],
      birthDate: ['', [Validators.required]],
      birthPlace: ['', [Validators.required]],
    });
    this.addressForm = this.fb.group({
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
    });

    this.childForm.valueChanges.subscribe(() => {
      this.updateChild();
      this.isValid.emit(this.childForm.valid && this.addressForm.valid);
    });
    this.addressForm.valueChanges.subscribe(() => {
      this.updateChild();
      this.isValid.emit(this.childForm.valid && this.addressForm.valid);
    });
  }

  ngOnChanges(): void {
    const child = this.child();

    if (child) {
      this.childForm.patchValue(
        {
          name: child.name,
          surname: child.surname,
          gender: child.gender,
          birthDate: child.birthDate,
          birthPlace: child.birthPlace,
        },
        { emitEvent: false }
      );

      this.addressForm.patchValue(
        {
          country: child.address?.country ?? '',
          street: child.address?.street ?? '',
          city: child.address?.city ?? '',
          postalCode: child.address?.postalCode ?? '',
        },
        { emitEvent: false }
      );
    }

    if (!this.editable()) {
      this.childForm.disable();
      this.addressForm.disable();
    } else {
      this.childForm.enable();
      this.addressForm.enable();
    }
  }

  updateChild() {
    if (this.childForm.valid || this.addressForm.valid) {
      const current = this.child();

      // `set` su un model aggiorna il valore e in piu' emette `childChange`:
      // sostituisce sia l'assegnazione che l'emit esplicito di prima.
      this.child.set({
        ...(current ?? ({} as Child)),
        ...this.childForm.value,
        address: {
          ...(current?.address ?? {}),
          ...this.addressForm.value,
        },
      });
    }
  }

  saveChild() {
    const save = this.save();
    if (
      this.editable() &&
      save &&
      this.childForm.valid &&
      this.addressForm.valid
    ) {
      save();
    }
  }
}
