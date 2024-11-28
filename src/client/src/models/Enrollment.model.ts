/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
export default interface Enrollment {
  id: number
  schoolType: string
  classNumber: string
  section: string
  dataProcessingConsent: boolean
  exitAuthorization: boolean,
  year: number
  timestamp: string
  shirt: Shirt
  notes: Note
  team: Team
  weeks: Week[]
  tree: Tree
}

export interface Shirt {
  id: number
  size: string
  width?: number
  height?: number
  avaiable?: boolean
}

export interface Note {
  parent: string
  manager: string
}

export interface Team {
  id: number
  name: string
  color: string
}

export interface Week {
  id: number
  start: string
  end: string
  payed?: boolean
  enrolled?: boolean,
  price?: number
}

export interface Tree {
  child: Child
  parents: Parent[]
}

export interface Child {
  id?: number
  name: string
  surname: string
  gender: string
  birthDate: string
  birthPlace: string
  address?: Address
}

export interface Address {
  city: string
  street: string
  zip: string
  country: string
}

export interface Parent {
  id?: number
  name: string
  surname: string
  gender: string
  phone?: string
  email?: string
}
