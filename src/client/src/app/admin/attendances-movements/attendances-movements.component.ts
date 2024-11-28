/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Movement, MovementResponse } from 'src/models/Attendance';
import { Child } from 'src/models/Enrollment.model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-attendances-movements',
  templateUrl: './attendances-movements.component.html',
  styleUrls: ['./attendances-movements.component.scss']
})
export class AttendancesMovementsComponent implements OnInit {
  childId: string | null = null;
  loading: boolean = true;
  editMovementForm: FormGroup;

  child: Child = {} as Child;
  movements: Movement[] = [];

  selectedMovement: Movement = {} as Movement;

  constructor(private api: ApiService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.editMovementForm = this.fb.group({
      type: ['', [Validators.required]],
      time: ['', [Validators.required]],
      notes: ['', []],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.childId = this.route.snapshot.paramMap.get('id');
    if (this.childId == null) this.router.navigate(['/admin/attendances']);
    else {
      this.api.getChildById(this.childId).subscribe({
        next: (data) => {
          if (data.body?.data == null || data.body?.data?.child == null) this.router.navigate(['/admin/attendances']);
          else this.child = data.body?.data?.child || {} as Child;
        },
        error: (err) => {
          this.router.navigate(['/admin/attendances']);
        }
      })

      this.api.getMovementByChildId(this.childId).subscribe({
        next: (data) => {
          this.movements = data.body?.data || [];
          this.loading = false;
        }
      });
    }
  }

  setMovementToEdit(movement: Movement) {
    this.selectedMovement = movement;

    const datetime = new Date(movement.time);
    this.editMovementForm.patchValue({
      type: movement.type,
      time: `${datetime.getHours().toString().padStart(2, '0')}:${datetime.getMinutes().toString().padStart(2, '0')}`,
      notes: movement.notes
    });
  }

  editMovement() {
    if (this.editMovementForm.valid && this.childId && this.selectedMovement) {
      const type = this.editMovementForm.get('type')?.value
      const notes = this.editMovementForm.get('notes')?.value

      const date = new Date(this.selectedMovement.time);
      const [hours, minutes] = this.editMovementForm.get('time')?.value.split(':');
      const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);

      this.api.updateMovementById(this.childId?.toString(), this.selectedMovement.id.toString(), type, newDate.getTime(), notes).subscribe({
        next: (data) => {
          this.ngOnInit();
        }
      })
    }
  }

  setMovementToDelete(movement: Movement) {
    this.selectedMovement = movement;
  }

  deleteMovement() {
    if (this.childId == null) return;
    this.api.deleteMovementById(this.childId?.toString(), this.selectedMovement.id.toString()).subscribe({
      next: (data) => {
        this.ngOnInit();
      }
    })
  }
}
