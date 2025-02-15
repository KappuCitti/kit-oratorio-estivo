import type { ErrorResult, SuccessResult } from '@/models/result.model';

export function createSuccessResult<T>(data: T): SuccessResult<T> {
  return {
    success: true,
    data,
  };
}

export function createErrorResult<T>(error: T): ErrorResult<T> {
  return {
    success: false,
    error,
  };
}
