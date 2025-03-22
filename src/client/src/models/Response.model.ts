export type Response<T> = ResponseSuccess<T> | ResponseError | RequestErrror;

interface ResponseError {
  success: false;
  error: string;

  data?: undefined;
}

interface RequestErrror {
  success: false;
  error: string[];

  data?: undefined;
}

interface ResponseSuccess<T> {
  success: boolean;
  data: T;

  error?: string;
}
