export interface SuccessResult<T> {
  success: true;
  data: T;
}

export interface ErrorResult<T = string> {
  success: false;
  error: T;
}

export type Result<TSucc, TErr = string> =
  | SuccessResult<TSucc>
  | ErrorResult<TErr>;
