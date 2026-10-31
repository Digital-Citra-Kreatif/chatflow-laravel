import { useEffect, useId, useState } from 'react';
import { Input, Label } from '@imajiner/admin-sdk/ui';

/**
 * A text input whose value is applied when the field is left (or Enter is pressed), and
 * only when it passes `validate`. For renames that rewrite references across the form
 * (field keys, stored option values), so half-typed values never reach rules or exports.
 */
export function CommitInput({ label, value, validate, onCommit, help }: {
  label: string;
  value: string;
  validate: (value: string) => string;
  onCommit: (value: string) => void;
  help?: string;
}) {
  const id = useId();
  const [text, setText] = useState(value);
  const [error, setError] = useState('');
  useEffect(() => { setText(value); setError(''); }, [value]);

  const commit = () => {
    if (text === value) return;
    const problem = validate(text);
    setError(problem);
    if (!problem) onCommit(text);
  };

  return (
    <div className="cf:flex cf:flex-col cf:gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={text} aria-invalid={error ? true : undefined} aria-describedby={`${id}-help`}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value)}
        onBlur={commit}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === 'Enter') commit();
          if (event.key === 'Escape') { setText(value); setError(''); }
        }} />
      <p id={`${id}-help`} className={error ? 'cf:text-xs cf:text-destructive' : 'cf:text-xs cf:text-muted-foreground'}>{error || help}</p>
    </div>
  );
}
