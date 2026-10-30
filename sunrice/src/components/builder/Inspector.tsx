import { useState, type ReactNode } from 'react';
import {
  Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Input, Label, SortableHandle, SortableList, Switch, Tabs, TabsContent,
  TabsList, TabsTrigger, Textarea,
} from '@imajiner/admin-sdk/ui';
import { Plus, Trash2 } from 'lucide-react';
import type { FormSchema, Option, Step } from '@chatflow/builder/api';
import { withStepMessages } from '@chatflow/builder/labels';
import { makeOption, uniqueOptionValue } from '@chatflow/builder/model';
import { CommitInput } from '@/components/builder/CommitInput';
import { SettingField } from '@/components/builder/SettingField';
import { acceptsInput, fieldTypeLabel, settingsFor } from '@/lib/fieldTypes';
import { __, sprintf } from '@/lib/i18n';

const KEY = /^[a-z][a-z0-9_]{0,63}$/;
const MAX_OPTIONS = 200;

/** Edits one step: what the bot says, the question's settings, its validation and advanced options. */
export function Inspector({ step, schema, reservedValues, onChange, onRenameKey, onRenameOption, actions }: {
  step: Step;
  schema: FormSchema;
  /** Stored values this step's options have used before (kept unique across renames). */
  reservedValues: string[];
  onChange: (step: Step) => void;
  /** Renames the key and rewrites rules, merge tags, formulas and settings that use it. */
  onRenameKey: (key: string) => void;
  /** Renames a choice's stored value and the conditions that compare against it. */
  onRenameOption: (optionId: string, value: string) => void;
  actions?: ReactNode;
}) {
  const input = acceptsInput(step.type);
  const validation = settingsFor(step.type, 'validation');

  return (
    <Card className="cf:gap-4">
      <CardHeader className="cf:flex cf:flex-row cf:items-start cf:justify-between cf:gap-2">
        <div className="cf:min-w-0">
          <CardTitle className="cf:truncate">{step.label || step.key}</CardTitle>
          <p className="cf:text-xs cf:text-muted-foreground">{fieldTypeLabel(step.type)}</p>
        </div>
        {actions}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="content" key={step.id}>
          <TabsList>
            <TabsTrigger value="content">{__('Content')}</TabsTrigger>
            {validation.length > 0 && <TabsTrigger value="validation">{__('Validation')}</TabsTrigger>}
            <TabsTrigger value="advanced">{__('Advanced')}</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="cf:mt-4 cf:flex cf:flex-col cf:gap-4">
            <Messages step={step} onChange={onChange} />
            {input && (
              <div className="cf:flex cf:items-center cf:justify-between">
                <Label htmlFor={`cf-required-${step.id}`}>{__('Required')}</Label>
                <Switch id={`cf-required-${step.id}`} checked={step.required || step.type === 'consent'} disabled={step.type === 'consent'}
                  onCheckedChange={(required: boolean) => onChange({ ...step, required })} />
              </div>
            )}
            {settingsFor(step.type, 'content').map((setting) => <SettingField key={setting.path} step={step} setting={setting} onChange={onChange} />)}
            {(step.type === 'single_choice' || step.type === 'multi_choice') && (
              <Options step={step} reservedValues={reservedValues} onChange={onChange} onRenameOption={onRenameOption} />
            )}
            {['rating', 'scale', 'nps'].includes(step.type) && (
              <p className="cf:text-xs cf:text-muted-foreground">{__('Rating: 1–5, scale: 1–10, NPS: 0–10. Answers are stored as numbers.')}</p>
            )}
          </TabsContent>

          {validation.length > 0 && (
            <TabsContent value="validation" className="cf:mt-4 cf:flex cf:flex-col cf:gap-4">
              {validation.map((setting) => <SettingField key={`${setting.path}-${setting.label}`} step={step} setting={setting} onChange={onChange} />)}
            </TabsContent>
          )}

          <TabsContent value="advanced" className="cf:mt-4 cf:flex cf:flex-col cf:gap-4">
            <div className="cf:flex cf:flex-col cf:gap-1.5">
              <Label htmlFor={`cf-label-${step.id}`}>{__('Label')}</Label>
              <Input id={`cf-label-${step.id}`} value={step.label} onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange({ ...step, label: event.target.value })} />
              <p className="cf:text-xs cf:text-muted-foreground">{__('How the question is named in the inbox, exports and emails. Follows the first message until you change it.')}</p>
            </div>
            <CommitInput
              label={__('Field key')}
              value={step.key}
              onCommit={onRenameKey}
              validate={(key) => !KEY.test(key)
                ? __('Start with a lowercase letter; use only lowercase letters, numbers and underscores (64 max).')
                : schema.steps.some((item) => item.id !== step.id && item.key === key) ? __('Another field already uses this key.') : ''}
              help={__('Applied when you leave the field. Rules, merge tags, formulas and notifications that use the old key are updated.')}
            />
            {settingsFor(step.type, 'advanced').map((setting) => <SettingField key={setting.path} step={step} setting={setting} onChange={onChange} />)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

/** The bot's messages before the question; the first one also names the question until it is renamed. */
function Messages({ step, onChange }: { step: Step; onChange: (step: Step) => void }) {
  const set = (messages: string[]) => onChange(withStepMessages(step, messages));
  return (
    <div className="cf:flex cf:flex-col cf:gap-3">
      {step.messages.map((message, index) => (
        <div key={index} className="cf:flex cf:flex-col cf:gap-1.5">
          <div className="cf:flex cf:items-center cf:justify-between">
            <Label htmlFor={`cf-message-${step.id}-${index}`}>{step.messages.length > 1 ? sprintf(__('Message %d'), index + 1) : __('Bot message')}</Label>
            {step.messages.length > 1 && (
              <Button variant="ghost" size="sm" className="cf:h-7 cf:text-destructive" onClick={() => set(step.messages.filter((_, at) => at !== index))}>
                {__('Remove')}
              </Button>
            )}
          </div>
          <Textarea id={`cf-message-${step.id}-${index}`} rows={2} value={message}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => set(step.messages.map((item, at) => (at === index ? event.target.value : item)))} />
        </div>
      ))}
      <div className="cf:flex cf:items-center cf:justify-between cf:gap-2">
        <p className="cf:text-xs cf:text-muted-foreground">{__('Use {{field_key}} to repeat an earlier answer.')}</p>
        <Button variant="outline" size="sm" disabled={step.messages.length >= 20} onClick={() => set([...step.messages, ''])}><Plus /> {__('Add message')}</Button>
      </div>
    </div>
  );
}

/** A choice question's options: drag to reorder, edit labels, rename stored values, add one or many. */
function Options({ step, reservedValues, onChange, onRenameOption }: {
  step: Step;
  reservedValues: string[];
  onChange: (step: Step) => void;
  onRenameOption: (optionId: string, value: string) => void;
}) {
  const options = step.options ?? [];
  const [bulk, setBulk] = useState('');
  const setOptions = (next: Option[]) => onChange({ ...step, options: next });
  const used = () => [...reservedValues, ...options.map((option) => option.value)];

  const addOne = () => {
    const label = sprintf(__('Option %d'), options.length + 1);
    setOptions([...options, makeOption(uniqueOptionValue(label, used()), label)]);
  };

  const addMany = () => {
    const taken = used();
    const added = bulk.split('\n').map((line) => line.trim()).filter(Boolean).slice(0, MAX_OPTIONS - options.length).map((label) => {
      const value = uniqueOptionValue(label, taken);
      taken.push(value);
      return makeOption(value, label);
    });
    setOptions([...options, ...added]);
    setBulk('');
  };

  return (
    <fieldset className="cf:flex cf:flex-col cf:gap-3">
      <legend className="cf:mb-1 cf:text-sm cf:font-medium">{__('Options')}</legend>
      <SortableList items={options} getId={(option: Option) => option.id} getLabel={(option: Option) => option.label} onReorder={(next: Option[]) => setOptions(next)}>
        {(option: Option, { handle }) => (
          <div className="cf:flex cf:flex-col cf:gap-2 cf:rounded-md cf:border cf:p-3">
            <div className="cf:flex cf:items-center cf:gap-2">
              <SortableHandle {...handle} label={sprintf(__('Move %s'), option.label)} />
              <Input aria-label={__('Option label')} value={option.label}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setOptions(options.map((item) => (item.id === option.id ? { ...item, label: event.target.value } : item)))} />
              <Button variant="ghost" size="icon" className="cf:size-8 cf:shrink-0" aria-label={sprintf(__('Remove %s'), option.label)}
                disabled={options.length <= 1} onClick={() => setOptions(options.filter((item) => item.id !== option.id))}><Trash2 /></Button>
            </div>
            <details className="cf:text-sm">
              <summary className="cf:cursor-pointer cf:text-muted-foreground">{__('More')}</summary>
              <div className="cf:mt-2 cf:flex cf:flex-col cf:gap-3">
                <CommitInput
                  label={__('Stored value')}
                  value={option.value}
                  onCommit={(value) => onRenameOption(option.id, value)}
                  validate={(value) => !value.trim() ? __('Enter a stored value.')
                    : value.length > 255 ? __('Use 255 characters or fewer.')
                      : options.some((item) => item.id !== option.id && item.value === value) || reservedValues.includes(value) ? __('Another option already uses this value.') : ''}
                  help={__('What exports and rules see. Rules that compare against it are updated.')}
                />
                <div className="cf:grid cf:grid-cols-2 cf:gap-2">
                  <div className="cf:flex cf:flex-col cf:gap-1.5">
                    <Label>{__('Emoji')}</Label>
                    <Input value={option.emoji ?? ''} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setOptions(options.map((item) => (item.id === option.id ? { ...item, emoji: event.target.value } : item)))} />
                  </div>
                  <div className="cf:flex cf:flex-col cf:gap-1.5">
                    <Label>{__('Reaction text')}</Label>
                    <Input value={option.reaction ?? ''} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setOptions(options.map((item) => (item.id === option.id ? { ...item, reaction: event.target.value } : item)))} />
                  </div>
                </div>
                <label className="cf:flex cf:items-center cf:gap-2">
                  <Checkbox checked={Boolean(option.isExclusive)} onCheckedChange={(on: boolean) => setOptions(options.map((item) => (item.id === option.id ? { ...item, isExclusive: on } : item)))} />
                  {__('Exclusive (none of the above)')}
                </label>
                {step.type === 'single_choice' && (
                  <label className="cf:flex cf:items-center cf:gap-2">
                    <Checkbox checked={Boolean(option.isOther)} onCheckedChange={(on: boolean) => setOptions(options.map((item) => (item.id === option.id ? { ...item, isOther: on } : item)))} />
                    {__('“Other”: lets the visitor type an answer')}
                  </label>
                )}
              </div>
            </details>
          </div>
        )}
      </SortableList>
      <Button variant="outline" size="sm" className="cf:self-start" disabled={options.length >= MAX_OPTIONS} onClick={addOne}><Plus /> {__('Add option')}</Button>
      <div className="cf:flex cf:flex-col cf:gap-1.5">
        <Label htmlFor={`cf-bulk-${step.id}`}>{__('Add several (one per line)')}</Label>
        <Textarea id={`cf-bulk-${step.id}`} rows={3} value={bulk} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setBulk(event.target.value)} />
        <Button variant="outline" size="sm" className="cf:self-start" disabled={!bulk.trim() || options.length >= MAX_OPTIONS} onClick={addMany}>{__('Add these options')}</Button>
      </div>
    </fieldset>
  );
}
