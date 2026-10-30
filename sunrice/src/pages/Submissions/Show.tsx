import { useCallback, useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  Badge, Button, Card, CardContent, CardHeader, CardTitle, PageHeader, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, toast,
  useBreadcrumbs,
} from '@imajiner/admin-sdk/ui';
import { Copy, Mail, Printer, RefreshCw, Star, Trash2 } from 'lucide-react';
import type { AnswerMap } from '@chatflow/shared/contracts';
import { interpolate } from '@chatflow/shared/logic/index';
import { displayValue, responseLabel, statuses, statusLabel, type Status, type SubmissionDetail } from '@chatflow/submissions/model';
import { useConfirm } from '@/components/useConfirm';
import { can, errorMessage, useAdminApi, type AdminConfig } from '@/lib/api';
import { answerText, formatDateTime } from '@/lib/format';
import { __, sprintf } from '@/lib/i18n';
import { urls } from '@/lib/urls';

interface Activity {
  deliveries: { id: number; channel: string; destination_id: string; status: string; attempts: number; last_error: string | null; created_at: string }[];
  items: { id: number; type: string; body: string; created_at: string }[];
  page: number;
  perPage: number;
}

type Changes = { isRead?: boolean; isStarred?: boolean; status?: Status; note?: string };

export default function SubmissionShow({ submissionId, config }: { submissionId: number; config: AdminConfig }) {
  const api = useAdminApi(config);
  const [confirm, confirmDialog] = useConfirm();
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const canEdit = can(config, 'edit_submissions');
  const back = new URLSearchParams(window.location.search).get('back') ?? '';
  const inbox = urls.submissions() + (back ? `?${back}` : '');
  const title = detail ? `${detail.form?.title ?? __('Submission')} · ${responseLabel(detail.id)}` : responseLabel(submissionId);
  useBreadcrumbs([{ label: __('Submissions'), href: inbox }, { label: responseLabel(submissionId) }]);

  const load = useCallback(() => api.request<SubmissionDetail>(`admin/submissions/${submissionId}`)
    .then((result) => { setDetail(result); setError(''); })
    .catch((failure) => setError(errorMessage(failure))), [api, submissionId]);
  useEffect(() => { void load(); }, [load]);

  const update = async (changes: Changes, done?: string): Promise<boolean> => {
    setBusy(true);
    try {
      await api.request(`admin/submissions/${submissionId}`, 'PATCH', changes);
      await load();
      if (done) toast.success(done);
      return true;
    } catch (failure) {
      toast.error(errorMessage(failure));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = async (status: Status) => {
    if (!detail || status === detail.status) return;
    if (await confirm({ title: sprintf(__('Change this submission to “%s”?'), statusLabel(status)), confirmLabel: __('Change status') })) {
      await update({ status }, __('Status changed.'));
    }
  };

  const resend = async () => {
    if (!(await confirm({ title: __('Resend this submission’s emails?'), description: __('Every admin notification and autoresponder that matches it is sent again.'), confirmLabel: __('Resend') }))) return;
    try {
      await api.request(`admin/submissions/${submissionId}/resend`, 'POST', { requestId: crypto.randomUUID() });
      toast.success(__('Emails queued.'));
    } catch (failure) {
      toast.error(errorMessage(failure));
    }
  };

  const trash = async () => {
    if (!(await confirm({ title: __('Move this submission to the trash?'), confirmLabel: __('Move to trash'), destructive: true }))) return;
    try {
      await api.request(`admin/submissions/${submissionId}`, 'DELETE');
      toast.success(__('Moved to the trash.'));
      router.visit(inbox);
    } catch (failure) {
      toast.error(errorMessage(failure));
    }
  };

  const copy = async (text: string, done: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(done);
    } catch {
      toast.error(__('Could not copy to the clipboard.'));
    }
  };

  if (!detail) {
    return (
      <div className="cf:flex cf:flex-col cf:gap-6">
        <Head title={title} />
        <PageHeader title={title} back={{ href: inbox, label: __('Submissions') }} />
        {error ? <p className="cf:text-sm cf:text-destructive" role="alert">{error}</p> : <Skeleton className="cf:h-64 cf:w-full" />}
      </div>
    );
  }

  const steps = detail.form?.schema.steps ?? [];
  const answered = steps.filter((step) => detail.visited.includes(step.id) && Object.prototype.hasOwnProperty.call(detail.answers, step.key));
  const notes = detail.notes.filter((item) => item.kind === 'note');

  return (
    <div className="cf:flex cf:flex-col cf:gap-6">
      <Head title={title} />
      {confirmDialog}
      <PageHeader
        title={title}
        description={[formatDateTime(detail.createdAt), sprintf(__('Form version %d'), detail.formVersion), sprintf(__('%ds'), Math.round(detail.durationMs / 1000)), `${detail.progress}%`].join(' · ')}
        back={{ href: inbox, label: __('Submissions') }}
        menu={[
          { label: __('Print'), icon: <Printer />, onSelect: () => window.print() },
          { label: __('Copy response ID'), icon: <Copy />, onSelect: () => void copy(detail.uuid, __('Response ID copied.')) },
          ...(canEdit && detail.status === 'completed' ? [{ label: __('Resend emails'), icon: <Mail />, onSelect: () => void resend() }] : []),
          ...(can(config, 'delete_submissions') && detail.status !== 'trash' ? [{ label: __('Move to trash'), icon: <Trash2 />, destructive: true, onSelect: () => void trash() }] : []),
        ]}
        actions={canEdit && (
          <>
            <Button variant="outline" disabled={busy} onClick={() => void update({ isRead: !detail.isRead })}>
              {detail.isRead ? __('Mark unread') : __('Mark read')}
            </Button>
            <Button variant="outline" disabled={busy} aria-pressed={detail.isStarred} onClick={() => void update({ isStarred: !detail.isStarred })}>
              <Star className={detail.isStarred ? 'cf:fill-current cf:text-amber-500' : undefined} /> {detail.isStarred ? __('Starred') : __('Star')}
            </Button>
          </>
        )}
      >
        <Badge variant={detail.status === 'completed' ? 'default' : 'secondary'}>{statusLabel(detail.status)}</Badge>
      </PageHeader>

      {!detail.form && <p className="cf:text-sm cf:text-muted-foreground">{__('The form as it was when this was answered is no longer available; answers are shown by field key.')}</p>}

      <div className="cf:grid cf:gap-6 cf:xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Tabs defaultValue="answers" className="cf:min-w-0">
          <TabsList>
            <TabsTrigger value="answers">{__('Answers')}</TabsTrigger>
            <TabsTrigger value="conversation">{__('Conversation')}</TabsTrigger>
            <TabsTrigger value="details">{__('Details')}</TabsTrigger>
            <TabsTrigger value="activity">{__('Emails')}</TabsTrigger>
          </TabsList>

          <TabsContent value="answers">
            <Card>
              <CardContent>
                <dl className="cf:divide-y cf:divide-border">
                  {(detail.form ? answered.map((step) => [step.id, step.label || step.key, detail.answers[step.key]] as const)
                    : Object.entries(detail.answers).map(([key, value]) => [key, key, value] as const)).map(([key, question, answer]) => (
                    <div key={key} className="cf:grid cf:gap-1 cf:py-3 cf:sm:grid-cols-[minmax(0,14rem)_1fr] cf:sm:gap-4">
                      <dt className="cf:text-sm cf:text-muted-foreground">{question}</dt>
                      <dd className="cf:whitespace-pre-wrap cf:break-words">{answerText(answer, displayValue) || '—'}</dd>
                    </div>
                  ))}
                  {!Object.keys(detail.answers).length && <p className="cf:py-3 cf:text-muted-foreground">{__('No answers yet.')}</p>}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversation">
            <Card>
              <CardContent>
                <ol className="cf:flex cf:flex-col cf:gap-3">
                  {detail.visited.map((stepId) => {
                    const step = steps.find((item) => item.id === stepId);
                    if (!step) return null;
                    return (
                      <li key={stepId} className="cf:flex cf:flex-col cf:gap-2">
                        {step.messages.map((message, index) => (
                          <p key={index} className="cf:max-w-[80%] cf:self-start cf:rounded-lg cf:bg-muted cf:px-3 cf:py-2 cf:text-sm">
                            {interpolate(message, detail.answers as AnswerMap, detail.meta as AnswerMap)}
                          </p>
                        ))}
                        {Object.prototype.hasOwnProperty.call(detail.answers, step.key) && (
                          <p className="cf:max-w-[80%] cf:self-end cf:rounded-lg cf:bg-primary cf:px-3 cf:py-2 cf:text-sm cf:text-primary-foreground">
                            {answerText(detail.answers[step.key], displayValue) || __('Skipped')}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardContent className="cf:flex cf:flex-col cf:gap-4">
                <Section title={__('Response ID')}>
                  <code className="cf:text-sm">{detail.uuid}</code>
                </Section>
                <Section title={__('Field keys')}>
                  <dl className="cf:grid cf:grid-cols-[auto_1fr] cf:gap-x-4 cf:gap-y-1 cf:text-sm">
                    {steps.filter((step) => step.key).map((step) => (
                      <div key={step.id} className="cf:contents"><dt className="cf:text-muted-foreground">{step.label || step.key}</dt><dd><code>{step.key}</code></dd></div>
                    ))}
                  </dl>
                </Section>
                <Section title={__('Collected metadata')}><Json value={detail.meta} /></Section>
                <Section title={__('Recorded consent text and version')}><Json value={detail.consent} /></Section>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <EmailActivity api={api} id={submissionId} canRetry={canEdit} />
          </TabsContent>
        </Tabs>

        <aside className="cf:flex cf:flex-col cf:gap-6">
          {canEdit && (
            <Card>
              <CardHeader><CardTitle>{__('Status')}</CardTitle></CardHeader>
              <CardContent>
                <Select value={detail.status} onValueChange={(value: string) => void changeStatus(value as Status)} disabled={busy}>
                  <SelectTrigger aria-label={__('Status')}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.filter((status) => status !== 'trash' || status === detail.status || can(config, 'delete_submissions'))
                      .map((status) => <SelectItem key={status} value={status}>{statusLabel(status)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader><CardTitle>{__('Notes')}</CardTitle></CardHeader>
            <CardContent className="cf:flex cf:flex-col cf:gap-3">
              {notes.length ? (
                <ul className="cf:flex cf:flex-col cf:gap-3">
                  {notes.map((item) => (
                    <li key={item.id} className="cf:text-sm">
                      <p className="cf:whitespace-pre-wrap">{item.message}</p>
                      <time className="cf:text-xs cf:text-muted-foreground" dateTime={item.createdAt}>{formatDateTime(item.createdAt)}</time>
                    </li>
                  ))}
                </ul>
              ) : <p className="cf:text-sm cf:text-muted-foreground">{__('No notes yet.')}</p>}
              {canEdit && (
                <>
                  <Textarea aria-label={__('Add a private note')} placeholder={__('Add a private note…')} value={note} rows={3}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setNote(event.target.value)} />
                  <Button variant="outline" disabled={busy || !note.trim()} onClick={async () => { if (await update({ note }, __('Note added.'))) setNote(''); }}>
                    {__('Add note')}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="cf:flex cf:flex-col cf:gap-2">
      <h3 className="cf:text-sm cf:font-medium">{title}</h3>
      {children}
    </section>
  );
}

function Json({ value }: { value: unknown }) {
  return <pre className="cf:max-h-80 cf:overflow-auto cf:rounded-md cf:bg-muted cf:p-3 cf:text-xs">{JSON.stringify(value, null, 2)}</pre>;
}

/** Delivery notes store `{code, deliveryId, attempt}` JSON: show the outcome code. */
function outcome(body: string): string {
  try {
    const parsed: unknown = JSON.parse(body);
    if (parsed && typeof parsed === 'object' && typeof (parsed as { code?: unknown }).code === 'string') return (parsed as { code: string }).code;
  } catch {
    // Older notes are plain text.
  }
  return body;
}

/** The submission's email deliveries (with Retry) and their history, newest first. */
function EmailActivity({ api, id, canRetry }: { api: ReturnType<typeof useAdminApi>; id: number; canRetry: boolean }) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const latest = useRef(0);

  const load = useCallback((wanted: number) => {
    const request = ++latest.current;
    setBusy(true);
    return api.request<Activity>(`admin/submissions/${id}/activity?page=${wanted}&perPage=50`)
      .then((result) => { if (request === latest.current) { setActivity(result); setPage(result.page); } })
      .catch((failure) => request === latest.current && toast.error(errorMessage(failure)))
      .finally(() => request === latest.current && setBusy(false));
  }, [api, id]);
  useEffect(() => { void load(1); }, [load]);

  const retry = async (deliveryId: number) => {
    try {
      await api.request(`admin/submissions/${id}/retry`, 'POST', { deliveryId });
      toast.success(__('Delivery queued again.'));
      await load(page);
    } catch (failure) {
      toast.error(errorMessage(failure));
    }
  };

  const more = Boolean(activity && (activity.items.length >= activity.perPage || activity.deliveries.length >= activity.perPage));

  return (
    <Card>
      <CardHeader className="cf:flex cf:flex-row cf:items-center cf:justify-between">
        <CardTitle>{__('Email deliveries')}</CardTitle>
        <Button variant="ghost" size="sm" disabled={busy} onClick={() => void load(page)}><RefreshCw /> {__('Refresh')}</Button>
      </CardHeader>
      <CardContent className="cf:flex cf:flex-col cf:gap-4">
        {activity && !activity.deliveries.length && <p className="cf:text-sm cf:text-muted-foreground">{__('No emails for this submission.')}</p>}
        {activity && activity.deliveries.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{__('Email')}</TableHead>
                <TableHead>{__('Status')}</TableHead>
                <TableHead>{__('Attempts')}</TableHead>
                <TableHead>{__('Created')}</TableHead>
                {canRetry && <TableHead className="cf:w-px"><span className="cf:sr-only">{__('Actions')}</span></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {activity.deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell>{delivery.channel} · {delivery.destination_id}</TableCell>
                  <TableCell>
                    <Badge variant={delivery.status === 'failed' ? 'destructive' : delivery.status === 'sent' ? 'default' : 'secondary'}>{delivery.status}</Badge>
                    {delivery.last_error && <p className="cf:mt-1 cf:text-xs cf:text-destructive">{delivery.last_error}</p>}
                  </TableCell>
                  <TableCell className="cf:tabular-nums">{delivery.attempts}</TableCell>
                  <TableCell className="cf:whitespace-nowrap">{formatDateTime(delivery.created_at)}</TableCell>
                  {canRetry && (
                    <TableCell>
                      <Button variant="outline" size="sm" disabled={busy || !['failed', 'sent'].includes(delivery.status)} onClick={() => void retry(delivery.id)}>
                        {delivery.status === 'sent' ? __('Send again') : __('Retry')}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {activity && activity.items.length > 0 && (
          <ul className="cf:flex cf:flex-col cf:gap-2 cf:text-sm">
            {activity.items.map((item) => (
              <li key={item.id}>
                <time className="cf:text-muted-foreground" dateTime={item.created_at}>{formatDateTime(item.created_at)}</time> · {outcome(item.body)}
              </li>
            ))}
          </ul>
        )}
        {(page > 1 || more) && (
          <div className="cf:flex cf:gap-2">
            <Button variant="outline" size="sm" disabled={busy || page <= 1} onClick={() => void load(page - 1)}>{__('Newer')}</Button>
            <Button variant="outline" size="sm" disabled={busy || !more} onClick={() => void load(page + 1)}>{__('Older')}</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
