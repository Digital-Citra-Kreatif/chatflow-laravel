import { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Label, Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@imajiner/admin-sdk/ui';
import { Download } from 'lucide-react';
import { exportOptions, type ExportJob, type Filters } from '@chatflow/submissions/model';
import { FormPicker } from '@/components/submissions/FormPicker';
import { errorMessage, type AdminApi } from '@/lib/api';
import { __, sprintf } from '@/lib/i18n';

/**
 * CSV export of the inbox's current filters (or the selected rows), for one form at a
 * time so the columns are that form's questions. The file is private: its download link
 * works for the signed-in user only, and expires.
 */
export function ExportDialog({ api, open, onOpenChange, filters, ids, formTitle }: {
  api: AdminApi;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  ids: number[];
  formTitle?: string;
}) {
  const [formId, setFormId] = useState<number | undefined>(filters.formId);
  const [title, setTitle] = useState(formTitle);
  const [headerStyle, setHeaderStyle] = useState<'labels' | 'keys'>('labels');
  const [delimiter, setDelimiter] = useState<',' | ';'>(',');
  const [job, setJob] = useState<ExportJob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setFormId(filters.formId);
    setTitle(formTitle);
    setJob(null);
    setError('');
  }, [open, filters.formId, formTitle]);

  const create = async () => {
    if (!formId) return;
    setBusy(true);
    setError('');
    try {
      setJob(await api.request<ExportJob>('admin/submissions/export', 'POST', exportOptions({ ...filters, formId }, ids, [], headerStyle, delimiter)));
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{__('Export submissions')}</DialogTitle>
          <DialogDescription>
            {ids.length
              ? sprintf(__('The %d selected submissions, as a CSV file.'), ids.length)
              : __('The submissions the inbox shows with its current filters, as a CSV file.')}
          </DialogDescription>
        </DialogHeader>

        {job?.status === 'ready' && job.downloadUrl ? (
          <div className="cf:flex cf:flex-col cf:gap-3">
            <p className="cf:text-sm">{sprintf(__('%d rows are ready. The link works for you only and expires in 24 hours.'), job.rowCount ?? 0)}</p>
            <Button asChild><a href={job.downloadUrl} download><Download /> {__('Download CSV')}</a></Button>
          </div>
        ) : (
          <div className="cf:flex cf:flex-col cf:gap-4">
            <div className="cf:flex cf:flex-col cf:gap-2">
              <Label>{__('Form')}</Label>
              <FormPicker api={api} value={formId} label={title} className="cf:w-full cf:justify-between"
                onChange={(id, chosen) => { setFormId(id); setTitle(chosen); }} />
              <p className="cf:text-xs cf:text-muted-foreground">{__('One form per file, so the columns are its questions.')}</p>
            </div>
            <div className="cf:grid cf:gap-4 cf:sm:grid-cols-2">
              <div className="cf:flex cf:flex-col cf:gap-2">
                <Label htmlFor="cf-export-headers">{__('Column headers')}</Label>
                <Select value={headerStyle} onValueChange={(value: string) => setHeaderStyle(value as 'labels' | 'keys')}>
                  <SelectTrigger id="cf-export-headers"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="labels">{__('Question labels')}</SelectItem>
                    <SelectItem value="keys">{__('Field keys')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="cf:flex cf:flex-col cf:gap-2">
                <Label htmlFor="cf-export-delimiter">{__('Separator')}</Label>
                <Select value={delimiter} onValueChange={(value: string) => setDelimiter(value as ',' | ';')}>
                  <SelectTrigger id="cf-export-delimiter"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">{__('Comma')}</SelectItem>
                    <SelectItem value=";">{__('Semicolon (Excel in many locales)')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {filters.formId && formId !== filters.formId && (
              <p className="cf:text-sm cf:text-destructive">{__('The inbox is filtered to another form: choose that one, or clear the form filter first.')}</p>
            )}
            {job && job.status !== 'ready' && <p className="cf:text-sm cf:text-destructive">{job.message ?? __('The export failed. Please try again.')}</p>}
            {error && <p className="cf:text-sm cf:text-destructive" role="alert">{error}</p>}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{__('Close')}</Button>
          {!(job?.status === 'ready') && (
            <Button onClick={() => void create()} disabled={busy || !formId || Boolean(filters.formId && formId !== filters.formId)}>
              {busy ? __('Exporting…') : __('Create export')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
