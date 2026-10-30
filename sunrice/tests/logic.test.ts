import { describe, expect, it } from 'vitest';
import type { FormSchema } from '@chatflow/builder/api';
import { actionText, conditionText, newRule } from '@/lib/logic';

const schema = {
  steps: [
    { id: 's1', key: 'plan', label: 'Plan', type: 'single_choice', messages: [], required: true },
    { id: 's2', key: 'email', label: 'Email', type: 'email', messages: [], required: false },
  ],
  endings: [{ id: 'e1', type: 'message', messages: [] }, { id: 'e2', type: 'message', messages: [] }],
} as unknown as FormSchema;

describe('logic text', () => {
  it('describes nested conditions', () => {
    expect(conditionText({ all: [
      { field: 'email', op: 'is_not_empty' },
      { any: [{ field: 'plan', op: 'in', value: ['pro', 'team'] }, { field: 'score', source: 'variable', op: 'gte', value: 5 }] },
    ] }, schema)).toBe('Email is answered and (Plan is one of pro, team or Variable score is at least 5)');
    expect(conditionText({ all: [] }, schema)).toBe('always');
  });

  it('describes actions', () => {
    expect(actionText({ action: 'jump', to: 's2' }, schema)).toBe('Go to Email');
    expect(actionText({ action: 'end', to: 'e2' }, schema)).toBe('End with ending 2');
    expect(actionText({ action: 'set_variable', key: 'score', operation: 'add', value: 5 }, schema)).toBe('Set variable score + 5');
  });

  it('starts a rule that goes to the next step', () => {
    expect(newRule(schema, 's1')).toEqual({ if: { all: [{ field: 'plan', source: 'answer', op: 'eq', value: '' }] }, then: { action: 'jump', to: 's2' } });
  });
});
