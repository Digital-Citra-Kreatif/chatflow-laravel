import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@imajiner/admin-sdk/ui';
import { Plus, Trash2 } from 'lucide-react';
import type { Condition, FormSchema, Rule } from '@chatflow/builder/api';
import { endingTitle } from '@chatflow/builder/labels';
import { __ } from '@/lib/i18n';
import {
  actionLabel, isPredicate, listValue, newPredicate, newRule, noValue, OPERATORS, operatorLabel, rangeValue, sourceLabel,
  type ActionType, type Predicate, type Source,
} from '@/lib/logic';

const MAX_RULES = 50;

/** A list of rules ("if … then …"), each with its conditions and one action. */
export function RuleEditor({ schema, rules, onChange, after, actions = ['jump', 'show', 'hide', 'require', 'unrequire', 'end', 'set_variable'] }: {
  schema: FormSchema;
  rules: Rule[];
  onChange: (rules: Rule[]) => void;
  /** The step the rules belong to: new rules go to the step after it. */
  after?: string;
  actions?: ActionType[];
}) {
  const set = (index: number, rule: Rule) => onChange(rules.map((item, at) => (at === index ? rule : item)));
  return (
    <div className="cf:flex cf:flex-col cf:gap-3">
      {rules.map((rule, index) => (
        <div key={index} className="cf:flex cf:flex-col cf:gap-3 cf:rounded-md cf:border cf:p-3">
          <div className="cf:flex cf:items-center cf:justify-between">
            <span className="cf:text-sm cf:font-medium">{__('If')}</span>
            <Button variant="ghost" size="icon" className="cf:size-8" aria-label={__('Remove rule')} onClick={() => onChange(rules.filter((_, at) => at !== index))}><Trash2 /></Button>
          </div>
          <ConditionGroup schema={schema} value={rule.if} onChange={(condition) => set(index, { ...rule, if: condition })} />
          <span className="cf:text-sm cf:font-medium">{__('Then')}</span>
          <ActionEditor schema={schema} value={rule.then} actions={actions} onChange={(then) => set(index, { ...rule, then })} />
        </div>
      ))}
      <Button variant="outline" size="sm" className="cf:self-start" disabled={rules.length >= MAX_RULES || !schema.steps.length}
        onClick={() => onChange([...rules, newRule(schema, after)])}><Plus /> {__('Add rule')}</Button>
    </div>
  );
}

/** All or any of a list of conditions; items are single conditions or nested groups. */
export function ConditionGroup({ schema, value, onChange, depth = 0 }: { schema: FormSchema; value: Condition; onChange: (value: Condition) => void; depth?: number }) {
  // A single condition at the top is shown as a group of one.
  const group = isPredicate(value) ? { all: [value] } : value;
  const mode = 'any' in group ? 'any' : 'all';
  const items = 'any' in group ? group.any : group.all;
  const set = (next: Condition[]) => onChange(mode === 'any' ? { any: next } : { all: next });

  return (
    <div className={`cf:flex cf:flex-col cf:gap-2 ${depth ? 'cf:rounded-md cf:border-l-2 cf:pl-3' : ''}`}>
      {items.length > 1 && (
        <Select value={mode} onValueChange={(next: string) => onChange(next === 'any' ? { any: items } : { all: items })}>
          <SelectTrigger className="cf:w-48" aria-label={__('Match')}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{__('All of these are true')}</SelectItem>
            <SelectItem value="any">{__('Any of these is true')}</SelectItem>
          </SelectContent>
        </Select>
      )}
      {items.map((item, index) => (
        <div key={index} className="cf:flex cf:items-start cf:gap-2">
          <div className="cf:min-w-0 cf:flex-1">
            {isPredicate(item)
              ? <PredicateEditor schema={schema} value={item} onChange={(next) => set(items.map((other, at) => (at === index ? next : other)))} />
              : <ConditionGroup schema={schema} value={item} depth={depth + 1} onChange={(next) => set(items.map((other, at) => (at === index ? next : other)))} />}
          </div>
          <Button variant="ghost" size="icon" className="cf:size-8 cf:shrink-0" aria-label={__('Remove condition')} onClick={() => set(items.filter((_, at) => at !== index))}><Trash2 /></Button>
        </div>
      ))}
      <div className="cf:flex cf:gap-2">
        <Button variant="ghost" size="sm" onClick={() => set([...items, newPredicate(schema)])}><Plus /> {__('Condition')}</Button>
        {depth < 2 && <Button variant="ghost" size="sm" onClick={() => set([...items, { any: [newPredicate(schema)] }])}><Plus /> {__('Group')}</Button>}
      </div>
      {!items.length && <p className="cf:text-xs cf:text-muted-foreground">{__('No conditions: the rule always applies.')}</p>}
    </div>
  );
}

