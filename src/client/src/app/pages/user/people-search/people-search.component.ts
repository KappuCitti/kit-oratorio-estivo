import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ParentComponent } from '../../../components/parent/parent.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { Child, FamilyMember, Parent } from '../../../../models/Family.model';
import { ChildComponent } from '../../../components/child/child.component';
import { FamilyMemberComponent } from '../../../components/family-member/family-member.component';

@Component({
  selector: 'app-people-search',
  imports: [
    NavbarComponent,
    FooterComponent,
    ParentComponent,
    FaIconComponent,
    RouterLink,
    FamilyMemberComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './people-search.component.html',
})
export class PeopleSearchComponent implements OnInit {
  private api = inject(ApiService);

  // TODO - Load personal data schedule from the backend
  // TODO - Load other adults data from the backend
  // TODO - Load children data from the backend

  faPlus = faPlus;

  user: any;
  parent: Parent | null = null;
  childs: FamilyMember[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.api.getManagedPeople().subscribe({
      next: (response) => {
        if (response.status == 200 && response.body?.success) {
          console.log(response.body.data);
          this.childs = response.body.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading data', error);
      },
    });
  }
}
