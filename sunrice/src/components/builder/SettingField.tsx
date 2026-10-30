import { useEffect, useId, useState } from 'react';
import { Checkbox, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Textarea } from '@imajiner/admin-sdk/ui';
import { getPath, setPath, type SettingDescriptor } from '@/lib/fieldTypes';
import { __, sprintf } from '@/lib/i18n';

const INHERIT = '__inherit';

/**
 * One setting, rendered from its descriptor (lib/fieldTypes.ts, lib/formSettings.ts):
 * reads the value at the descriptor's path in `target` (a step or a whole form) and
 * hands back a copy with the new value. Emptied values are removed, so they fall back
 * to their default, or to the site default for settings that inherit one.
 */
export function SettingField<T>({ target, setting, onChange }: { target: T; setting: SettingDescriptor; onChange: (target: T) => void }) {
  const id = useId();
  const raw = getPath(target, setting.path);
  const value = raw ?? setting.fallback;
  const set = (next: unknown) => onChange(setPath(target, setting.path, next));
  const help = setting.help?.();
  const inherited = setting.inherited?.();
  const inheritedText = inherited === undefined ? '' : typeof inherited === 'boolean' ? (inherited ? __('On') : __('Off')) : String(inherited);
  const siteDefault = sprintf(__('Site default (%s)'), inheritedText || __('empty'));

  // A toggle that can also follow the site default is a three-way choice.
  if (setting.kind === 'toggle' && setting.inherited) {
    return (
      <Field id={id} label={setting.label} help={help}>
        <Select value={raw === undefined ? INHERIT : raw ? 'on' : 'off'} onValueChange={(next: string) => set(next === INHERIT ? undefined : next === 'on')}>
          <SelectTrigger id={id}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={INHERIT}>{siteDefault}</SelectItem>
            <SelectItem value="on">{__('On')}</SelectItem>
            <SelectItem value="off">{__('Off')}</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    );
  }

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

  const placeholder = setting.inherited ? siteDefault
    : setting.fallback !== undefined && typeof setting.fallback !== 'object' ? String(setting.fallback) : undefined;

  return (
    <Field id={id} label={setting.label} help={help}>
      {setting.kind === 'select' ? (
        <Select value={raw === undefined && setting.inherited ? INHERIT : String(value ?? '')} onValueChange={(next: string) => set(next === INHERIT ? undefined : next)}>
          <SelectTrigger id={id}><SelectValue /></SelectTrigger>
          <SelectContent>
            {setting.inherited && <SelectItem value={INHERIT}>{siteDefault}</SelectItem>}
            {setting.options?.().map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
          </SelectContent>
        </Select>
      ) : setting.kind === 'textarea' ? (
        <Textarea id={id} rows={3} value={String(raw ?? '')} placeholder={placeholder} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => set(event.target.value)} />
      ) : setting.kind === 'number' ? (
        <NumberInput id={id} value={typeof raw === 'number' ? raw : undefined} placeholder={placeholder} min={setting.min} max={setting.max} onChange={set} />
      ) : setting.kind === 'list' ? (
        <Input id={id} value={Array.isArray(raw) ? raw.join(', ') : ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => set(event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} />
      ) : setting.kind === 'color' ? (
        <div className="cf:flex cf:gap-2">
          <input type="color" aria-label={sprintf(__('%s colour picker'), setting.label)} className="cf:h-9 cf:w-12 cf:shrink-0 cf:cursor-pointer cf:rounded-md cf:border cf:bg-transparent"
            // Unset colours show a faded white swatch, not a black one that looks chosen.
            style={/^#[0-9a-f]{6}$/i.test(String(raw ?? '')) ? undefined : { opacity: 0.35 }}
            value={/^#[0-9a-f]{6}$/i.test(String(raw ?? '')) ? String(raw) : '#ffffff'} onChange={(event) => set(event.target.value)} />
          <Input id={id} value={String(raw ?? '')} placeholder={placeholder ?? __('Default')} onChange={(event: React.ChangeEvent<HTMLInputElement>) => set(event.target.value)} />
        </div>
      ) : (
        <Input id={id} type={setting.kind === 'date' ? 'date' : 'text'} value={String(raw ?? '')} placeholder={placeholder}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => set(setting.upper ? event.target.value.toUpperCase() : event.target.value)} />
      )}
    </Field>
  );
}

function Field({ id, label, help, children }: { id: string; label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="cf:flex cf:flex-col cf:gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {help && <p className="cf:text-xs cf:text-muted-foreground">{help}</p>}
    </div>
  );
}

/** A number box that allows an empty value (no limit, or the default) and only stores numbers. */
function NumberInput({ id, value, placeholder, min, max, onChange }: {
  id: string; value: number | undefined; placeholder?: string; min?: number; max?: number; onChange: (value: number | undefined) => void;
}) {
  const [text, setText] = useState(value === undefined ? '' : String(value));
  useEffect(() => setText(value === undefined ? '' : String(value)), [value]);
  return (
    <Input id={id} type="number" inputMode="decimal" value={text} placeholder={placeholder} min={min} max={max}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        if (event.target.value === '') onChange(undefined);
        else if (Number.isFinite(Number(event.target.value))) onChange(Number(event.target.value));
      }} />
  );
}
