import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../../../services/api.service';
import { zip } from 'rxjs';
import { AttendancesStat } from '../../../../models/Stat.model';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, FooterComponent, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  // faChevronDown = faChevronDown;
  peopleCount: number = 0;
  enrollmentsCount: number = 0;
  attendanceStats: AttendancesStat | null = null;
  attendanceCount: number = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    const now = new Date();
    zip(
      this.api.getEnrollments({ year: now.getFullYear() }),
      this.api.getAttendancesStat(now),
      this.api.getAttendances({ date: now.toISOString().split('T')[0] })
    ).subscribe({
      next: ([enrollments, attendances, attendanceCountData]) => {
        if (enrollments.status == 200 && enrollments.body?.success) {
          this.enrollmentsCount = enrollments.body.data.count;
        }
        if (attendances.status == 200 && attendances.body?.success) {
          this.attendanceStats = attendances.body.data;
        }
        if (
          attendanceCountData.status == 200 &&
          attendanceCountData.body?.success
        ) {
          this.attendanceCount = attendanceCountData.body.data.length;
        }
      },
      error: (err) => {
        console.error('Error fetching enrollments:', err);
      },
    });
  }
}
