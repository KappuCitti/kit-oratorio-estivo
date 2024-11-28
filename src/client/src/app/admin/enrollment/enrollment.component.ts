/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Enrollment, { Week } from 'src/models/Enrollment.model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent implements OnInit {
  enrollments: Enrollment[] = [];
  searchForm: FormGroup;
  weeks: Week[] = [];
  currentYearValue = '';
  enrollmentToDelete: Enrollment | null = null;
  loading = true;

  total: number = 0;
  limit: number = 25;
  offset = 0;

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      year: [new Date().getFullYear().toString(), [Validators.pattern(/^\d{4}$/)]],
      week: ['', [Validators.pattern(/^[0-9]+$/)]],
      name: ['', []],
      surname: ['', []],
      schoolType: ['', [Validators.pattern(/^(Secondary|Primary)$/)]],
      class: ['', [Validators.pattern(/^(I|II|III|IV|V)$/)]],
      section: ['', [Validators.pattern(/^[a-zA-Z]+$/)]],
    })

    this.currentYearValue = this.searchForm.get('year')?.value;
    if (this.searchForm.get('year')?.value && this.searchForm.get('year')?.valid) {
      this.api.getWeeksByYear(this.searchForm.get('year')?.value).subscribe({

        next: (data) => {
          this.weeks = data.body?.data || [];
        }
      })
    }

    this.searchForm.valueChanges.subscribe(() => {
      // Check if year value from form is changes, if it send request to get weeks otherwise clear do notjing
      if (this.searchForm.get('year')?.value && this.searchForm.get('year')?.valid) {
        if (this.currentYearValue !== this.searchForm.get('year')?.value) {

          this.api.getWeeksByYear(this.searchForm.get('year')?.value).subscribe({
            next: (data) => {
              this.weeks = data.body?.data || [];
            }
          })

        }
        this.currentYearValue = this.searchForm.get('year')?.value;
      }
    })
  }

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.loading = true;
    this.enrollments = [];


    this.api.getEnrollments({
      year: this.searchForm.get('year')?.value,
      name: this.searchForm.get('name')?.value,
      surname: this.searchForm.get('surname')?.value,
      schoolType: this.searchForm.get('schoolType')?.value,
      classNumber: this.searchForm.get('class')?.value,
      section: this.searchForm.get('section')?.value,
      week: this.searchForm.get('week')?.value,
      limit: this.limit,
      offset: this.offset
    }).subscribe({
      next: (data) => {
        this.enrollments = data.body?.data || [];
        this.total = data.body?.total || 0;
        this.loading = false;
      }
    });
  }

  getEnrolledAndPaidWeeksCount(enrollment: Enrollment) {
    return enrollment.weeks?.filter(w => w.enrolled && w.payed).length || 0;
  }

  getEnrolledWeeksCount(enrollment: Enrollment) {
    return enrollment.weeks?.filter(w => w.enrolled).length || 0;
  }

  getCircleClass(enrolled: boolean, index: number): string {
    return enrolled ? `bi-${index + 1}-circle-fill` : `bi-${index + 1}-circle`;
  }

  getDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  setEnrollmentToDelete(enrollment: Enrollment) {
    if (enrollment) {
      this.enrollmentToDelete = enrollment;
    }
  }

  deleteEnrollment() {
    if (this.enrollmentToDelete) {
      this.api.deleteEnrollmentById(this.enrollmentToDelete.id.toFixed()).subscribe({
        next: () => {
          this.enrollments = this.enrollments.filter(e => e.id !== this.enrollmentToDelete?.id);
          this.enrollmentToDelete = null;
        }
      })
    }
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
