/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
export interface SearchPoeple {
  name: string
  surname: string
  context: 'Parent' | 'Child'
  gender: string
  id: number
}