import { useEffect, useId, useState } from 'react';
import { Checkbox, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Textarea } from '@imajiner/admin-sdk/ui';
import type { Step } from '@chatflow/shared/contracts';
import { getPath, setPath, type SettingDescriptor } from '@/lib/fieldTypes';

/** One inspector setting, rendered from its descriptor (see lib/fieldTypes.ts). */
export function SettingField({ step, setting, onChange }: { step: Step; setting: SettingDescriptor; onChange: (step: Step) => void }) {
  const id = useId();
  const raw = getPath(step, setting.path);
  const value = raw ?? setting.fallback;
  const set = (next: unknown) => onChange(setPath(step, setting.path, next));
  const help = setting.help?.();

  if (setting.kind === 'toggle') {
    const checked = setting.invert ? value === false : Boolean(value);
    return (
      <div className="cf:flex cf:items-start cf:justify-between cf:gap-4">
        <div className="cf:flex cf:flex-col cf:gap-1">
          <Label htmlFor={id}>{setting.label}</Label>
          {help && <p className="cf:text-xs cf:text-muted-foreground">{help}</p>}
        </div>
        <Switch id={id} checked={checked} onCheckedChange={(on: boolean) => set(setting.invert ? !on : on)} />
      </div>
    );
  }

  if (setting.kind === 'checklist') {
    const chosen = Array.isArray(value) ? (value as string[]) : [];
    return (
      <fieldset className="cf:flex cf:flex-col cf:gap-2">
        <legend className="cf:mb-1 cf:text-sm cf:font-medium">{setting.label}</legend>
        {setting.options?.().map((option) => (
          <label key={option.value} className="cf:flex cf:items-center cf:gap-2 cf:text-sm">
            <Checkbox checked={chosen.includes(option.value)}
              onCheckedChange={(on: boolean) => set(on ? [...chosen.filter((item) => item !== option.value), option.value] : chosen.filter((item) => item !== option.value))} />
            {option.label}
          </label>
        ))}
      </fieldset>
    );
  }

  return (
    <div className="cf:flex cf:flex-col cf:gap-1.5">
      <Label htmlFor={id}>{setting.label}</Label>
      {setting.kind === 'select' ? (
        <Select value={String(value ?? '')} onValueChange={(next: string) => set(next)}>
          <SelectTrigger id={id}><SelectValue /></SelectTrigger>
          <SelectContent>{setting.options?.().map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
        </Select>
      ) : setting.kind === 'textarea' ? (
        <Textarea id={id} rows={3} value={String(raw ?? '')} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => set(event.target.value)} />
      ) : setting.kind === 'number' ? (
        <NumberInput id={id} value={typeof raw === 'number' ? raw : undefined} onChange={set} />
      ) : setting.kind === 'list' ? (
        <Input id={id} value={Array.isArray(raw) ? raw.join(', ') : ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => set(event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} />
      ) : (
        <Input id={id} type={setting.kind === 'date' ? 'date' : 'text'} value={String(raw ?? '')}
          placeholder={setting.fallback !== undefined && typeof setting.fallback !== 'object' ? String(setting.fallback) : undefined}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => set(setting.upper ? event.target.value.toUpperCase() : event.target.value)} />
      )}
      {help && <p className="cf:text-xs cf:text-muted-foreground">{help}</p>}
    </div>
  );
}

/** A number box that allows an empty value (no limit) and only stores numbers. */
function NumberInput({ id, value, onChange }: { id: string; value: number | undefined; onChange: (value: number | undefined) => void }) {
  const [text, setText] = useState(value === undefined ? '' : String(value));
  useEffect(() => setText(value === undefined ? '' : String(value)), [value]);
  return (
    <Input id={id} type="number" inputMode="decimal" value={text}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        if (event.target.value === '') onChange(undefined);
        else if (Number.isFinite(Number(event.target.value))) onChange(Number(event.target.value));
      }} />
  );
}
