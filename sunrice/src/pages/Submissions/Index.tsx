import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Badge, Button, Card, Checkbox, DatePicker, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Input, Label, PageHeader,
  Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs, TabsList, TabsTrigger, toast, useBreadcrumbs,
} from '@imajiner/admin-sdk/ui';
import { ChevronLeft, ChevronRight, Download, ListFilter, Search, Star, X } from 'lucide-react';
import { answerOperators, displayValue, operatorLabel, responseLabel, statusLabel, type SubmissionDTO } from '@chatflow/submissions/model';
import { ExportDialog } from '@/components/submissions/ExportDialog';
import { FormPicker } from '@/components/submissions/FormPicker';
import { useConfirm } from '@/components/useConfirm';
import { can, errorMessage, useAdminApi, type AdminConfig } from '@/lib/api';
import { answerText, formatDateTime } from '@/lib/format';
import { __, sprintf } from '@/lib/i18n';
import { answerColumnKeys, inboxQueryString, isFiltered, parseInboxQuery, PER_PAGE_OPTIONS, type Filters, type InboxQuery, type Status } from '@/lib/inbox';
import { urls } from '@/lib/urls';

interface SubmissionPage {
  items: SubmissionDTO[];
  total: number;
  page: number;
  perPage: number;
  /** Frozen form title and field labels by "formId:version". */
  forms: Record<string, { title: string; labels: Record<string, string> }>;
}

type BulkChange = { isRead?: boolean; isStarred?: boolean; status?: Status | 'restore' };

const TABS: Status[] = ['completed', 'partial', 'abandoned', 'spam', 'trash'];

