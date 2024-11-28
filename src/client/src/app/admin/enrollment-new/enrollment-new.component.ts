/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Enrollment, { Child, Week } from 'src/models/Enrollment.model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-enrollment-new',
  templateUrl: './enrollment-new.component.html',
  styleUrls: ['./enrollment-new.component.scss']
})
export class EnrollmentNewComponent implements OnInit {
  searchForm: FormGroup;
  child: Child | null = null;

  selectChildForm: FormGroup;
  children: Child[] = [];

  selectYearForm: FormGroup;

  enrollment: Enrollment | null = null;
  weeks: Week[] = [];

  total: number = 0;
  limit: number = 25;
  offset = 0;

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]]
    })

    this.selectChildForm = this.fb.group({
      child: ['', [Validators.required]]
    })

    this.selectYearForm = this.fb.group({
      year: [new Date().getFullYear(), [Validators.required, Validators.pattern(/^\d{4}$/)]]
    })

    this.selectChildForm.valueChanges.subscribe(() => {
      const id = this.selectChildForm.get('child')?.value;
      this.api.getChildById(id).subscribe(data => {
        this.child = data.body?.data?.child || null;
      })
    })
  }

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.api.searchChild(this.searchForm.value.name, this.searchForm.value.surname, this.limit, this.offset).subscribe(data => {
      this.children = data.body?.data || [];
      this.total = data.body?.total || 0;
    });
  }

  isFormValid() {
    return this.selectChildForm.valid && this.selectYearForm.valid && this.enrollment && this.weeks && this.child && this.selectYearForm.get('year')?.value;
  }


  create() {
    if (this.child && this.enrollment) {
      const data = {
        childId: this.child.id!,
        schoolType: this.enrollment.schoolType,
        classNumber: this.enrollment.classNumber,
        section: this.enrollment.section,
        dataProcessingConsent: this.enrollment.dataProcessingConsent,
        exitAuthorization: this.enrollment.exitAuthorization,
        teamId: this.enrollment.team.id,
        shirtId: this.enrollment.shirt.id,
        parentNotes: this.enrollment.notes.parent,
        managerNotes: this.enrollment.notes.manager,
        year: this.selectYearForm.get('year')?.value,
        weeks: this.weeks
      }
      
      this.api.addEnrollment(data).subscribe(data => {
        window.location.reload();
      })
    }

  }

  saveEmittedWeeks(weeks: Week[]) {
    this.weeks = weeks;
  }

  saveEmittedEnrollment(enrollment: Enrollment) {
    this.enrollment = enrollment;
  }

  onPageChange(page: number) {
    this.offset = (page - 1) * this.limit;
    this.search();
  }

  onSizeChange(limit: number) {
    this.limit = limit;
    this.search();
  }
}
