import { useMemo } from 'react';
import {
  Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@imajiner/admin-sdk/ui';
import { Plus, Trash2 } from 'lucide-react';
import type { FormDTO, FormSchema } from '@chatflow/builder/api';
import { endingTitle } from '@chatflow/builder/labels';
import { removeVariable, renameVariable } from '@chatflow/builder/model';
import { diagnoseSchema } from '@chatflow/shared/logic/diagnostics';
import { CommitInput } from '@/components/builder/CommitInput';
import { ConditionGroup } from '@/components/builder/RuleEditor';
import { __, sprintf } from '@/lib/i18n';
import { actionText, conditionText, newPredicate } from '@/lib/logic';

type Variable = NonNullable<FormSchema['variables']>[number];

/**
 * The form's logic in one place: problems found in the rules, every rule in words (with
 * a link to its question), variables, and outcomes (an ending chosen by conditions).
 * Rules themselves are edited on their question (Inspector → Rules).
 */
export function LogicPanel({ form, onChange, onOpenStep }: { form: FormDTO; onChange: (form: FormDTO) => void; onOpenStep: (stepId: string) => void }) {
  const { schema } = form;
  const issues = useMemo(() => diagnoseSchema(schema), [schema]);
  const setSchema = (next: Partial<FormSchema>) => onChange({ ...form, schema: { ...schema, ...next } as FormSchema });
  const variables = schema.variables ?? [];
  const outcomes = schema.outcomes ?? [];

  const rules = schema.steps.flatMap((step) => [
    ...(step.logic ?? []).map((rule) => ({ step, rule, option: '' })),
    ...(step.options ?? []).flatMap((option) => (option.logic ?? []).map((rule) => ({ step, rule, option: option.label }))),
  ]);

  return (
    <div className="cf:flex cf:flex-col cf:gap-4">
      {issues.length > 0 && (
        <Card className="cf:border-amber-500/50">
          <CardHeader><CardTitle>{sprintf(__('%d problems to check'), issues.length)}</CardTitle></CardHeader>
          <CardContent>
            <ul className="cf:flex cf:flex-col cf:gap-1 cf:text-sm">
              {issues.slice(0, 20).map((issue, index) => {
                const match = /^\/steps\/(\d+)/.exec(issue.path ?? '');
                const step = match ? schema.steps[Number(match[1])] : undefined;
                return (
                  <li key={index}>
                    {step ? <button type="button" className="cf:underline cf:underline-offset-4" onClick={() => onOpenStep(step.id)}>{step.label || step.key}</button> : null}
                    {step ? ': ' : ''}{issue.message}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{__('Rules')}</CardTitle>
          <CardDescription>{__('Each question’s rules run after it is answered. Edit them on the question, under Rules.')}</CardDescription>
        </CardHeader>
        <CardContent>
          {rules.length ? (
            <ul className="cf:flex cf:flex-col cf:gap-2 cf:text-sm">
              {rules.map(({ step, rule, option }, index) => (
                <li key={index} className="cf:flex cf:flex-wrap cf:items-baseline cf:gap-x-2">
                  <button type="button" className="cf:font-medium cf:underline-offset-4 cf:hover:underline" onClick={() => onOpenStep(step.id)}>{step.label || step.key}</button>
                  {option && <Badge variant="outline">{option}</Badge>}
                  <span className="cf:text-muted-foreground">{__('if')} {conditionText(rule.if, schema)}: {actionText(rule.then, schema)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="cf:text-sm cf:text-muted-foreground">{__('No rules yet: every visitor gets the questions in order.')}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{__('Variables')}</CardTitle>
          <CardDescription>{__('Values rules can set and add to (a score, a tag), usable in conditions, formulas and messages as {{variable.key}}.')}</CardDescription>
        </CardHeader>
        <CardContent className="cf:flex cf:flex-col cf:gap-3">
          {variables.map((variable) => (
            <div key={variable.key} className="cf:grid cf:items-end cf:gap-2 cf:sm:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)_auto]">
              <CommitInput label={__('Key')} value={variable.key}
                validate={(key) => !/^[a-z][a-z0-9_]{0,63}$/.test(key) ? __('Lowercase letters, numbers and underscores.') : variables.some((other) => other !== variable && other.key === key) ? __('Already used.') : ''}
                onCommit={(key) => onChange(renameVariable(form, variable.key, key))} />
              <Select value={variable.type} onValueChange={(type: string) => setSchema({ variables: variables.map((item) => (item === variable ? { ...item, type: type as Variable['type'], default: type === 'number' ? 0 : type === 'boolean' ? false : '' } : item)) })}>
                <SelectTrigger aria-label={__('Type')}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">{__('Number')}</SelectItem>
                  <SelectItem value="string">{__('Text')}</SelectItem>
                  <SelectItem value="boolean">{__('Yes / No')}</SelectItem>
                </SelectContent>
              </Select>
              <Input aria-label={__('Starting value')} value={String(variable.default ?? '')}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSchema({
                  variables: variables.map((item) => (item === variable ? {
                    ...item,
                    default: variable.type === 'number' ? Number(event.target.value) || 0 : variable.type === 'boolean' ? event.target.value === 'true' : event.target.value,
                  } : item)),
                })} />
              <Button variant="ghost" size="icon" aria-label={sprintf(__('Remove %s'), variable.key)} onClick={() => onChange(removeVariable(form, variable.key))}><Trash2 /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="cf:self-start" disabled={variables.length >= 50} onClick={() => {
            let n = variables.length + 1;
            while (variables.some((item) => item.key === `score_${n}`)) n++;
            setSchema({ variables: [...variables, { key: variables.length ? `score_${n}` : 'score', type: 'number', default: 0 }] });
          }}><Plus /> {__('Add variable')}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{__('Outcomes')}</CardTitle>
          <CardDescription>{__('Choose the ending by the answers: the first outcome whose conditions match wins; otherwise the default ending is used.')}</CardDescription>
        </CardHeader>
        <CardContent className="cf:flex cf:flex-col cf:gap-3">
          {outcomes.map((outcome, index) => (
            <div key={index} className="cf:flex cf:flex-col cf:gap-2 cf:rounded-md cf:border cf:p-3">
              <div className="cf:flex cf:items-center cf:justify-between cf:gap-2">
                <span className="cf:text-sm cf:font-medium">{__('End with')}</span>
                <Select value={outcome.endingId} onValueChange={(endingId: string) => setSchema({ outcomes: outcomes.map((item, at) => (at === index ? { ...item, endingId } : item)) })}>
                  <SelectTrigger className="cf:max-w-xs" aria-label={__('Ending')}><SelectValue /></SelectTrigger>
                  <SelectContent>{schema.endings.map((ending, at) => <SelectItem key={ending.id} value={ending.id}>{endingTitle(ending, at)}</SelectItem>)}</SelectContent>
                </Select>
                <Button variant="ghost" size="icon" aria-label={__('Remove outcome')} onClick={() => setSchema({ outcomes: outcomes.filter((_, at) => at !== index) })}><Trash2 /></Button>
              </div>
              <span className="cf:text-sm cf:font-medium">{__('when')}</span>
              <ConditionGroup schema={schema} value={outcome.if} onChange={(condition) => setSchema({ outcomes: outcomes.map((item, at) => (at === index ? { ...item, if: condition } : item)) })} />
            </div>
          ))}
          <Button variant="outline" size="sm" className="cf:self-start" disabled={outcomes.length >= 50} onClick={() => setSchema({
            outcomes: [...outcomes, { if: { all: [newPredicate(schema)] }, endingId: schema.endings[0]!.id }],
          })}><Plus /> {__('Add outcome')}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
