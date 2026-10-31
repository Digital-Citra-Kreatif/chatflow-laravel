import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Badge, Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
  Input, PageHeader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs, TabsList, TabsTrigger,
  TrashBanner, TrashHint, TrashTitle, toast, useBreadcrumbs,
} from '@imajiner/admin-sdk/ui';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, Plus, RotateCcw, Search, Trash2 } from 'lucide-react';
import { downloadForm } from '@chatflow/builder/formIO';
import { useConfirm } from '@/components/useConfirm';
import { errorMessage, useAdminApi, type AdminConfig, type FormDTO } from '@/lib/api';
import { formatDateTime, formatPercent, relativeTime } from '@/lib/format';
import { __, sprintf } from '@/lib/i18n';
import { urls } from '@/lib/urls';

export interface FormItem {
  id: number;
  name: string;
  status: 'draft' | 'publish' | 'trash';
  version: number;
  embed: string;
  shareUrl: string | null;
  completed: number;
  started: number;
  completionRate: number;
  lastSubmissionAt: string | null;
}

interface Filters {
  status: '' | 'draft' | 'publish' | 'trash';
  search: string;
  sort: 'title' | 'updated_at';
  order: 'asc' | 'desc';
}

interface Props {
  forms: { data: FormItem[]; total: number; page: number; pages: number };
  filters: Filters;
  counts: { all: number; draft: number; publish: number; trash: number };
  config: AdminConfig;
}

