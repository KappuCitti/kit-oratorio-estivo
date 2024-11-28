/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { offset } from '@popperjs/core';
import { SearchPoeple } from 'src/models/Poeple';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  searchForm!: FormGroup;
  people: SearchPoeple[] = [];
  personToDelete: SearchPoeple | null = null;
  loading = true;

  total: number = 0;
  limit: number = 25;
  offset = 0;


  constructor(private api: ApiService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      name: [''],
      surname: [''],
      context: [''],
    })
  }

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.loading = true;
    this.people = [];

    this.api.searchPeople(this.searchForm.get('name')?.value, this.searchForm.get('surname')?.value, this.searchForm.get('context')?.value, this.limit, this.offset).subscribe({
      next: (data) => {
        this.people = data.body?.data || [];
        this.total = data.body?.total || 0;
        this.loading = false;
      }
    })
  }

  setPersonToDelete(person: any) {
    this.personToDelete = person;
  }

  deletePerson() {
    if (this.personToDelete?.context === 'Child') {
      this.api.deleteChildById(this.personToDelete.id.toString()).subscribe({
        next: () => {
          this.ngOnInit();
        }
      })
    } else if (this.personToDelete?.context === 'Parent') {
      this.api.deleteParentById(this.personToDelete.id.toString()).subscribe({
        next: () => {
          this.ngOnInit();
        }
      })
    }
  }

  onPageChange(page: number) {
    this.offset = (page - 1) * this.limit;
    this.search();
  }

  onSizeChange(limit: number) {
    this.limit = limit;
    this.search();
  }
}
