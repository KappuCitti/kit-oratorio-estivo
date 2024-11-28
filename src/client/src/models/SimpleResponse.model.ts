/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
export interface ValidResponse<T> {
  data: T;
  error: null;
  total?: number;
}

export interface ErrorResponse {
  data: null;
  error: string;
  total: null;
}

export type Response<T> = ValidResponse<T> | ErrorResponse;