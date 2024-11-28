/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { Location } from '@angular/common';
import Enrollment, { Note, Shirt, Team, Week } from 'src/models/Enrollment.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-enrollment-display',
  templateUrl: './enrollment-display.component.html',
  styleUrls: ['./enrollment-display.component.scss']
})
export class EnrollmentDisplayComponent implements OnInit, OnChanges {
  enrollmentForm!: FormGroup;

  @Input() inputEnrollmentId: string | null = null;
  @Input() inputEnrollment: Enrollment | null = null;
  @Output() enrollmentChange = new EventEmitter<Enrollment>();

  @Input() inputYear: number | null = null;
  @Output() yearChange = new EventEmitter<number>();

  @Input() inputWeeks: Week[] = [];
  @Output() weeksChange = new EventEmitter<Week[]>();

  teams: Team[] = [];
  shirts: Shirt[] = [];
  enrollment: Enrollment = {} as Enrollment;
  weeks: Week[] = [];
  year: number = new Date().getFullYear();

  constructor(private api: ApiService, private location: Location, private fb: FormBuilder) {
    this.enrollmentForm = this.fb.group({
      schoolType: ['Primary', [Validators.required, Validators.pattern(/^(Secondary|Primary)$/)]],
      class: ['I', [Validators.required, Validators.pattern(/^(I|II|III|IV|V)$/)]],
      section: ['A', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      dataProcessingConsent: ['true', [Validators.required, Validators.pattern(/^(true|false)$/)]],
      exitAuthorization: ['true', [Validators.required, Validators.pattern(/^(true|false)$/)]],
      team: ['', []],
      shirt: ['', []],
      parentNotes: ['', []],
      managerNotes: ['', []]
    })

    this.enrollment = {
      team: {} as Team,
      shirt: {} as Shirt,
      notes: {} as Note
    } as Enrollment

    this.enrollmentForm.valueChanges.subscribe(() => {
      this.enrollment.schoolType = this.enrollmentForm.get('schoolType')?.value;
      this.enrollment.classNumber = this.enrollmentForm.get('class')?.value;
      this.enrollment.section = this.enrollmentForm.get('section')?.value;
      this.enrollment.dataProcessingConsent = this.enrollmentForm.get('dataProcessingConsent')?.value;
      this.enrollment.exitAuthorization = this.enrollmentForm.get('exitAuthorization')?.value;
      this.enrollment.team.id = this.enrollmentForm.get('team')?.value;
      this.enrollment.shirt.id = this.enrollmentForm.get('shirt')?.value;
      this.enrollment.notes.parent = this.enrollmentForm.get('parentNotes')?.value;
      this.enrollment.notes.manager = this.enrollmentForm.get('managerNotes')?.value;

      this.enrollmentChange.emit(this.enrollment);
    });
  }

  ngOnInit(): void {
    this.api.getAllTeams().subscribe({
      next: (data) => {
        this.teams = data.body?.data || [];
      }
    });

    this.api.getAllShirts().subscribe({
      next: (data) => {
        this.shirts = data.body?.data || [];
      }
    });


    // Emit defialt values
    this.enrollment.schoolType = this.enrollmentForm.get('schoolType')?.value;
    this.enrollment.classNumber = this.enrollmentForm.get('class')?.value;
    this.enrollment.section = this.enrollmentForm.get('section')?.value;
    this.enrollment.dataProcessingConsent = this.enrollmentForm.get('dataProcessingConsent')?.value;
    this.enrollment.exitAuthorization = this.enrollmentForm.get('exitAuthorization')?.value;
    this.enrollment.team.id = this.enrollmentForm.get('team')?.value;
    this.enrollment.shirt.id = this.enrollmentForm.get('shirt')?.value;
    this.enrollment.notes.parent = this.enrollmentForm.get('parentNotes')?.value;
    this.enrollment.notes.manager = this.enrollmentForm.get('managerNotes')?.value;

    this.enrollmentChange.emit(this.enrollment);
  }

  ngOnChanges(): void {
    if (this.inputEnrollmentId != null) {
      this.api.getEnrollmentById(this.inputEnrollmentId).subscribe({
        next: (data) => {
          if (data.body?.data == null) this.location.back();
          else {
            this.enrollment = data.body?.data;

            this.enrollmentForm.patchValue({
              schoolType: this.enrollment.schoolType,
              class: this.enrollment.classNumber,
              section: this.enrollment.section,
              dataProcessingConsent: this.enrollment.dataProcessingConsent,
              exitAuthorization: this.enrollment.exitAuthorization,
              team: this.enrollment.team.id,
              shirt: this.enrollment.shirt.id,
              parentNotes: this.enrollment.notes.parent,
              managerNotes: this.enrollment.notes.manager
            });

            this.weeks = this.enrollment.weeks || [];
          }
        },
        error: (err) => {
          this.location.back();
        }
      })
    }

    if (this.inputEnrollment) {
      this.enrollment = this.inputEnrollment;
      this.enrollmentForm.patchValue({
        schoolType: this.enrollment.schoolType,
        class: this.enrollment.classNumber,
        section: this.enrollment.section,
        dataProcessingConsent: this.enrollment.dataProcessingConsent,
        exitAuthorization: this.enrollment.exitAuthorization,
        team: this.enrollment.team.id,
        shirt: this.enrollment.shirt.id,
        parentNotes: this.enrollment.notes.parent,
        managerNotes: this.enrollment.notes.manager
      });

      this.weeks = this.enrollment.weeks || [];
    }

    if (this.inputWeeks.length > 0) {
      this.weeks = this.inputWeeks;
    }

    if (this.weeks.length == 0 && this.inputWeeks.length == 0 || this.inputYear != this.year) {
      if (this.inputYear && this.inputYear.toString().length > 3) {
        this.api.getWeeksByYear(this.inputYear.toString()).subscribe({
          next: (data) => {
            this.weeks = data.body?.data || [];
          }
        });
      }
    }
  }

  getDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  emitWeeks() {
    this.weeksChange.emit(this.weeks);
  }
}
