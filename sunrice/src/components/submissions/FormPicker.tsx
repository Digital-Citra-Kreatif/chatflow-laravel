import { useEffect, useState } from 'react';
import {
  Button, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Popover, PopoverContent, PopoverTrigger,
} from '@imajiner/admin-sdk/ui';
import { Check, ChevronsUpDown } from 'lucide-react';
import type { AdminApi } from '@/lib/api';
import { __ } from '@/lib/i18n';

export interface FormOption {
  id: number;
  title: string;
}

/**
 * A searchable form choice: the newest 100 forms, searched on the server as you type.
 * `allLabel` adds an "All forms" entry (value undefined).
 */
export function FormPicker({ api, value, label, onChange, allLabel, className }: {
  api: AdminApi;
  value: number | undefined;
  /** The chosen form's title when known (it may not be among the loaded ones). */
  label?: string;
  onChange: (id: number | undefined, title?: string) => void;
  allLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [forms, setForms] = useState<FormOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const abort = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      api.request<{ items: FormOption[] }>(`admin/analytics/forms?page=1&search=${encodeURIComponent(search)}`, 'GET', undefined, abort.signal)
        .then((result) => setForms(result.items))
        .catch(() => !abort.signal.aborted && setForms([]))
        .finally(() => !abort.signal.aborted && setLoading(false));
    }, search ? 250 : 0);
    return () => {
      window.clearTimeout(timer);
      abort.abort();
    };
  }, [api, open, search]);

  const current = value ? (forms.find((form) => form.id === value)?.title ?? label ?? `#${value}`) : (allLabel ?? __('Choose a form'));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} aria-label={__('Form')} className={className ?? 'cf:w-56 cf:justify-between'}>
          <span className="cf:truncate">{current}</span>
          <ChevronsUpDown className="cf:opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="cf:w-72 cf:p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={__('Search forms…')} value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>{loading ? __('Loading…') : __('No forms found.')}</CommandEmpty>
            <CommandGroup>
              {allLabel && !search && (
                <CommandItem value="__all" onSelect={() => { onChange(undefined); setOpen(false); }}>
                  <Check className={value ? 'cf:opacity-0' : undefined} /> {allLabel}
                </CommandItem>
              )}
              {forms.map((form) => (
                <CommandItem key={form.id} value={String(form.id)} onSelect={() => { onChange(form.id, form.title); setOpen(false); }}>
                  <Check className={value === form.id ? undefined : 'cf:opacity-0'} />
                  <span className="cf:truncate">{form.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
