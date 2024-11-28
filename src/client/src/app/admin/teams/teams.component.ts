/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Team } from 'src/models/Enrollment.model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  viewTeamForm: FormGroup;

  confirmDeleteTeamFrom: FormGroup;
  deleteTeamCheck: boolean = false;

  teams: Team[] = [];
  selectedTeam: Team | null = null;

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.viewTeamForm = this.fb.group({
      name: ['', [Validators.required]],
      color: ['#000000', [Validators.required]]
    });

    this.confirmDeleteTeamFrom = this.fb.group({
      confirm: [this.deleteTeamCheck, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    this.api.getAllTeams().subscribe(res => {
      this.teams = res.body?.data || [];
    });
  }

  selectTeam(team: Team | null) {
    this.selectedTeam = team;

    if (team) {
      this.viewTeamForm.patchValue(team);
    } else {
      this.viewTeamForm.reset({
        name: '',
        color: '#000000'
      });
    }
  }

  saveTeam() {
    if (this.viewTeamForm.valid) {
      const name = this.viewTeamForm.get('name')?.value;
      const color = this.viewTeamForm.get('color')?.value;

      if (this.selectedTeam) {
        this.api.updateTeamById(this.selectedTeam.id.toString(), name, color).subscribe(() => {
          this.selectTeam(null);
          this.ngOnInit();
        });
      } else {
        this.api.createTeam(name, color).subscribe(() => {
          this.selectTeam(null);
          this.ngOnInit();
        });
      }
    }
  }

  updateDeleteTeamCheck() {
    this.deleteTeamCheck = this.confirmDeleteTeamFrom.get('confirm')?.value;
  }

  deleteTeam() {
    if (this.selectedTeam) {
      this.api.deleteTeamById(this.selectedTeam.id.toString(), this.deleteTeamCheck).subscribe(() => {
        this.selectTeam(null);

        this.confirmDeleteTeamFrom.reset();
        this.deleteTeamCheck = false;

        this.ngOnInit();
      });
    }
  }
}
