/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
export interface AttendanceResponse {
  childId: number,
  enrollmentId: number
  name: string
  surname: string
  gender: string

  // Attendance references
  attendance: Attendance
}

export default interface Attendance {
  id?: number
  present: boolean
  eatsAtOratory: boolean
  eatsInBianco: boolean
  movements: Movement[]
}

export interface Movement {
  id: number
  type: string
  time: string
  notes: string
}

export interface MovementResponse {
  childId: number,
  enrollmentId: number
  name: string
  surname: string
  gender: string

  // Movement references
  movements: Movement[]
}