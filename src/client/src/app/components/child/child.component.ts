import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
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
  styleUrl: './child.component.css',
})
export class ChildComponent implements OnChanges {
  @Input() child: Child | null = null;
  @Output() childChange = new EventEmitter<Child | null>();
  @Output() isValid = new EventEmitter<boolean>(false);

  @Input() title: string | null = "Ragazzo";
  @Input() editable: boolean = false;
  @Input() save: (() => void) | null = null;

  childForm!: FormGroup;
  addressForm!: FormGroup;

  faFloppyDisk = faFloppyDisk;

  constructor(private fb: FormBuilder) {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.child) {
      this.childForm.patchValue(
        {
          name: this.child?.name,
          surname: this.child?.surname,
          gender: this.child?.gender,
          birthDate: this.child?.birthDate,
          birthPlace: this.child?.birthPlace,
        },
        { emitEvent: false }
      );

      this.addressForm.patchValue(
        {
          country: this.child?.address?.country ?? '',
          street: this.child?.address?.street ?? '',
          city: this.child?.address?.city ?? '',
          postalCode: this.child?.address?.postalCode ?? '',
        },
        { emitEvent: false }
      );
    }

    if (!this.editable) {
      this.childForm.disable();
      this.addressForm.disable();
    } else {
      this.childForm.enable();
      this.addressForm.enable();
    }
  }

  updateChild() {
    if (this.childForm.valid || this.addressForm.valid) {
      var updatedChild: Child | null = {
        ...(this.child ?? ({} as Child)),
        ...this.childForm.value,
        address: {
          ...(this.child?.address ?? {}),
          ...this.addressForm.value,
        },
      };

      this.child = updatedChild;
      this.childChange.emit(updatedChild);
    }
  }

  saveChild() {
    if (
      this.editable &&
      this.save &&
      this.childForm.valid &&
      this.addressForm.valid
    ) {
      this.save();
    }
  }
}
