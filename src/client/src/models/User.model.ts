/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
export default interface User {
  id: number;
  name: string;
  surname: string;
  email?: string;
  theme?: string;
}