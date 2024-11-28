/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Attendance, { AttendanceResponse, Movement } from 'src/models/Attendance';
import { Child, Week } from 'src/models/Enrollment.model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-attendances',
  templateUrl: './attendances.component.html',
  styleUrls: ['./attendances.component.scss']
})
export class AttendancesComponent implements OnInit {
  searchForm: FormGroup;
  date: Date = new Date();
  attendances: AttendanceResponse[] = [];
  loading: boolean = true;

  addMovementForm: FormGroup;
  movementAction: "Join" | "Left" | null = null;
  selectedAttendanceForMovement: AttendanceResponse | null = null;
  movement: Movement = {} as Movement;

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      date: [this.date.toLocaleDateString('en-CA'), [Validators.required]],
      schoolType: ['', [Validators.pattern(/^(Secondary|Primary)$/)]],
      class: ['', [Validators.pattern(/^(I|II|III|IV|V)$/)]],
    });

    this.searchForm.valueChanges.subscribe(() => {
      this.ngOnInit();
    });

    this.addMovementForm = this.fb.group({
      type: ['', [Validators.required]],
      time: ['', [Validators.required]],
      notes: ['', []],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.api.getAttendancesByDate(this.searchForm.get('date')?.value, this.searchForm.get('schoolType')?.value, this.searchForm.get('class')?.value).subscribe({
      next: (data) => {
        this.attendances = data.body?.data || [];
        this.loading = false;
      }
    })
  }

  updateAttendance(attendance: AttendanceResponse) {
    if (attendance.attendance.id) {
      this.api.updateAttendanceById(attendance.attendance.id.toString(), attendance.attendance.present, attendance.attendance.eatsAtOratory, attendance.attendance.eatsInBianco).subscribe({
        next: (data) => {
          this.ngOnInit();
        }
      })
    } else {
      this.api.addAttendance(attendance.enrollmentId.toString(), this.searchForm.get('date')?.value, attendance.attendance.present, attendance.attendance.eatsAtOratory, attendance.attendance.eatsInBianco).subscribe({
        next: (data) => {
          this.ngOnInit();
        }
      });
    }
  }

  manageMovement(attendance: AttendanceResponse, action: "Join" | "Left") {
    this.selectedAttendanceForMovement = attendance;
    this.movementAction = action;
    this.addMovementForm.patchValue({
      type: action
    });
  }

  addMovement() {
    if (this.addMovementForm.valid && this.selectedAttendanceForMovement?.childId && this.movementAction) {
      const date = new Date(this.searchForm.get('date')?.value);
      const [hours, minutes] = this.addMovementForm.get('time')?.value.split(':');
      const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);

      this.api.addMovementToAttendanceByChildId(this.selectedAttendanceForMovement?.childId.toString(), this.addMovementForm.get('type')?.value, newDate.getTime(), this.addMovementForm.get('notes')?.value).subscribe({
        next: (data) => {
          this.ngOnInit();
        }
      })
    }

    // Reset data
    this.addMovementForm.reset();
    this.movementAction = null;
    this.selectedAttendanceForMovement = null;
  }
}
