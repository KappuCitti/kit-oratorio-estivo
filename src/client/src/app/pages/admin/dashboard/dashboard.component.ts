import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApiService } from '../../../../services/api.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AttendancesStat } from '../../../../models/Stat.model';
import { toDateOnly } from '../../../../services/utils.service';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, FooterComponent, FontAwesomeModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);

  // TODO - Nessun endpoint espone il numero totale di utenti in rubrica:
  // questa casella resta a 0 finche' non viene aggiunto lato server.
  peopleCount: number = 0;
  enrollmentsCount: number = 0;
  attendanceStats: AttendancesStat | null = null;
  attendanceCount: number = 0;

  ngOnInit(): void {
    const today = toDateOnly(new Date());

    // Ogni richiesta ha il proprio catchError: con `zip` (o `forkJoin` nudo) il
    // fallimento di una sola statistica faceva fallire l'intero stream e la
    // dashboard restava a zero su tutte le caselle, anche su quelle che il
    // server aveva gia' restituito correttamente.
    forkJoin({
      enrollments: this.api
        .getEnrollments({ year: new Date().getFullYear() })
        .pipe(catchError(() => of(null))),
      stats: this.api
        .getAttendancesStat(today)
        .pipe(catchError(() => of(null))),
      attendances: this.api
        .getAttendances({ date: today })
        .pipe(catchError(() => of(null))),
    }).subscribe(({ enrollments, stats, attendances }) => {
      if (enrollments?.status === 200 && enrollments.body?.success) {
        this.enrollmentsCount = enrollments.body.data.count;
      }
      if (stats?.status === 200 && stats.body?.success) {
        this.attendanceStats = stats.body.data;
      }
      if (attendances?.status === 200 && attendances.body?.success) {
        this.attendanceCount = attendances.body.data.length;
      }
    });
  }
}
