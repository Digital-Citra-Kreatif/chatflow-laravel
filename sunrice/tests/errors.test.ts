import { describe, expect, it } from 'vitest';
import { ApiError, errorMessage } from '@chatflow/builder/api';

describe('errorMessage', () => {
  it('names the first validation problem and its place', () => {
    const error = new ApiError('cff_invalid_schema', 'Schema validation failed.', 422, {
      errors: [{ path: '/steps/2/options', code: 'missing_options', message: 'Choice fields need at least one option.' }, { path: '/endings/0/url', message: 'Redirect endings need a URL.' }],
    });
    expect(errorMessage(error)).toBe('Schema validation failed. /steps/2/options: Choice fields need at least one option. (and 1 more)');
  });

  it('keeps plain errors as they are', () => {
    expect(errorMessage(new ApiError('cff_forbidden', 'Not allowed.', 403))).toBe('Not allowed.');
    expect(errorMessage('nope')).toBe('An unexpected error occurred.');
  });
});
