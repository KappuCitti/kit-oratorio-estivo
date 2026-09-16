import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Enrollment from '../../../../models/Enrollment.model';
import { UtilsService } from '../../../../services/utils.service';
import { EnrollmentComponent } from '../../../components/enrollment/enrollment.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ApiService } from '../../../../services/api.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ChildComponent } from '../../../components/child/child.component';
import { ParentComponent } from '../../../components/parent/parent.component';
import { EnrollmentUpdateRequest } from '../../../../models/Request.model';

@Component({
  selector: 'app-enrollments-edit',
  imports: [
    EnrollmentComponent,
    NavbarComponent,
    FooterComponent,
    LoadingComponent,
    ChildComponent,
    ParentComponent,
  ],
  templateUrl: './enrollments-edit.component.html',
})
export class EnrollmentsEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private utils = inject(UtilsService);
  private api = inject(ApiService);

  id: string | null = null;
  readonly loading = signal(true);
  readonly enrollment = signal<Enrollment | null>(null);
  readonly error = signal<string | null>(null);

  updatedEnrollment: Enrollment | null = null;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (!this.id) {
      window.location.href = '/admin/enrollments';
    } else {
      this.api.getEnrollmentById(this.id).subscribe({
        next: (response) => {
          if (response.status === 200 && response.body?.success) {
            this.enrollment.set(response.body.data);

            this.loading.set(false);
          }
        },
        error: (error) => {
          console.log(error);
          this.error.set(this.utils.handleResponse(error, null));
          this.loading.set(false);
        },
      });
    }
  }

  onEnrollmentChange(event: Enrollment | null) {
    this.updatedEnrollment = event;
  }

  saveEnrollment = () => {
    console.table({
      dataProcessingConsent: this.updatedEnrollment?.dataProcessingConsent,
      exitAuthorization: this.updatedEnrollment?.exitAuthorization,
    });

    if (
      this.enrollment() &&
      this.updatedEnrollment &&
      this.updatedEnrollment.id
    ) {
      const params: EnrollmentUpdateRequest = {
        id: this.updatedEnrollment?.id,
        schoolType: this.updatedEnrollment?.schoolType,
        className: this.updatedEnrollment?.className,
        section: this.updatedEnrollment?.section,
        year: this.updatedEnrollment?.year,
        team: this.updatedEnrollment?.team?.id || null,
        shirt: this.updatedEnrollment?.shirt?.id || null,
        dataProcessingConsent: this.updatedEnrollment?.dataProcessingConsent,
        exitAuthorization: this.updatedEnrollment?.exitAuthorization,
        weeks: this.updatedEnrollment?.weeks.map((week) => ({
          id: week.id,
          isPaid: week.isPaid,
        })),
        parentNotes: this.updatedEnrollment?.parentNotes || null,
        managerNotes: this.updatedEnrollment?.managerNotes || null,
      };

      this.api.updateEnrollment(params).subscribe({
        next: (response) => {
          if (response.status === 200)
            this.enrollment.set(this.updatedEnrollment);
        },
        error: (error) => {
          console.log(error);
          this.error.set(this.utils.handleResponse(error, null));
        },
      });
    }
  };
}
