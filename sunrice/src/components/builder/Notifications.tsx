import { useState } from 'react';
import {
  Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Textarea, toast,
} from '@imajiner/admin-sdk/ui';
import { Eye, Plus, Send, Trash2 } from 'lucide-react';
import type { FormDTO, FormSettings } from '@chatflow/builder/api';
import { uid } from '@chatflow/builder/model';
import { ConditionGroup } from '@/components/builder/RuleEditor';
import { errorMessage, type AdminApi } from '@/lib/api';
import { __, sprintf } from '@/lib/i18n';
import { newPredicate } from '@/lib/logic';

type Group = NonNullable<FormSettings['notifications']>;
type Notification = NonNullable<Group['admin']>[number];
type Kind = 'admin' | 'autoresponders';
type Rendered = { subject: string; html: string; plain: string };

const MAX = 20;
const list = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 15);

/**
 * Emails a submission sends: admin notifications (to fixed addresses) and autoresponders
 * (to the address the visitor typed). Each can depend on the answers. Preview renders
 * the saved draft with sample answers; a test email needs the published form.
 */
export function Notifications({ api, form, onChange, save }: {
  api: AdminApi;
  form: FormDTO;
  onChange: (form: FormDTO) => void;
  /** Saves the draft first, so the preview shows what is on screen. */
  save: () => Promise<FormDTO>;
}) {
  const group: Group = form.settings.notifications ?? {};
  const setGroup = (next: Group) => onChange({ ...form, settings: { ...form.settings, notifications: next } });
  const setItems = (kind: Kind, items: Notification[]) => setGroup({ ...group, [kind]: items } as Group);
  const emailFields = form.schema.steps.filter((step) => step.type === 'email');
  const [preview, setPreview] = useState<Rendered | null>(null);
  const [testing, setTesting] = useState<Notification | null>(null);

  const add = (kind: Kind) => setItems(kind, [...(group[kind] ?? []), kind === 'admin'
    ? { id: uid('mail'), enabled: true, to: [], subject: __('New submission'), body: '{{all_answers}}' }
    : { id: uid('reply'), enabled: true, emailField: emailFields[0]?.key, subject: __('Thank you for your submission'), body: '{{all_answers}}' }] as Notification[]);

  const showPreview = async (notification: Notification) => {
    try {
      const saved = await save();
      setPreview(await api.request<Rendered>('admin/notifications/preview', 'POST', { formId: saved.id, notificationId: notification.id, answers: {} }));
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const section = (kind: Kind, title: string, description: string) => {
    const items = (group[kind] ?? []) as Notification[];
    const set = (item: Notification) => setItems(kind, items.map((other) => (other.id === item.id ? item : other)));
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="cf:flex cf:flex-col cf:gap-4">
          {items.map((item, index) => (
            <div key={item.id} className="cf:flex cf:flex-col cf:gap-3 cf:rounded-md cf:border cf:p-4">
              <div className="cf:flex cf:items-center cf:justify-between cf:gap-2">
                <div className="cf:flex cf:items-center cf:gap-2">
                  <Switch checked={item.enabled} aria-label={__('Enabled')} onCheckedChange={(enabled: boolean) => set({ ...item, enabled })} />
                  <span className="cf:font-medium">{item.subject || sprintf(__('Email %d'), index + 1)}</span>
                </div>
                <div className="cf:flex cf:gap-1">
                  <Button variant="ghost" size="sm" onClick={() => void showPreview(item)}><Eye /> {__('Preview')}</Button>
                  <Button variant="ghost" size="sm" onClick={() => setTesting(item)}><Send /> {__('Send a test')}</Button>
                  <Button variant="ghost" size="icon" className="cf:size-8" aria-label={__('Remove email')} onClick={() => setItems(kind, items.filter((other) => other.id !== item.id))}><Trash2 /></Button>
                </div>
              </div>
              <div className="cf:grid cf:gap-3 cf:sm:grid-cols-3">
                {kind === 'admin' ? (
                  <Text label={__('To')} value={(item.to ?? []).join(', ')} placeholder="team@example.com" onChange={(value) => set({ ...item, to: list(value) as Notification['to'] })} />
                ) : (
                  <div className="cf:flex cf:flex-col cf:gap-1.5">
                    <Label>{__('Send to the address in')}</Label>
                    <Select value={item.emailField ?? ''} onValueChange={(emailField: string) => set({ ...item, emailField })}>
                      <SelectTrigger aria-label={__('Email question')}><SelectValue placeholder={__('Choose an email question')} /></SelectTrigger>
                      <SelectContent>{emailFields.map((step) => <SelectItem key={step.id} value={step.key}>{step.label || step.key}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                <Text label={__('Cc')} value={(item.cc ?? []).join(', ')} onChange={(value) => set({ ...item, cc: list(value) as Notification['cc'] })} />
                <Text label={__('Bcc')} value={(item.bcc ?? []).join(', ')} onChange={(value) => set({ ...item, bcc: list(value) as Notification['bcc'] })} />
              </div>
              <Text label={__('Subject')} value={item.subject} onChange={(subject) => set({ ...item, subject })} />
              <div className="cf:flex cf:flex-col cf:gap-1.5">
                <Label htmlFor={`cf-body-${item.id}`}>{__('Message')}</Label>
                <Textarea id={`cf-body-${item.id}`} rows={6} value={item.body} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => set({ ...item, body: event.target.value })} />
                <p className="cf:text-xs cf:text-muted-foreground">
                  {__('Merge tags: {{all_answers}}, {{field_key}}, {{form_title}}, {{submission_id}}, {{site_name}}, {{date}}')}{kind === 'admin' ? ', {{admin_link}}, {{meta_table}}' : ''}
                </p>
              </div>
              <div className="cf:grid cf:gap-3 cf:sm:grid-cols-3">
                <Text label={__('Reply-to')} value={item.replyTo ?? ''} onChange={(replyTo) => set({ ...item, replyTo })} />
                <Text label={__('From name')} value={item.fromName ?? ''} placeholder={__('Site default')} onChange={(fromName) => set({ ...item, fromName })} />
                <Text label={__('Delay (seconds)')} value={item.delaySeconds ? String(item.delaySeconds) : ''} placeholder="0"
                  onChange={(value) => set({ ...item, delaySeconds: Math.max(0, Math.min(86400, Number(value) || 0)) })} />
              </div>
              <div className="cf:flex cf:items-center cf:justify-between">
                <Label htmlFor={`cf-conditions-${item.id}`}>{__('Only when the answers match')}</Label>
                <Switch id={`cf-conditions-${item.id}`} checked={Boolean(item.conditions)}
                  onCheckedChange={(on: boolean) => set(on ? { ...item, conditions: { all: [newPredicate(form.schema)] } } : (({ conditions: _drop, ...rest }) => rest as Notification)(item))} />
              </div>
              {item.conditions && <ConditionGroup schema={form.schema} value={item.conditions} onChange={(conditions) => set({ ...item, conditions })} />}
            </div>
          ))}
          <Button variant="outline" size="sm" className="cf:self-start" disabled={items.length >= MAX} onClick={() => add(kind)}><Plus /> {kind === 'admin' ? __('Add admin email') : __('Add autoresponder')}</Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="cf:flex cf:flex-col cf:gap-4">
      {section('admin', __('Admin notifications'), __('Sent to you or your team when someone submits.'))}
      <Card>
        <CardContent className="cf:flex cf:items-center cf:justify-between cf:gap-4 cf:pt-6">
          <Label htmlFor="cf-notify-abandoned">{__('Also notify when a visitor leaves contact details but does not finish')}</Label>
          <Switch id="cf-notify-abandoned" checked={Boolean(group.notifyAbandoned)} onCheckedChange={(notifyAbandoned: boolean) => setGroup({ ...group, notifyAbandoned })} />
        </CardContent>
      </Card>
      {section('autoresponders', __('Autoresponders'), __('Sent to the visitor, at the email address they typed.'))}
      <Card>
        <CardContent className="cf:flex cf:items-center cf:justify-between cf:gap-4 cf:pt-6">
          <Label htmlFor="cf-first-match">{__('Send only the first autoresponder that matches')}</Label>
          <Switch id="cf-first-match" checked={Boolean(group.firstMatchOnly)} onCheckedChange={(firstMatchOnly: boolean) => setGroup({ ...group, firstMatchOnly })} />
        </CardContent>
      </Card>

      <Dialog open={preview !== null} onOpenChange={(open: boolean) => !open && setPreview(null)}>
        <DialogContent className="cf:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{preview?.subject}</DialogTitle>
            <DialogDescription>{__('With sample answers. Links and buttons are not clickable here.')}</DialogDescription>
          </DialogHeader>
          {/* Sandboxed: the email's HTML never runs scripts or touches the admin page. */}
          <iframe title={__('Email preview')} sandbox="" srcDoc={preview?.html ?? ''} className="cf:h-[60vh] cf:w-full cf:rounded-md cf:border cf:bg-white" />
          {/* Escape doesn't reach the dialog while focus is inside the email. */}
          <DialogFooter><Button variant="outline" onClick={() => setPreview(null)}>{__('Close')}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <TestDialog api={api} form={form} notification={testing} onClose={() => setTesting(null)} />
    </div>
  );
}

function Text({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  return (
    <div className="cf:flex cf:flex-col cf:gap-1.5">
      <Label>{label}</Label>
      <Input aria-label={label} value={value} placeholder={placeholder} onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)} />
    </div>
  );
}

function TestDialog({ api, form, notification, onClose }: { api: AdminApi; form: FormDTO; notification: Notification | null; onClose: () => void }) {
  const [to, setTo] = useState('');
  const [busy, setBusy] = useState(false);
  const send = async () => {
    setBusy(true);
    try {
      await api.request('admin/notifications/test', 'POST', { formId: form.id, notificationId: notification!.id, to });
      toast.success(sprintf(__('Test email queued to %s.'), to));
      onClose();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog open={notification !== null} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{__('Send a test email')}</DialogTitle>
          <DialogDescription>{__('Uses the published version of this email, with sample answers. Publish first to test your latest changes.')}</DialogDescription>
        </DialogHeader>
        <Input type="email" aria-label={__('Send the test to')} placeholder="you@example.com" value={to} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTo(event.target.value)} />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{__('Cancel')}</Button>
          <Button disabled={busy || !to.includes('@') || form.version < 1} onClick={() => void send()}>{__('Send test')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
