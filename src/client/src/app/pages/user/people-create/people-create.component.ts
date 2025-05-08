import { Component } from '@angular/core';
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { FooterComponent } from "../../../components/footer/footer.component";

@Component({
  selector: 'app-people-create',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './people-create.component.html',
  styleUrl: './people-create.component.css'
})
export class PeopleCreateComponent {

}
