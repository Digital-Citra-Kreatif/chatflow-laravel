import type { Condition, FormSchema, Rule } from '@chatflow/builder/api';
import { __, sprintf } from '@/lib/i18n';

/** A condition on one value (not a group). */
export type Predicate = Extract<Condition, { field: string }>;
export type Operator = Predicate['op'];
export type Source = NonNullable<Predicate['source']>;
export type ActionType = Rule['then']['action'];

export const OPERATORS: Operator[] = [
  'eq', 'neq', 'contains', 'not_contains', 'in', 'not_in', 'gt', 'gte', 'lt', 'lte', 'between',
  'is_empty', 'is_not_empty', 'starts_with', 'matches', 'date_before', 'date_after', 'age_gte',
];

export function operatorLabel(op: string): string {
  const labels: Record<string, string> = {
    eq: __('is'), neq: __('is not'), contains: __('contains'), not_contains: __('does not contain'), in: __('is one of'),
    not_in: __('is none of'), gt: __('is more than'), gte: __('is at least'), lt: __('is less than'), lte: __('is at most'),
    between: __('is between'), is_empty: __('is empty'), is_not_empty: __('is answered'), starts_with: __('starts with'),
    matches: __('matches the pattern'), date_before: __('is before'), date_after: __('is after'), age_gte: __('is at least (years old)'),
  };
  return labels[op] ?? op;
}

export function sourceLabel(source: Source): string {
  return { answer: __('Answer'), variable: __('Variable'), hidden: __('Hidden value'), url: __('URL parameter') }[source];
}

export function actionLabel(action: ActionType): string {
  const labels: Record<ActionType, string> = {
    show: __('Show'), hide: __('Hide'), jump: __('Go to'), require: __('Make required'), unrequire: __('Make optional'),
    end: __('End with'), set_variable: __('Set variable'),
  };
  return labels[action];
}

/** Operators that compare against no value, a list, or two values. */
export const noValue = (op: Operator) => op === 'is_empty' || op === 'is_not_empty';
export const listValue = (op: Operator) => op === 'in' || op === 'not_in';
export const rangeValue = (op: Operator) => op === 'between';

export function isPredicate(condition: Condition): condition is Predicate {
  return 'field' in condition;
}

/** A new condition on the first answer. */
export function newPredicate(schema: FormSchema): Predicate {
  return { field: schema.steps[0]?.key ?? 'field', source: 'answer', op: 'eq', value: '' };
}

/** A new rule: "if (all of) the first answer is …, go to the next step". */
export function newRule(schema: FormSchema, after?: string): Rule {
  const at = schema.steps.findIndex((step) => step.id === after);
  const target = schema.steps[at + 1] ?? schema.steps[0];
  return { if: { all: [newPredicate(schema)] }, then: { action: 'jump', to: target?.id ?? '' } };
}

function valueText(value: Predicate['value']): string {
  if (Array.isArray(value)) return value.map(String).join(', ');
  return value === undefined || value === null ? '' : String(value);
}

/** "Email address is answered and (Plan is one of pro, team)". */
export function conditionText(condition: Condition, schema: FormSchema): string {
  if ('all' in condition || 'any' in condition) {
    const items = 'all' in condition ? condition.all : condition.any;
    if (!items.length) return __('always');
    const joined = items.map((item) => (isPredicate(item) ? conditionText(item, schema) : `(${conditionText(item, schema)})`));
    return joined.join('all' in condition ? ` ${__('and')} ` : ` ${__('or')} `);
  }
  const source = condition.source ?? 'answer';
  const name = source === 'answer'
    ? (schema.steps.find((step) => step.key === condition.field)?.label || condition.field)
    : `${sourceLabel(source)} ${condition.field}`;
  return noValue(condition.op) ? `${name} ${operatorLabel(condition.op)}` : `${name} ${operatorLabel(condition.op)} ${valueText(condition.value)}`;
}

/** "Go to Email address", "End with Ending 2 · Thanks", "Set variable score + 5". */
export function actionText(then: Rule['then'], schema: FormSchema): string {
  if (then.action === 'set_variable') {
    const op = then.operation === 'add' ? '+' : then.operation === 'subtract' ? '−' : '=';
    return `${actionLabel('set_variable')} ${then.key} ${op} ${String(then.value)}`;
  }
  if (then.action === 'end') {
    const index = schema.endings.findIndex((ending) => ending.id === then.to);
    return `${actionLabel('end')} ${index >= 0 ? sprintf(__('ending %d'), index + 1) : then.to}`;
  }
  const step = schema.steps.find((item) => item.id === then.to);
  return `${actionLabel(then.action)} ${step ? step.label || step.key : then.to}`;
}
