import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ParentComponent } from '../../../components/parent/parent.component';

@Component({
  selector: 'app-people-search',
  imports: [NavbarComponent, FooterComponent, ParentComponent],
  templateUrl: './people-search.component.html',
  styleUrl: './people-search.component.css',
})
export class PeopleSearchComponent {
  // TODO - Load personal data schedule from the backend
  // TODO - Load other adults data from the backend
  // TODO - Load children data from the backend
}