function PredicateEditor({ schema, value, onChange }: { schema: FormSchema; value: Predicate; onChange: (value: Predicate) => void }) {
  const source: Source = value.source ?? 'answer';
  const step = source === 'answer' ? schema.steps.find((item) => item.key === value.field) : undefined;
  const choices = step?.options?.length ? step.options : null;

  return (
    <div className="cf:grid cf:gap-2 cf:sm:grid-cols-[8rem_minmax(0,1fr)_10rem_minmax(0,1fr)]">
      <Select value={source} onValueChange={(next: string) => {
        const nextSource = next as Source;
        const field = nextSource === 'answer' ? schema.steps[0]?.key : nextSource === 'variable' ? schema.variables?.[0]?.key : '';
        onChange({ ...value, source: nextSource, field: field ?? '', value: '' });
      }}>
        <SelectTrigger aria-label={__('Compare')}><SelectValue /></SelectTrigger>
        <SelectContent>{(['answer', 'variable', 'hidden', 'url'] as Source[]).map((item) => <SelectItem key={item} value={item}>{sourceLabel(item)}</SelectItem>)}</SelectContent>
      </Select>
      {source === 'answer' || source === 'variable' ? (
        <Select value={value.field} onValueChange={(field: string) => onChange({ ...value, field, value: '' })}>
          <SelectTrigger aria-label={source === 'answer' ? __('Question') : __('Variable')}><SelectValue placeholder={__('Choose…')} /></SelectTrigger>
          <SelectContent>
            {source === 'answer'
              ? schema.steps.map((item) => <SelectItem key={item.id} value={item.key}>{item.label || item.key}</SelectItem>)
              : (schema.variables ?? []).map((item) => <SelectItem key={item.key} value={item.key}>{item.key}</SelectItem>)}
          </SelectContent>
        </Select>
      ) : (
        <Input aria-label={__('Name')} value={value.field} placeholder={source === 'url' ? 'utm_source' : 'field_key'}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange({ ...value, field: event.target.value })} />
      )}
      <Select value={value.op} onValueChange={(op: string) => {
        const next = op as Predicate['op'];
        onChange({ ...value, op: next, value: noValue(next) ? undefined : listValue(next) || rangeValue(next) ? [] : '' });
      }}>
        <SelectTrigger aria-label={__('Operator')}><SelectValue /></SelectTrigger>
        <SelectContent>{OPERATORS.map((op) => <SelectItem key={op} value={op}>{operatorLabel(op)}</SelectItem>)}</SelectContent>
      </Select>
      {!noValue(value.op) && (
        rangeValue(value.op) ? (
          <div className="cf:grid cf:grid-cols-2 cf:gap-2">
            {[0, 1].map((at) => (
              <Input key={at} aria-label={at ? __('To') : __('From')} value={String((Array.isArray(value.value) ? value.value : [])[at] ?? '')}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const range = [...(Array.isArray(value.value) ? value.value : []), '', ''].slice(0, 2);
                  range[at] = typed(event.target.value);
                  onChange({ ...value, value: range });
                }} />
            ))}
          </div>
        ) : choices && !listValue(value.op) ? (
          <Select value={String(value.value ?? '')} onValueChange={(next: string) => onChange({ ...value, value: next })}>
            <SelectTrigger aria-label={__('Value')}><SelectValue placeholder={__('Choose…')} /></SelectTrigger>
            <SelectContent>{choices.map((option) => <SelectItem key={option.id} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
          </Select>
        ) : (
          <Input aria-label={__('Value')} value={Array.isArray(value.value) ? value.value.join(', ') : String(value.value ?? '')}
            placeholder={listValue(value.op) ? __('a, b, c') : ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange({
              ...value,
              value: listValue(value.op) ? event.target.value.split(',').map((item) => item.trim()).filter(Boolean) : typed(event.target.value),
            })} />
        )
      )}
    </div>
  );
}

/** Numbers stay numbers, so "more than 10" compares numerically. */
function typed(text: string): string | number {
  return text.trim() !== '' && Number.isFinite(Number(text)) && !/^0\d/.test(text.trim()) ? Number(text) : text;
}

function ActionEditor({ schema, value, actions, onChange }: { schema: FormSchema; value: Rule['then']; actions: ActionType[]; onChange: (value: Rule['then']) => void }) {
  const change = (action: ActionType) => {
    if (action === 'set_variable') onChange({ action, key: schema.variables?.[0]?.key ?? '', operation: 'set', value: '' });
    else if (action === 'end') onChange({ action, to: schema.endings[0]?.id ?? '' });
    else onChange({ action, to: 'to' in value && value.action !== 'end' ? value.to : (schema.steps[0]?.id ?? '') });
  };
  return (
    <div className="cf:grid cf:gap-2 cf:sm:grid-cols-[10rem_minmax(0,1fr)]">
      <Select value={value.action} onValueChange={(next: string) => change(next as ActionType)}>
        <SelectTrigger aria-label={__('Action')}><SelectValue /></SelectTrigger>
        <SelectContent>{actions.map((action) => <SelectItem key={action} value={action}>{actionLabel(action)}</SelectItem>)}</SelectContent>
      </Select>
      {value.action === 'set_variable' ? (
        <div className="cf:grid cf:grid-cols-3 cf:gap-2">
          <Select value={value.key} onValueChange={(key: string) => onChange({ ...value, key })}>
            <SelectTrigger aria-label={__('Variable')}><SelectValue placeholder={__('Variable')} /></SelectTrigger>
            <SelectContent>{(schema.variables ?? []).map((item) => <SelectItem key={item.key} value={item.key}>{item.key}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={value.operation} onValueChange={(operation: string) => onChange({ ...value, operation: operation as 'set' | 'add' | 'subtract' })}>
            <SelectTrigger aria-label={__('Operation')}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="set">{__('to')}</SelectItem>
              <SelectItem value="add">{__('plus')}</SelectItem>
              <SelectItem value="subtract">{__('minus')}</SelectItem>
            </SelectContent>
          </Select>
          <Input aria-label={__('Value')} value={String(value.value ?? '')} onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange({ ...value, value: typed(event.target.value) })} />
        </div>
      ) : (
        <Select value={value.to} onValueChange={(to: string) => onChange({ ...value, to })}>
          <SelectTrigger aria-label={__('Target')}><SelectValue placeholder={__('Choose…')} /></SelectTrigger>
          <SelectContent>
            {value.action === 'end'
              ? schema.endings.map((ending, index) => <SelectItem key={ending.id} value={ending.id}>{endingTitle(ending, index)}</SelectItem>)
              : schema.steps.map((item) => <SelectItem key={item.id} value={item.id}>{item.label || item.key}</SelectItem>)}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
