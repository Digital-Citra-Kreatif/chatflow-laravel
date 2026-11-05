import { describe, expect, it } from 'vitest';
import { displayValue } from '@chatflow/submissions/model';
import { answerText, optionLabels } from '@/lib/format';

describe('answers for reading', () => {
  const step = { options: [{ value: 'something_else', label: 'Something else' }, { value: 'pro', label: 'Pro plan' }, { value: 'other', label: 'Other' }] };
  const labels = optionLabels(step);

  it('shows a choice as the label the visitor chose', () => {
    expect(answerText('something_else', displayValue, labels)).toBe('Something else');
    expect(answerText(['pro', 'something_else'], displayValue, labels)).toBe('Pro plan, Something else');
    expect(answerText({ value: 'other', other: 'A friend told me' }, displayValue, labels)).toBe('Other: A friend told me');
  });

  it('leaves what has no option as it is', () => {
    // A value since taken out of the form, a typed answer, and a question without options.
    expect(answerText('retired_plan', displayValue, labels)).toBe('retired_plan');
    expect(answerText('Ada', displayValue, undefined)).toBe('Ada');
    expect(optionLabels({ options: [] })).toBeUndefined();
    expect(optionLabels(undefined)).toBeUndefined();
    expect(answerText(true, displayValue, labels)).toBe('Yes');
  });

  it('does not take an inherited name for an option', () => {
    expect(answerText('constructor', displayValue, labels)).toBe('constructor');
  });
});
