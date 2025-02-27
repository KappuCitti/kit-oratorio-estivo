import type { ZodError, ZodIssue } from 'zod';

export function parseZodError(error: ZodError) {
  const issues = error.issues.map(parseIssue);
  return issues;
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
