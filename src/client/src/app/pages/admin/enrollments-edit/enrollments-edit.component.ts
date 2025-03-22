import {
  Component,
  EventEmitter,
  ModelSignal,
  OnInit,
  Signal,
} from '@angular/core';
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
  styleUrl: './enrollments-edit.component.css',
})
export class EnrollmentsEditComponent implements OnInit {
  id: string | null = null;
  loading: boolean = true;
  enrollment: Enrollment | null = null;
  error: string | null = null;

  updatedEnrollment: Enrollment | null = null;

  constructor(
    private route: ActivatedRoute,
    private utils: UtilsService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (!this.id) {
      window.location.href = '/admin/enrollments';
    } else {
      this.api.getEnrollmentById(this.id).subscribe({
        next: (response) => {
          if (response.status === 200 && response.body?.data) {
            this.enrollment = response.body?.data;

            console.log(this.enrollment.family.parents);

            this.loading = false;
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = this.utils.handleResponse(error, null);
        },
      });
    }
  }

  onEnrollmentChange(event: Enrollment | null) {
    this.updatedEnrollment = event;
  }

  saveEnrollment = () => {
    console.log('Save function for update Enrollment:');
    console.table({
      dataProcessingConsent: this.updatedEnrollment?.dataProcessingConsent,
      exitAuthorization: this.updatedEnrollment?.exitAuthorization,
    });
    console.log(this.updatedEnrollment);

    if (
      this.enrollment &&
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
          if (response.status === 200) this.enrollment = this.updatedEnrollment;
        },
        error: (error) => {
          console.log(error);
          this.error = this.utils.handleResponse(error, null);
        },
      });
    }
  };
}
