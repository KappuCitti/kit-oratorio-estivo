export type Response<T> = ResponseSuccess<T> | ResponseError | RequestZodError;
export type PagedResponse<T> = ResponseSuccess<Paged<T>> | ResponseError;

interface ResponseError {
  success: false;

  error: string;
}

interface RequestZodError {
  success: false;

  error: string[];
}

interface ResponseSuccess<T> {
  success: true;

  data: T;
}

export interface Paged<T> {
  count: number;
  elements: T[];
}
