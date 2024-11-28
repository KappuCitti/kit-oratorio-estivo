/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Enrollment from 'src/models/Enrollment.model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-enrollment-edit',
  templateUrl: './enrollment-edit.component.html',
  styleUrls: ['./enrollment-edit.component.scss']
})
export class EnrollmentEditComponent implements OnInit {
  id: string | null = null;
  enrollment: Enrollment | null = null;
  constructor(private route: ActivatedRoute, private location: Location, private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id == null) this.location.back();
    else {
      this.api.getEnrollmentById(this.id).subscribe({
        next: (data) => {
          if (data.body?.data == null) this.location.back();
          else {
            this.enrollment = data.body?.data;
          }
        },
        error: (err) => {
          this.location.back();
        }
      })
    }
  }

  calculateYO(date: string | undefined) {
    if (date == null) return 0;

    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  saveEnrollment() {
    if (this.enrollment == null) return;
    let res = {
      id: this.enrollment.id.toString(),
      schoolType: this.enrollment.schoolType,
      classNumber: this.enrollment.classNumber,
      section: this.enrollment.section,
      dataProcessingConsent: this.enrollment.dataProcessingConsent.toString(),
      exitAuthorization: this.enrollment.exitAuthorization.toString(),
      parentNotes: this.enrollment.notes.parent,
      managerNotes: this.enrollment.notes.manager,
      teamId: this.enrollment.team.id?.toString(),
      shirtId: this.enrollment.shirt.id?.toString(),
    }

    this.api.updateEnrollmentById(res).subscribe({
      next: (data) => {
        this.router.navigate(['/admin/enrollments']);
      }
    });
  }
}
