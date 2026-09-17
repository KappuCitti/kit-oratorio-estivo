import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import type { EnrollmentFormValue } from '../../../components/enrollment/enrollment.component';
import Enrollment from '../../../../models/Enrollment.model';
import { UtilsService } from '../../../../services/utils.service';
import { EnrollmentComponent } from '../../../components/enrollment/enrollment.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ApiService } from '../../../../services/api.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { EnrollmentUpdateRequest } from '../../../../models/Request.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-enrollments-edit',
  imports: [
    EnrollmentComponent,
    NavbarComponent,
    FooterComponent,
    LoadingComponent,
    DatePipe,
  ],
  templateUrl: './enrollments-edit.component.html',
})
export class EnrollmentsEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private utils = inject(UtilsService);
  private api = inject(ApiService);

  id: number | null = null;
  readonly loading = signal(true);
  readonly enrollment = signal<Enrollment | null>(null);
  readonly error = signal<string | null>(null);

  /** I valori correnti del form, emessi da app-enrollment. */
  private modifiche: EnrollmentFormValue | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.id = Number.isInteger(id) && id > 0 ? id : null;

    if (!this.id) {
      this.router.navigateByUrl('/admin/enrollments');
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

  onEnrollmentChange(value: EnrollmentFormValue) {
    this.modifiche = value;
  }

  saveEnrollment = () => {
    const id = this.id;
    const modifiche = this.modifiche;
    const corrente = this.enrollment();

    // schoolId e classId sono obbligatori nel form: se mancano, il form non e'
    // valido e il pulsante di salvataggio non e' nemmeno attivo.
    if (!id || !corrente || !modifiche?.schoolId || !modifiche?.classId) return;

    const params: EnrollmentUpdateRequest = {
      id,
      schoolId: modifiche.schoolId,
      classId: modifiche.classId,
      section: modifiche.section,
      year: corrente.year,
      team: modifiche.team,
      shirt: modifiche.shirt,
      dataProcessingConsent: modifiche.dataProcessingConsent,
      exitAuthorization: modifiche.exitAuthorization,
      // Il server vuole `id` della settimana, non `weekId`.
      weeks: modifiche.weeks.map((week) => ({
        id: week.weekId,
        isPaid: week.isPaid,
      })),
      parentNotes: modifiche.parentNotes,
      managerNotes: modifiche.managerNotes,
    };

    this.api.updateEnrollment(params).subscribe({
      next: () => {
        this.error.set(null);
        // Si rilegge dal server invece di ricostruire l'iscrizione a mano: cosi'
        // quello che si vede e' quello che e' stato davvero salvato.
        this.api.getEnrollmentById(id).subscribe((response) => {
          if (response.body?.success) this.enrollment.set(response.body.data);
        });
      },
      error: (error) => {
        console.log(error);
        this.error.set(this.utils.handleResponse(error, null));
      },
    });
  };
}
