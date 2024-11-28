/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, OnInit } from '@angular/core';
import Leaderboard from 'src/models/Leaderboard';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-leaderboard-ranks',
  templateUrl: './leaderboard-ranks.component.html',
  styleUrls: ['./leaderboard-ranks.component.scss']
})
export class LeaderboardRanksComponent implements OnInit {
  leaderboard: Leaderboard[] = [];
  loading: boolean = false;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    const now = new Date();
    this.loading = true;

    this.api.getLeaderboard(now.getFullYear().toString()).subscribe((data) => {
      this.leaderboard = data.body?.data || [];
    });
  }
}
