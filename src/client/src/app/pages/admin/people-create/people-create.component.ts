import { Component, computed, inject, signal } from '@angular/core';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { ChildComponent } from '../../../components/child/child.component';
import { ParentComponent } from '../../../components/parent/parent.component';
import { FormsModule } from '@angular/forms';
import { Child, Parent } from '../../../../models/Family.model';
import { ApiService } from '../../../../services/api.service';

import { UtilsService } from '../../../../services/utils.service';
import { FamilyEnrollmentCreateRequest } from '../../../../models/Request.model';

@Component({
  selector: 'app-people-create',
  imports: [
    FooterComponent,
    NavbarComponent,
    ChildComponent,
    ParentComponent,
    FormsModule
],
  templateUrl: './people-create.component.html',
})
export class PeopleCreateComponent {
  private api = inject(ApiService);
  private utils = inject(UtilsService);

  readonly error = signal<string | null>(null);

  readonly parents = signal<Array<Parent | null>>([null, null]);
  readonly childs = signal<Array<Child | null>>([null]);

  // Prima era un solo array `isValid` in cui i genitori occupavano la prima
  // meta' e i figli la seconda. Ridurre il numero di figli faceva splice
  // all'indice sbagliato (senza sommare il numero di genitori), invalidando
  // le flag dei genitori. Due array separati tolgono del tutto quel calcolo.
  private readonly parentsValid = signal<boolean[]>([false, false]);
  private readonly childsValid = signal<boolean[]>([false]);

  readonly isFieldsValid = computed(
    () =>
      this.parentsValid().every((valid) => valid) &&
      this.childsValid().every((valid) => valid)
  );

  changeParentsLength(length: number) {
    this.parents.update((parents) => resize(parents, length, null));
    this.parentsValid.update((valid) => resize(valid, length, false));
  }

  changeChildsLength(length: number) {
    this.childs.update((childs) => resize(childs, length, null));
    this.childsValid.update((valid) => resize(valid, length, false));
  }

  onParentChange(parent: Parent | null, index: number) {
    this.parents.update((parents) =>
      parents.map((p, i) => (i === index ? parent : p))
    );
  }

  onIsParentValidChange(isValid: boolean, index: number) {
    this.parentsValid.update((valid) =>
      valid.map((v, i) => (i === index ? isValid : v))
    );
  }

  // event when something was edited, passed something and add to array
  onChildChange(child: Child | null, index: number) {
    this.childs.update((childs) =>
      childs.map((c, i) => (i === index ? child : c))
    );
    this.childsValid.update((valid) =>
      valid.map((v, i) =>
        i === index ? child !== null && child.name !== '' : v
      )
    );
  }

  onIsChildValidChange(isValid: boolean, index: number) {
    this.childsValid.update((valid) =>
      valid.map((v, i) => (i === index ? isValid : v))
    );
  }

  onCreateFamily() {
    if (!this.isFieldsValid()) return;
    // create family with parents and children

    const data: FamilyEnrollmentCreateRequest = {
      childs: this.childs()
        .filter((child) => child !== null)
        .map((child) => {
          return {
            ...child,
            enrollments: [],
          };
        }),
      parents: this.parents().filter((parent) => parent !== null),
    };

    this.api.createFamilyWithEnrollment(data).subscribe({
      next: () => {
        window.location.href = '/admin/people';
      },
      error: (error) => {
        console.error(error);
        // Prima questa riga assegnava il parametro locale `error` invece del
        // campo del componente, quindi il riquadro d'errore non compariva mai.
        this.error.set(this.utils.handleResponse(error, '/admin/people'));
      },
    });
  }
}

// Porta l'array alla lunghezza richiesta, riempiendo con `fill` se cresce.
function resize<T>(array: T[], length: number, fill: T): T[] {
  if (array.length === length) return array;
  if (array.length > length) return array.slice(0, length);

  return [...array, ...Array(length - array.length).fill(fill)];
}
