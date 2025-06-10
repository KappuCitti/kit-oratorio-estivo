import { getUserMessage, type Message } from '@/localization';
import { createErrorResult } from '@/utils/createResult';
import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

const DATABASE_SYMBOL = Symbol('DATABASE_ERROR');

export class DatabaseError<
  Code extends ContentfulStatusCode = ContentfulStatusCode
> extends Error {
  constructor(private _code: Code, private _message: Message) {
    super(_message);
  }

  get code() {
    return this._code;
  }

  get message() {
    return this._message;
  }

  toResponse(c: Context) {
    return c.json(
      createErrorResult(getUserMessage(c, this._message)),
      this._code
    );
  }

  get symbol() {
    return DATABASE_SYMBOL;
  }

  static isDatabaseError(error: unknown): error is DatabaseError {
    return (
      !!error &&
      typeof error === 'object' &&
      'symbol' in error &&
      error.symbol === DATABASE_SYMBOL
    );
  }
}
