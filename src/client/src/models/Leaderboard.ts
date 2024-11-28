/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Team } from "./Enrollment.model";
import User from "./User.model";

export default interface Leaderboard {
  team: Team
  points: number;
}

export interface Score {
  id: number
  team: Team
  points: number
  date: Date
  reason: string
  user?: User
}