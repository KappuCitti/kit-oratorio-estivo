import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
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
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.css',
})
export class ParentComponent implements OnChanges {
  @Input() parent: Parent | null = null;
  @Output() parentChange = new EventEmitter<Parent | null>();
  @Output() isValid = new EventEmitter<boolean>(false);

  @Input() title: string | null = "Genitore"
  @Input() editable: boolean = false;
  @Input() save: Function | null = null;

  parentForm!: FormGroup;

  faFloppyDisk = faFloppyDisk;

  constructor(private fb: FormBuilder) {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.parent) {
      this.parentForm.patchValue(
        {
          name: this.parent?.name,
          surname: this.parent?.surname,
          gender: this.parent?.gender,
          email: this.parent?.email,
          phoneNumber: this.parent?.phoneNumber,
        },
        { emitEvent: false }
      );
    }

    if (!this.editable) {
      this.parentForm.disable();
    } else {
      this.parentForm.enable();
    }
  }

  updateParent() {
    const updateParent: Parent = {
      ...this.parent,
      ...this.parentForm.value,
    };

    this.parent = updateParent;
    this.parentChange.emit(updateParent);
  }

  saveParent() {
    if (this.editable && this.save && this.parentForm.valid) {
      this.save();
    }
  }
}
