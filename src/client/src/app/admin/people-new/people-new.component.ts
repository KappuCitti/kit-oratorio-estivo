/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address, Child, Parent, Tree } from 'src/models/Enrollment.model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-people-new',
  templateUrl: './people-new.component.html',
  styleUrls: ['./people-new.component.scss']
})
export class PeopleNewComponent implements OnInit {
  parentOne: Parent | null = null;
  parentTwo: Parent | null = null;
  child: Child | null = null;
  address: Address | null = null;
  res: {tree: Tree} = {tree: {child: {name: '', surname: '', gender: '', birthDate: '', birthPlace: '', address: {city: '', street: '', zip: '', country: ''}}, parents: []}};

  isValid: boolean[] = [false, false, false, false]; // [parentOne, parentTwo, child, address]

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  updateParentOne(parent: Parent) {
    this.parentOne = parent;
    this.res.tree.parents[0] = this.parentOne;
  }

  updateParentTwo(parent: Parent) {
    this.parentTwo = parent;
    this.res.tree.parents[1] = this.parentTwo;
  }

  updateChild(child: Child) {
    this.child = child;
    this.res.tree.child = this.child;
  }

  updateAddress(address: Address) {
    this.address = address;
    this.res.tree.child.address = this.address;
  }

  updateValidParentOne(valid: boolean) {
    this.isValid[0] = valid;
  }

  updateValidParentTwo(valid: boolean) {
    this.isValid[1] = valid;
  }

  updateValidChild(valid: boolean) {
    this.isValid[2] = valid;
  }

  updateValidAddress(valid: boolean) {
    this.isValid[3] = valid;
  }

  create() {
    this.api.createTree(this.res.tree).subscribe(res => {
      if (res.body?.error == null) {
        this.router.navigate(['/admin/people']);
      }
    });
  }
}