export default function FormsIndex({ forms, filters, counts, config }: Props) {
  useBreadcrumbs([{ label: __('Forms') }]);
  const api = useAdminApi(config);
  const [confirm, confirmDialog] = useConfirm();
  const [search, setSearch] = useState(filters.search);
  const trashed = filters.status === 'trash';

  const visit = (changes: Partial<Filters & { page: number }>) => {
    const next = { ...filters, page: 1, ...changes };
    router.get(
      urls.forms({
        status: next.status,
        search: next.search,
        sort: next.sort === 'title' ? 'title' : undefined,
        order: next.sort === 'title' ? next.order : undefined,
        page: next.page > 1 ? next.page : undefined,
      }),
      {},
      { preserveState: true, preserveScroll: true, replace: true },
    );
  };

  // Search as you type, a moment after the last key.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const timer = window.setTimeout(() => search !== filters.search && visit({ search }), 300);
    return () => window.clearTimeout(timer);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const sortByName = () => visit({ sort: 'title', order: filters.sort === 'title' && filters.order === 'asc' ? 'desc' : 'asc' });

  const post = (url: string) => router.post(url, {}, { preserveScroll: true });

  const exportJson = async (form: FormItem) => {
    try {
      downloadForm(await api.request<FormDTO>(`admin/forms/${form.id}`));
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const copyEmbed = async (form: FormItem) => {
    try {
      await navigator.clipboard.writeText(form.embed);
      toast.success(__('Embed code copied.'));
    } catch {
      toast.error(__('The embed code could not be copied.'));
    }
  };

  const trash = async (form: FormItem) => {
    if (form.status === 'publish' && !(await confirm({
      title: sprintf(__('Move “%s” to the trash?'), form.name),
      description: __('It is live: new visitors cannot start it afterwards. Its submissions are kept, and you can restore it from the trash.'),
      confirmLabel: __('Move to trash'),
      destructive: true,
    }))) return;
    post(urls.formAction(form.id, 'trash'));
  };

  const deleteForever = async (form: FormItem) => {
    if (!(await confirm({
      title: sprintf(__('Delete “%s” permanently?'), form.name),
      description: __('This cannot be undone. Forms that still have submissions cannot be deleted.'),
      confirmLabel: __('Delete permanently'),
      destructive: true,
    }))) return;
    router.delete(urls.form(form.id), { preserveScroll: true });
  };

  const now = new Date();
  const statusTab = filters.status === 'trash' ? '' : filters.status;

  return (
    <div className="cf:flex cf:flex-col cf:gap-6">
      <Head title={__('Forms')} />
      {confirmDialog}

      <PageHeader
        title={trashed ? <TrashTitle>{__('Forms')}</TrashTitle> : __('Forms')}
        description={trashed ? undefined : __('Conversational forms that feel like a chat. Draft here, publish when you are ready to share.')}
        primary={!trashed && (
          <Button asChild>
            <Link href={urls.createForm()}><Plus /> {__('New form')}</Link>
          </Button>
        )}
      />

      {trashed && <TrashBanner items={__('forms')} onBack={() => visit({ status: '' })} />}

      <div className="cf:flex cf:flex-wrap cf:items-center cf:gap-2">
        {!trashed && (
          <Tabs value={statusTab || 'all'} onValueChange={(value: string) => visit({ status: value === 'all' ? '' : (value as Filters['status']) })}>
            <TabsList>
              <TabsTrigger value="all">{__('All')} <Count value={counts.all} /></TabsTrigger>
              <TabsTrigger value="publish">{__('Live')} <Count value={counts.publish} /></TabsTrigger>
              <TabsTrigger value="draft">{__('Draft')} <Count value={counts.draft} /></TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        <div className="cf:relative cf:w-full cf:max-w-xs">
          <Search className="cf:pointer-events-none cf:absolute cf:top-1/2 cf:left-2.5 cf:size-4 cf:-translate-y-1/2 cf:text-muted-foreground" />
          <Input className="cf:pl-9" placeholder={__('Search forms…')} aria-label={__('Search forms')} value={search}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)} />
        </div>
        {!trashed && counts.trash > 0 && (
          <Button variant="ghost" className="cf:ml-auto" onClick={() => visit({ status: 'trash' })}><Trash2 /> {__('Trash')}</Button>
        )}
      </div>

      <Card className="cf:gap-0 cf:overflow-hidden cf:py-0">
        <Table>
          <TableHeader className="cf:bg-muted/60">
            <TableRow className="cf:hover:bg-transparent">
              <TableHead>
                <button type="button" onClick={sortByName}
                  className="cf:-ml-2 cf:inline-flex cf:h-8 cf:items-center cf:gap-1 cf:rounded-md cf:px-2 cf:hover:bg-accent cf:hover:text-accent-foreground">
                  {__('Name')}
                  {filters.sort !== 'title' ? <ArrowUpDown className="cf:size-3 cf:opacity-40" />
                    : filters.order === 'asc' ? <ArrowUp className="cf:size-3" /> : <ArrowDown className="cf:size-3" />}
                </button>
              </TableHead>
              <TableHead>{__('Status')}</TableHead>
              <TableHead className="cf:text-right">{__('Submissions')}</TableHead>
              <TableHead className="cf:text-right">{__('Completion')}</TableHead>
              <TableHead>{__('Last submission')}</TableHead>
              <TableHead className="cf:w-px"><span className="cf:sr-only">{__('Actions')}</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.data.map((form) => (
              <TableRow key={form.id} className={trashed ? 'cf:text-muted-foreground' : undefined}>
                <TableCell>
                  <div className="cf:max-w-80 cf:truncate">
                    {trashed ? <span className="cf:font-medium">{form.name}</span> : (
                      <Link href={urls.form(form.id)} className="cf:font-medium cf:underline-offset-4 cf:hover:underline">{form.name}</Link>
                    )}
                  </div>
                </TableCell>
                <TableCell><StatusBadge form={form} /></TableCell>
                <TableCell className="cf:text-right cf:tabular-nums">
                  {form.completed > 0 && !trashed ? (
                    <Link href={urls.submissions({ formId: form.id })} className="cf:underline-offset-4 cf:hover:underline">{form.completed}</Link>
                  ) : form.completed}
                </TableCell>
                <TableCell className="cf:text-right cf:tabular-nums">{form.started > 0 ? formatPercent(form.completionRate) : '—'}</TableCell>
                <TableCell className="cf:whitespace-nowrap" title={form.lastSubmissionAt ? formatDateTime(form.lastSubmissionAt) : undefined}>
                  {relativeTime(form.lastSubmissionAt, now) || '—'}
                </TableCell>
                <TableCell className="cf:w-px cf:text-right">
                  {trashed ? (
                    <div className="cf:flex cf:justify-end cf:gap-2">
                      <Button variant="outline" size="sm" onClick={() => post(urls.formAction(form.id, 'restore'))}><RotateCcw /> {__('Restore')}</Button>
                      <Button variant="ghost" size="sm" className="cf:text-destructive cf:hover:text-destructive" onClick={() => void deleteForever(form)}>
                        <Trash2 /> {__('Delete permanently')}
                      </Button>
                    </div>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cf:size-8" aria-label={sprintf(__('Actions for %s'), form.name)}><MoreHorizontal /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href={urls.form(form.id)}>{__('Edit')}</Link></DropdownMenuItem>
                        {form.shareUrl && (
                          <DropdownMenuItem asChild><a href={form.shareUrl} target="_blank" rel="noopener noreferrer">{__('Open live form')}</a></DropdownMenuItem>
                        )}
                        <DropdownMenuItem onSelect={() => void copyEmbed(form)}>{__('Copy embed code')}</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => post(urls.formAction(form.id, 'duplicate'))}>{__('Duplicate')}</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => void exportJson(form)}>{__('Export JSON')}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => void trash(form)}>{__('Move to trash')}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {forms.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="cf:h-24 cf:text-center cf:text-muted-foreground">
                  <span className="cf:flex cf:flex-col cf:items-center cf:gap-1">
                    {filters.search || filters.status === 'draft' || filters.status === 'publish'
                      ? __('Nothing matches.')
                      : trashed ? __('The trash is empty.') : __('No forms yet. Create one from a template or start blank.')}
                    {!trashed && <TrashHint count={counts.trash} onShow={() => visit({ status: 'trash' })} />}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {forms.pages > 1 && (
        <div className="cf:flex cf:items-center cf:justify-end cf:gap-2 cf:text-sm cf:text-muted-foreground">
          <span>{sprintf(__('Page %1$d of %2$d'), forms.page, forms.pages)}</span>
          <Button variant="outline" size="icon" className="cf:size-8" aria-label={__('Previous page')} disabled={forms.page <= 1}
            onClick={() => visit({ page: forms.page - 1 })}><ChevronLeft /></Button>
          <Button variant="outline" size="icon" className="cf:size-8" aria-label={__('Next page')} disabled={forms.page >= forms.pages}
            onClick={() => visit({ page: forms.page + 1 })}><ChevronRight /></Button>
        </div>
      )}
    </div>
  );
}

function Count({ value }: { value: number }) {
  return <span className="cf:ml-1 cf:text-xs cf:text-muted-foreground cf:tabular-nums">{value}</span>;
}

function StatusBadge({ form }: { form: FormItem }) {
  if (form.status === 'trash') return <Badge variant="outline">{__('Trash')}</Badge>;
  if (form.status === 'publish') return <Badge>{sprintf(__('Live · v%d'), form.version)}</Badge>;
  return <Badge variant="secondary">{__('Draft')}</Badge>;
}
