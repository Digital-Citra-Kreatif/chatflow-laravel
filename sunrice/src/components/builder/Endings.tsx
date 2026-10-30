import {
  Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Textarea,
} from '@imajiner/admin-sdk/ui';
import { Plus, Trash2 } from 'lucide-react';
import type { Ending, FormDTO, FormSchema } from '@chatflow/builder/api';
import { endingTitle } from '@chatflow/builder/labels';
import { removeEnding, uid } from '@chatflow/builder/model';
import { __ } from '@/lib/i18n';

type Review = 'off' | 'button' | 'show';

/** How the conversation ends: the default ending, the review step and each ending's message or redirect. */
export function Endings({ form, onChange }: { form: FormDTO; onChange: (form: FormDTO) => void }) {
  const { schema } = form;
  const completion = form.settings.completion;
  const defaultId = completion?.defaultEndingId ?? schema.endings[0]?.id ?? '';

  const setEnding = (ending: Ending) => onChange({
    ...form,
    schema: { ...schema, endings: schema.endings.map((item) => (item.id === ending.id ? ending : item)) as FormSchema['endings'] },
  });
  const setCompletion = (changes: Partial<NonNullable<typeof completion>>) => onChange({
    ...form,
    settings: { ...form.settings, completion: { ...completion, defaultEndingId: defaultId, ...changes } },
  });
  const add = () => onChange({
    ...form,
    schema: { ...schema, endings: [...schema.endings, { id: uid('end'), type: 'message', messages: [__('Thank you!')] }] as FormSchema['endings'] },
  });

  return (
    <div className="cf:flex cf:flex-col cf:gap-4">
      <Card>
        <CardHeader><CardTitle>{__('Finishing')}</CardTitle></CardHeader>
        <CardContent className="cf:grid cf:gap-4 cf:sm:grid-cols-2">
          <div className="cf:flex cf:flex-col cf:gap-1.5">
            <Label htmlFor="cf-default-ending">{__('Default ending')}</Label>
            <Select value={defaultId} onValueChange={(defaultEndingId: string) => setCompletion({ defaultEndingId })}>
              <SelectTrigger id="cf-default-ending"><SelectValue /></SelectTrigger>
              <SelectContent>{schema.endings.map((ending, index) => <SelectItem key={ending.id} value={ending.id}>{endingTitle(ending, index)}</SelectItem>)}</SelectContent>
            </Select>
            <p className="cf:text-xs cf:text-muted-foreground">{__('Used unless a rule chooses another ending.')}</p>
          </div>
          <div className="cf:flex cf:flex-col cf:gap-1.5">
            <Label htmlFor="cf-review">{__('After the last question')}</Label>
            <Select value={completion?.review ?? 'off'} onValueChange={(review: string) => setCompletion({ review: review as Review })}>
              <SelectTrigger id="cf-review"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="off">{__('Submit automatically')}</SelectItem>
                <SelectItem value="button">{__('Show a Submit button')}</SelectItem>
                <SelectItem value="show">{__('Show the answers for review, then Submit')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {schema.endings.map((ending, index) => (
        <Card key={ending.id}>
          <CardHeader className="cf:flex cf:flex-row cf:items-center cf:justify-between cf:gap-2">
            <CardTitle className="cf:truncate">{endingTitle(ending, index)}</CardTitle>
            <Button variant="ghost" size="icon" className="cf:size-8" aria-label={__('Remove ending')} disabled={schema.endings.length <= 1}
              onClick={() => onChange(removeEnding(form, ending.id))}><Trash2 /></Button>
          </CardHeader>
          <CardContent className="cf:flex cf:flex-col cf:gap-4">
            <div className="cf:flex cf:flex-col cf:gap-1.5">
              <Label htmlFor={`cf-ending-type-${ending.id}`}>{__('Ending type')}</Label>
              <Select value={ending.type} onValueChange={(type: string) => setEnding({ ...ending, type: type as Ending['type'] })}>
                <SelectTrigger id={`cf-ending-type-${ending.id}`}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="message">{__('Show a thank-you message')}</SelectItem>
                  <SelectItem value="redirect">{__('Go to a page or WhatsApp')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="cf:flex cf:flex-col cf:gap-1.5">
              <Label htmlFor={`cf-ending-messages-${ending.id}`}>{__('Messages (one per line)')}</Label>
              <Textarea id={`cf-ending-messages-${ending.id}`} rows={3} value={ending.messages?.join('\n') ?? ''}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setEnding({ ...ending, messages: event.target.value.split('\n').slice(0, 50) })} />
            </div>
            {ending.type === 'redirect' && (
              <>
                <div className="cf:flex cf:flex-col cf:gap-1.5">
                  <Label htmlFor={`cf-ending-url-${ending.id}`}>{__('Redirect URL')}</Label>
                  <Input id={`cf-ending-url-${ending.id}`} type="url" value={ending.url ?? ''} placeholder="https://"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEnding({ ...ending, url: event.target.value })} />
                  <p className="cf:text-xs cf:text-muted-foreground">{__('The submission is saved before the visitor leaves. A wa.me link opens WhatsApp with a message the visitor still sends.')}</p>
                </div>
                <div className="cf:flex cf:items-center cf:justify-between">
                  <Label htmlFor={`cf-ending-append-${ending.id}`}>{__('Add answers to the link')}</Label>
                  <Switch id={`cf-ending-append-${ending.id}`} checked={Boolean(ending.appendQuery)} onCheckedChange={(appendQuery: boolean) => setEnding({ ...ending, appendQuery })} />
                </div>
                {ending.appendQuery && (
                  <div className="cf:flex cf:flex-col cf:gap-1.5">
                    <Label htmlFor={`cf-ending-keys-${ending.id}`}>{__('Answers to add (field keys, comma separated)')}</Label>
                    <Input id={`cf-ending-keys-${ending.id}`} value={ending.queryKeys?.join(', ') ?? ''}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEnding({ ...ending, queryKeys: event.target.value.split(',').map((key) => key.trim()).filter(Boolean).slice(0, 100) })} />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" className="cf:self-start" disabled={schema.endings.length >= 20} onClick={add}><Plus /> {__('Add ending')}</Button>
    </div>
  );
}
