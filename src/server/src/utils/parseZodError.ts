import type { ZodError, ZodIssue } from 'zod';

/**
 * Riduce un ZodError a una singola stringa leggibile.
 *
 * Il contratto OpenAPI dichiara `error: z.string()`: serializzare l'oggetto
 * ZodError intero violava il contratto e mostrava al client la struttura
 * interna degli schemi.
 */
export function parseZodError(error: ZodError): string {
  return error.issues.map(parseIssue).join('; ');
}

export function parseIssue(issue: ZodIssue) {
  switch (issue.code) {
    case 'invalid_type':
      if (issue.received === 'undefined')
        return `Missing required field '${issue.path.join('.')}'`;
      return `Invalid type for field '${issue.path.join('.')}', expected '${
        issue.expected
      }' but got '${issue.received}'`;
  }
  return issue.message;
}
