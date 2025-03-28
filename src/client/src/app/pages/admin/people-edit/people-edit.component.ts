import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Child, ChildResponse, Parent, ParentResponse } from '../../../../models/Family.model';
import { ApiService } from '../../../../services/api.service';
import { UtilsService } from '../../../../services/utils.service';
import { FooterComponent } from "../../../components/footer/footer.component";
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { ParentComponent } from "../../../components/parent/parent.component";
import { ChildComponent } from "../../../components/child/child.component";
import Enrollment from '../../../../models/Enrollment.model';

@Component({
  selector: 'app-people-edit',
  imports: [FooterComponent, NavbarComponent, ParentComponent, ChildComponent],
  templateUrl: './people-edit.component.html',
  styleUrl: './people-edit.component.css'
})
export class PeopleEditComponent implements OnInit {
  type: 'child' | 'parent' | null = null;
  id: number | null = null;
  person: ParentResponse | ChildResponse | null = null;
  personCopy: Child | Parent | null = null;

  loading: boolean = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private api: ApiService, private utils: UtilsService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const type = params.get('type');
      if (type == 'child') this.type = 'child';
      else if (type == 'parent') this.type = 'parent';


      const id = params.get('id');
      if (id) this.id = Number.isNaN(parseInt(id)) ? null : parseInt(id);

      if (!this.type || !this.id) window.location.href = '/admin/people';

      this.loadPerson();

    });
  }

  loadPerson() {
    if (!this.type || !this.id) return;
    this.loading = true;

    if (this.type == 'parent') {
      this.api.getParentById(this.id).subscribe({
        next: (response) => {
          if (response.status == 200 && response.body?.data)
            this.person = response.body?.data;
          this.loading = false;
        },
        error: (error) => {
          console.error(error);
          this.error = this.utils.handleResponse(error, null);
          this.loading = false;
        },
      });
    } else if (this.type == 'child') {

      this.api.getChildById(this.id).subscribe({
        next: (response) => {
          if (response.status == 200 && response.body?.data)
            this.person = response.body?.data;
          this.loading = false;
        },
        error: (error) => {
          console.error(error);
          this.error = this.utils.handleResponse(error, null);
          this.loading = false;
        },
      });
    }
  }

  isParent(person: any): person is Parent {
    return this.type == 'Parent'.toLowerCase();
  }

  isChild(person: any): person is Child {
    return this.type == 'Child'.toLowerCase();
  }

  onPersonEdited(person: Child | Parent | null) {
    this.personCopy = person;
  }

  save = () => {
    console.log('Saving...');

    console.table({
      id: this.id,
      type: this.type,
      person: this.person?.surname,
      isParent: this.isParent(this.person),
      isChild: this.isChild(this.person)
    })

    if (this.isParent(this.personCopy)) {
      console.log('Saving parent');
      this.api.updateParent(this.personCopy).subscribe({
        next: (response) => {
          this.loading = false;
        },
        error: (error) => {
          console.error(error);
          this.error = this.utils.handleResponse(error, '/admin/people');
          this.loading = false;
        },
      })
    } else if (this.isChild(this.personCopy)) {
      console.log('Saving child');
      this.api.updateChild(this.personCopy).subscribe({
        next: (response) => {
          this.loading = false;
        },
        error: (error) => {
          console.error(error);
          this.error = this.utils.handleResponse(error, '/admin/people');
          this.loading = false;
        },
      })
    }
  }
}