export default function SubmissionsIndex({ config }: { config: AdminConfig }) {
  useBreadcrumbs([{ label: __('Submissions') }]);
  const api = useAdminApi(config);
  const [confirm, confirmDialog] = useConfirm();
  const [query, setQuery] = useState<InboxQuery>(() => parseInboxQuery(window.location.search));
  const [list, setList] = useState<SubmissionPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [revision, setRevision] = useState(0);
  const [search, setSearch] = useState(query.filters.search ?? '');
  const [formTitle, setFormTitle] = useState<string | undefined>();
  const [exporting, setExporting] = useState(false);
  const [erasing, setErasing] = useState(false);
  const { filters } = query;
  const canEdit = can(config, 'edit_submissions');
  const canDelete = can(config, 'delete_submissions');

  /** Changes the state (back to page 1 unless a page is given) and keeps it in the address. */
  const latest = useRef(query);
  latest.current = query;
  const update = useCallback((changes: Partial<Filters>, paging: Partial<Pick<InboxQuery, 'page' | 'perPage'>> = {}) => {
    const current = latest.current;
    const next: InboxQuery = { filters: { ...current.filters, ...changes }, page: paging.page ?? 1, perPage: paging.perPage ?? current.perPage };
    for (const key of Object.keys(next.filters) as (keyof Filters)[]) {
      if (next.filters[key] === undefined || next.filters[key] === '') delete next.filters[key];
    }
    const string = inboxQueryString(next);
    router.replace({ url: urls.submissions() + (string ? `?${string}` : ''), preserveState: true, preserveScroll: true });
    latest.current = next;
    setQuery(next);
  }, []);

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true);
    setError('');
    api.request<SubmissionPage>(`admin/submissions?${inboxQueryString(query, true)}`, 'GET', undefined, abort.signal)
      .then((result) => {
        // A bulk action can empty the last page: go to the new last one.
        if (!result.items.length && result.total > 0 && query.page > 1) {
          update({}, { page: Math.max(1, Math.ceil(result.total / query.perPage)) });
          return;
        }
        setList(result);
        setSelected([]);
        if (filters.formId) {
          const frozen = Object.entries(result.forms).find(([key]) => key.startsWith(`${filters.formId}:`));
          if (frozen) setFormTitle((title) => title ?? frozen[1].title);
        }
      })
      .catch((failure) => !abort.signal.aborted && setError(errorMessage(failure)))
      .finally(() => !abort.signal.aborted && setLoading(false));
    return () => abort.abort();
  }, [api, query, revision]); // eslint-disable-line react-hooks/exhaustive-deps

  // Search as you type, a moment after the last key.
  useEffect(() => {
    if (search === (filters.search ?? '')) return;
    const timer = window.setTimeout(() => update({ search }), 300);
    return () => window.clearTimeout(timer);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const formLabels = useMemo(() => {
    if (!filters.formId || !list) return undefined;
    const versions = Object.entries(list.forms).filter(([key]) => key.startsWith(`${filters.formId}:`));
    return versions.length ? Object.assign({}, ...versions.map(([, form]) => form.labels)) as Record<string, string> : undefined;
  }, [filters.formId, list]);
  const columns = useMemo(() => answerColumnKeys(formLabels, list?.items ?? []), [formLabels, list]);
  const label = (key: string) => formLabels?.[key] ?? Object.values(list?.forms ?? {}).find((form) => form.labels[key])?.labels[key] ?? key;

  const bulk = async (changes: BulkChange | 'permanent') => {
    try {
      await api.request('admin/submissions/bulk', 'POST', changes === 'permanent'
        ? { ids: selected, permanent: true, confirmation: 'DELETE' }
        : { ids: selected, changes });
      toast.success(sprintf(__('%d submissions updated.'), selected.length));
    } catch (failure) {
      toast.error(errorMessage(failure));
    } finally {
      setRevision((value) => value + 1);
    }
  };

  const trashSelected = async () => {
    if (await confirm({ title: sprintf(__('Move %d submissions to the trash?'), selected.length), confirmLabel: __('Move to trash'), destructive: true })) await bulk({ status: 'trash' });
  };

  const resend = async () => {
    if (!(await confirm({
      title: sprintf(__('Resend emails for %d submissions?'), selected.length),
      description: __('Every admin notification and autoresponder that matches each submission is sent again.'),
      confirmLabel: __('Resend'),
    }))) return;
    const requestId = crypto.randomUUID();
    const results = await Promise.allSettled(selected.map((id) => api.request(`admin/submissions/${id}/resend`, 'POST', { requestId })));
    const failed = results.filter((result) => result.status === 'rejected').length;
    if (failed) toast.error(sprintf(__('Resent %1$d of %2$d submissions; %3$d failed.'), selected.length - failed, selected.length, failed));
    else toast.success(__('Emails queued.'));
  };

  const items = list?.items ?? [];
  const allSelected = items.length > 0 && selected.length === items.length;
  const pages = list ? Math.max(1, Math.ceil(list.total / list.perPage)) : 1;
  const backQuery = inboxQueryString(query);
  const trash = filters.status === 'trash';

  return (
    <div className="cf:flex cf:flex-col cf:gap-6">
      <Head title={__('Submissions')} />
      {confirmDialog}

      <PageHeader
        title={__('Submissions')}
        description={__('Read every response, follow up on partial conversations and export what you need.')}
        primary={can(config, 'export_submissions') && (
          <Button variant="outline" onClick={() => setExporting(true)}><Download /> {__('Export CSV')}</Button>
        )}
      />

      <Tabs value={filters.status ?? 'completed'} onValueChange={(value: string) => update({ status: value as Status })}>
        <TabsList>
          {TABS.map((status) => <TabsTrigger key={status} value={status}>{statusLabel(status)}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <div className="cf:flex cf:flex-wrap cf:items-center cf:gap-2">
        <FormPicker api={api} value={filters.formId} label={formTitle} allLabel={__('All forms')}
          onChange={(id, title) => { setFormTitle(title); update({ formId: id, fieldKey: undefined, operator: undefined, value: undefined }); }} />
        <div className="cf:relative cf:w-full cf:max-w-xs">
          <Search className="cf:pointer-events-none cf:absolute cf:top-1/2 cf:left-2.5 cf:size-4 cf:-translate-y-1/2 cf:text-muted-foreground" />
          <Input className="cf:pl-9" placeholder={__('Search answers…')} aria-label={__('Search answers')} value={search}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)} />
        </div>
        <MoreFilters filters={filters} labels={formLabels} onChange={update} />
        {isFiltered(filters) && (
          <Button variant="ghost" onClick={() => { setSearch(''); setFormTitle(undefined); update({ formId: undefined, from: undefined, to: undefined, search: undefined, isRead: undefined, isStarred: undefined, fieldKey: undefined, operator: undefined, value: undefined }); }}>
            <X /> {__('Reset filters')}
          </Button>
        )}
      </div>

      {selected.length > 0 && (
        <div className="cf:flex cf:flex-wrap cf:items-center cf:gap-2" role="toolbar" aria-label={__('Bulk actions')}>
          <span className="cf:text-sm cf:text-muted-foreground">{sprintf(__('%d selected'), selected.length)}</span>
          {canEdit && !trash && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline">{__('Mark as…')}</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onSelect={() => void bulk({ isRead: true })}>{__('Read')}</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => void bulk({ isRead: false })}>{__('Unread')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void bulk({ isStarred: true })}>{__('Starred')}</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => void bulk({ isStarred: false })}>{__('Not starred')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                {filters.status === 'spam'
                  ? <DropdownMenuItem onSelect={() => void bulk({ status: 'completed' })}>{__('Not spam')}</DropdownMenuItem>
                  : <DropdownMenuItem onSelect={() => void bulk({ status: 'spam' })}>{__('Spam')}</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {canEdit && filters.status === 'completed' && <Button variant="outline" onClick={() => void resend()}>{__('Resend emails')}</Button>}
          {canDelete && !trash && <Button variant="outline" className="cf:text-destructive" onClick={() => void trashSelected()}>{__('Move to trash')}</Button>}
          {canDelete && trash && (
            <>
              <Button variant="outline" onClick={() => void bulk({ status: 'restore' })}>{__('Restore')}</Button>
              <Button variant="destructive" onClick={() => setErasing(true)}>{__('Delete permanently')}</Button>
            </>
          )}
        </div>
      )}

      {error && <p className="cf:text-sm cf:text-destructive" role="alert">{error}</p>}

      <Card className="cf:gap-0 cf:overflow-hidden cf:py-0">
        <Table>
          <TableHeader className="cf:bg-muted/60">
            <TableRow className="cf:hover:bg-transparent">
              <TableHead className="cf:w-8">
                <Checkbox aria-label={__('Select all rows')} checked={allSelected} disabled={!items.length}
                  onCheckedChange={(checked: boolean) => setSelected(checked ? items.map((item) => item.id) : [])} />
              </TableHead>
              <TableHead>{__('Submission')}</TableHead>
              <TableHead>{__('Date')}</TableHead>
              {columns.map((key) => <TableHead key={key}>{label(key)}</TableHead>)}
              <TableHead>{__('Progress')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && !list && Array.from({ length: 3 }, (_, index) => (
              <TableRow key={`skeleton-${index}`} aria-hidden="true">
                {Array.from({ length: 4 + columns.length }, (_, cell) => <TableCell key={cell}><Skeleton className="cf:h-4 cf:w-24" /></TableCell>)}
              </TableRow>
            ))}
            {items.map((item) => {
              const form = list?.forms[`${item.formId}:${item.formVersion}`];
              return (
                <TableRow key={item.id} data-state={selected.includes(item.id) ? 'selected' : undefined} className={loading ? 'cf:opacity-60' : undefined}>
                  <TableCell>
                    <Checkbox aria-label={sprintf(__('Select %s'), responseLabel(item.id))} checked={selected.includes(item.id)}
                      onCheckedChange={(checked: boolean) => setSelected((current) => checked ? [...current, item.id] : current.filter((id) => id !== item.id))} />
                  </TableCell>
                  <TableCell>
                    <div className="cf:flex cf:items-center cf:gap-2">
                      {!item.isRead && <span className="cf:size-2 cf:shrink-0 cf:rounded-full cf:bg-primary" aria-label={__('Unread')} />}
                      <Link href={urls.submission(item.id) + (backQuery ? `?back=${encodeURIComponent(backQuery)}` : '')}
                        className={`cf:underline-offset-4 cf:hover:underline ${item.isRead ? '' : 'cf:font-semibold'}`}>
                        {responseLabel(item.id)}
                      </Link>
                      {item.isStarred && <Star className="cf:size-3.5 cf:fill-current cf:text-amber-500" aria-label={__('Starred')} />}
                    </div>
                    <div className="cf:text-xs cf:text-muted-foreground">{form ? `${form.title} · v${item.formVersion}` : `#${item.formId}`}</div>
                  </TableCell>
                  <TableCell className="cf:whitespace-nowrap">{formatDateTime(item.createdAt)}</TableCell>
                  {columns.map((key) => <TableCell key={key}><div className="cf:max-w-56 cf:truncate">{answerText(item.answers[key], displayValue) || '—'}</div></TableCell>)}
                  <TableCell className="cf:whitespace-nowrap">
                    <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>{statusLabel(item.status)}</Badge>
                    <span className="cf:ml-2 cf:text-xs cf:text-muted-foreground cf:tabular-nums">{item.progress}%</span>
                  </TableCell>
                </TableRow>
              );
            })}
            {!loading && list && !items.length && (
              <TableRow>
                <TableCell colSpan={4 + columns.length} className="cf:h-24 cf:text-center cf:text-muted-foreground">
                  {isFiltered(filters) ? __('Nothing matches. Try another form, date range or search.') : __('No submissions here yet.')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {list && list.total > 0 && (
        <div className="cf:flex cf:flex-wrap cf:items-center cf:justify-end cf:gap-2 cf:text-sm cf:text-muted-foreground">
          <span>{sprintf(__('%d submissions'), list.total)}</span>
          <Select value={String(query.perPage)} onValueChange={(value: string) => update({}, { perPage: Number(value) })}>
            <SelectTrigger className="cf:w-32" aria-label={__('Rows per page')}><SelectValue /></SelectTrigger>
            <SelectContent>{PER_PAGE_OPTIONS.map((size) => <SelectItem key={size} value={String(size)}>{sprintf(__('%d per page'), size)}</SelectItem>)}</SelectContent>
          </Select>
          <span>{sprintf(__('Page %1$d of %2$d'), query.page, pages)}</span>
          <Button variant="outline" size="icon" className="cf:size-8" aria-label={__('Previous page')} disabled={query.page <= 1}
            onClick={() => update({}, { page: query.page - 1 })}><ChevronLeft /></Button>
          <Button variant="outline" size="icon" className="cf:size-8" aria-label={__('Next page')} disabled={query.page >= pages}
            onClick={() => update({}, { page: query.page + 1 })}><ChevronRight /></Button>
        </div>
      )}

      <ExportDialog api={api} open={exporting} onOpenChange={setExporting} filters={filters} ids={selected} formTitle={formTitle} />
      <EraseDialog open={erasing} count={selected.length} onOpenChange={setErasing} onConfirm={() => { setErasing(false); void bulk('permanent'); }} />
    </div>
  );
}

/** Dates, read/starred and (with one form chosen) an answer condition. */
function MoreFilters({ filters, labels, onChange }: { filters: Filters; labels?: Record<string, string>; onChange: (changes: Partial<Filters>) => void }) {
  const active = [filters.from, filters.to, filters.isRead, filters.isStarred, filters.fieldKey].filter((value) => value !== undefined).length;
  const flag = (value: boolean | undefined) => (value === undefined ? 'any' : value ? 'yes' : 'no');
  const fromFlag = (value: string) => (value === 'any' ? undefined : value === 'yes');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline"><ListFilter /> {__('Filters')}{active > 0 && <Badge variant="secondary" className="cf:ml-1">{active}</Badge>}</Button>
      </PopoverTrigger>
      <PopoverContent className="cf:flex cf:w-80 cf:flex-col cf:gap-4" align="start">
        <div className="cf:grid cf:grid-cols-2 cf:gap-2">
          <div className="cf:flex cf:flex-col cf:gap-1.5">
            <Label>{__('From')}</Label>
            <DatePicker value={filters.from ?? null} onChange={(value: string | null) => onChange({ from: value ?? undefined })} />
          </div>
          <div className="cf:flex cf:flex-col cf:gap-1.5">
            <Label>{__('To')}</Label>
            <DatePicker value={filters.to ?? null} onChange={(value: string | null) => onChange({ to: value ?? undefined })} />
          </div>
        </div>
        <div className="cf:grid cf:grid-cols-2 cf:gap-2">
          <div className="cf:flex cf:flex-col cf:gap-1.5">
            <Label>{__('Read')}</Label>
            <Select value={flag(filters.isRead)} onValueChange={(value: string) => onChange({ isRead: fromFlag(value) })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{__('Any')}</SelectItem>
                <SelectItem value="no">{__('Unread')}</SelectItem>
                <SelectItem value="yes">{__('Read')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="cf:flex cf:flex-col cf:gap-1.5">
            <Label>{__('Starred')}</Label>
            <Select value={flag(filters.isStarred)} onValueChange={(value: string) => onChange({ isStarred: fromFlag(value) })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{__('Any')}</SelectItem>
                <SelectItem value="yes">{__('Starred')}</SelectItem>
                <SelectItem value="no">{__('Not starred')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="cf:flex cf:flex-col cf:gap-1.5">
          <Label>{__('Answer')}</Label>
          {labels ? (
            <>
              <Select value={filters.fieldKey ?? 'none'} onValueChange={(value: string) => onChange(value === 'none'
                ? { fieldKey: undefined, operator: undefined, value: undefined }
                : { fieldKey: value, operator: filters.operator ?? 'eq' })}>
                <SelectTrigger aria-label={__('Question')}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{__('Any answer')}</SelectItem>
                  {Object.entries(labels).map(([key, text]) => <SelectItem key={key} value={key}>{text}</SelectItem>)}
                </SelectContent>
              </Select>
              {filters.fieldKey && (
                <div className="cf:grid cf:grid-cols-2 cf:gap-2">
                  <Select value={filters.operator ?? 'eq'} onValueChange={(value: string) => onChange({ operator: value, value: value.startsWith('is_') ? undefined : filters.value })}>
                    <SelectTrigger aria-label={__('Condition')}><SelectValue /></SelectTrigger>
                    <SelectContent>{answerOperators.map((operator) => <SelectItem key={operator} value={operator}>{operatorLabel(operator)}</SelectItem>)}</SelectContent>
                  </Select>
                  {!filters.operator?.startsWith('is_') && (
                    <Input aria-label={__('Value')} defaultValue={filters.value ?? ''}
                      onBlur={(event: React.FocusEvent<HTMLInputElement>) => event.target.value !== (filters.value ?? '') && onChange({ value: event.target.value })}
                      onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => event.key === 'Enter' && onChange({ value: event.currentTarget.value })} />
                  )}
                </div>
              )}
            </>
          ) : <p className="cf:text-xs cf:text-muted-foreground">{__('Choose a form to filter by an answer.')}</p>}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Permanent deletion asks for the word DELETE, as the API requires. */
function EraseDialog({ open, count, onOpenChange, onConfirm }: { open: boolean; count: number; onOpenChange: (open: boolean) => void; onConfirm: () => void }) {
  const [typed, setTyped] = useState('');
  useEffect(() => setTyped(''), [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{sprintf(__('Delete %d submissions permanently?'), count)}</DialogTitle>
          <DialogDescription>{__('Their answers, notes and email history are erased. This cannot be undone. Type DELETE to confirm.')}</DialogDescription>
        </DialogHeader>
        <Input aria-label={__('Type DELETE to confirm')} value={typed} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTyped(event.target.value)} />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{__('Cancel')}</Button>
          <Button variant="destructive" disabled={typed !== 'DELETE'} onClick={onConfirm}>{__('Delete permanently')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
