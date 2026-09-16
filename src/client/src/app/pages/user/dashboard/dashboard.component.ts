import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  // TODO - Add same data like total family members, total enrollments, total trips, payments needed, next subscribed trips, etc.
}
