import { DatePipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-enrollments-search',
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    FaIconComponent,
    RouterLink,
  ],
  templateUrl: './enrollments-search.component.html',
  styleUrl: './enrollments-search.component.css',
})
export class EnrollmentsSearchComponent {
  faPlus = faPlus;

  // TODO - Replace with real data from the backend
  user = {
    fullName: 'Mario Rossi',
    email: 'mario@example.com',
    children: [
      {
        fullName: 'Giulia Rossi',
        birthDate: '2012-05-15',
        cf: 'RSSGLI12E55H501Y',
        isEnrolled: true,
      },
      {
        fullName: 'Luca Rossi',
        birthDate: '2015-09-21',
        cf: 'RSSLCA15P21H501Y',
        isEnrolled: false,
      },
    ],
  };
}
