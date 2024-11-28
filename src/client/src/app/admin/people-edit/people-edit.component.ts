/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address, Child, Parent, Tree } from 'src/models/Enrollment.model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-people-edit',
  templateUrl: './people-edit.component.html',
  styleUrls: ['./people-edit.component.scss']
})
export class PeopleEditComponent implements OnInit {
  context: string | null = null;
  id: string | null = null;

  tree: Tree | null = null;
  selectedChild: Child | null = null;
  selectedParent: Parent | null = null;
  address: Address | null = null;

  validParent: boolean = false;
  validChild: boolean = false;
  validAddress: boolean = false;

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.context = this.route.snapshot.paramMap.get('context');
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.context == null || this.id == null || !['parent', 'child'].includes(this.context)) this.router.navigate(['/admin/people']);
    else if (this.context == 'child')
      this.api.getChildById(this.id).subscribe({
        next: (data) => {
          if (data.body?.data == null || data.body?.data?.child == null) this.router.navigate(['/admin/people']);
          else {
            this.tree = data.body?.data;
            this.selectedChild = this.tree.child;
            this.address = this.selectedChild.address || {} as Address;
          }
        },
        error: (err) => {
          this.router.navigate(['/admin/people']);
        }
      })
    else if (this.context == 'parent')
      this.api.getParentById(this.id).subscribe({
        next: (data) => {
          if (data.body?.data == null || data.body?.data == null) this.router.navigate(['/admin/people']);
          else {
            this.selectedParent = data.body?.data;
          }
        },
        error: (err) => {
          this.router.navigate(['/admin/people']);
        }
      })
  }

  updateParent(parent: Parent) {
    this.selectedParent = parent;
  }

  updateChild(child: Child) {
    this.selectedChild = child;
  }

  updateAddress(address: Address) {
    this.address = address;
  }

  updateValidParent(valid: boolean) {
    this.validParent = valid;
  }

  updateValidChild(valid: boolean) {
    this.validChild = valid;
  }

  updateValidAddress(valid: boolean) {
    this.validAddress = valid;
  }

  update() {
    if (!this.id) return;

    if (this.context == 'child' && this.validChild && this.validAddress && this.selectedChild) {
      this.api.updateChildById(this.id?.toString(), this.selectedChild).subscribe({
        next: (data) => {
          if (this.id && this.address) {
            this.api.updateChildResidenceById(this.id?.toString(), this.address).subscribe({
              next: (data) => {
                window.location.reload();
              }
            })
          }
        }
      })
    }
    else if (this.context == 'parent' && this.validParent && this.selectedParent) {
      this.api.updateParentById(this.id?.toString(), this.selectedParent).subscribe({
        next: (data) => {
          window.location.reload();
        }
      })
    }
  }
}
