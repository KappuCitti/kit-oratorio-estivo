import { Component } from '@angular/core';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { ChildComponent } from '../../../components/child/child.component';
import { ParentComponent } from '../../../components/parent/parent.component';
import { FormsModule } from '@angular/forms';
import { Child, Parent } from '../../../../models/Family.model';
import { ApiService } from '../../../../services/api.service';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../../services/utils.service';
import { FamilyEnrollmentCreateRequest } from '../../../../models/Request.model';

@Component({
  selector: 'app-people-create',
  imports: [
    FooterComponent,
    NavbarComponent,
    ChildComponent,
    ParentComponent,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './people-create.component.html',
  styleUrl: './people-create.component.css',
})
export class PeopleCreateComponent {
  error: string | null = null;

  parents: Array<Parent | null> = [];
  childs: Array<Child | null> = [];

  isValid: boolean[] = [];

  constructor(private api: ApiService, private utils: UtilsService) {
    this.changeArrayLength(this.parents, 2);
    this.changeArrayLength(this.childs, 1);

    // the first half is dedicated to parents, the second half to childs
    this.isValid = new Array(this.parents.length + this.childs.length).fill(
      false
    );
  }

  changeArrayLength(array: Array<any>, length: number) {
    if (array.length < length) {
      for (let i = array.length; i < length; i++) {
        array.push(null);
        this.isValid.push(false);
      }
    } else {
      array.splice(length);
      this.isValid.splice(length);
    }
  }

  onParentChange(parent: Parent | null, index: number) {
    this.parents[index] = parent;

    this.logAll();
  }

  onIsParentValidChange(isValid: boolean, index: number) {
    this.isValid[index] = isValid;
  }

  // event when something was edited, passed something and add to array
  onChildChange(child: Child | null, index: number) {
    this.childs[index] = child;
    this.isValid[index + this.parents.length] =
      child !== null && child.name !== '';

    this.logAll();
  }

  onIsChildValidChange(isValid: boolean, index: number) {
    this.isValid[index + this.parents.length] = isValid;
  }

  // return tree if all fields are valid
  isFieldsValid() {
    return this.isValid.every((isValid) => isValid);
  }

  logAll() {
    console.log('Logging all parents and childs');
    console.log(this.parents);
    console.log(this.childs);
    console.log(this.isValid);
    console.log(this.isFieldsValid());
  }

  onCreateFamily() {
    if (!this.isFieldsValid()) return;
    // create family with parents and children

    const data: FamilyEnrollmentCreateRequest = {
      childs: this.childs
        .filter((child) => child !== null)
        .map((child) => {
          return {
            ...child,
            enrollments: [],
          };
        }),
      parents: this.parents.filter((parent) => parent !== null),
    };

    this.api.createFamilyWithEnrollment(data).subscribe({
      next: (response) => {
        console.log(response);
        window.location.href = '/admin/people';
      },
      error: (error) => {
        console.error(error);
        error = this.utils.handleResponse(error, '/admin/people');
      },
    });
  }
}
