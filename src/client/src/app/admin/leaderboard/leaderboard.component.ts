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
import Leaderboard, { Score } from 'src/models/Leaderboard';
import { ApiService } from 'src/services/api.service';

type Type = 'edit' | 'delete' | 'add' | null;

@Component({
  selector: 'app-ranking',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  scores: Score[] = [];
  loading: boolean = false;

  teams: Team[] = [];

  selectedScore: Score | null = null;
  selectedType: Type = null;

  scoreForm: FormGroup;

  total: number = 0;
  limit: number = 25;
  offset = 0;

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.scoreForm = this.fb.group({
      teamId: ['', [Validators.required]],
      date: [new Date().toLocaleDateString('en-CA'), [Validators.required]],
      points: ['', [Validators.required, Validators.pattern(/^-?[1-9][0-9]*$/)]],
      reason: [''],
    })
  }

  ngOnInit(): void {
    this.onCancel();

    const now = new Date();
    this.loading = true;

    this.api.getScores(now.getFullYear().toString(), this.limit, this.offset).subscribe((data) => {
      this.scores = data.body?.data || [];
      this.total = data.body?.total || 0;
      this.loading = false;
    });

    this.api.getAllTeams().subscribe(data => {
      if (data.body) {
        this.teams = data.body?.data || [];
      }
    });

    setInterval(() => {
      const invalid = [];
      const controls = this.scoreForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
    }, 1000);
  }

  setScore(score: Score | null) {
    this.selectedScore = score;

    if (score)
      this.scoreForm.patchValue({
        teamId: score.team.id,
        points: score.points,
        date: new Date(score.date).toLocaleDateString('en-CA'),
        reason: score.reason,
      });
    else
      this.scoreForm.reset();
  }

  setType(type: Type) {
    this.selectedType = type;
  }

  onCancel() {
    this.setScore(null);
    this.setType(null);
  }

  onSubmit() {
    if (!['edit', 'delete', 'add'].includes(this.selectedType!)) return;

    const scoreId = this.selectedScore?.id.toString();
    const data = {
      teamId: this.scoreForm.value.teamId,
      date: this.scoreForm.value.date,
      points: this.scoreForm.value.points,
      reason: this.scoreForm.value.reason,
    }

    switch (this.selectedType) {
      case 'add':
        if (this.scoreForm.invalid) return;
        this.api.addScore(data.teamId, data.date, data.points, data.reason).subscribe(() => {
          this.ngOnInit();
        });
        break;
      case 'edit':
        if (this.scoreForm.invalid) return;
        if (scoreId == null) return;
        this.api.updateScore(scoreId, data.teamId, data.date, data.points, data.reason).subscribe(() => {
          this.ngOnInit();
        });
        break;
      case 'delete':
        if (scoreId == null) return;
        this.api.deleteScore(scoreId).subscribe(() => {
          this.ngOnInit();
        });
        break;
    }
  }

  onPageChange(page: number) {
    this.offset = (page - 1) * this.limit;
    this.ngOnInit();
  }

  onSizeChange(limit: number) {
    this.limit = limit;
    this.ngOnInit();
  }
}
