import { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, toast } from '@imajiner/admin-sdk/ui';
import { Copy, Download, ExternalLink } from 'lucide-react';
import { toDataURL } from 'qrcode';
import { publicFormUrl, shortcode } from '@chatflow/builder/shareLinks';
import { prefillUrl } from '@chatflow/shared/prefill';
import type { AdminConfig, FormDTO } from '@/lib/api';
import { __ } from '@/lib/i18n';

const NO_PREFILL = ['hidden', 'calculated', 'file_upload', 'consent', 'statement', 'summary', 'media', 'address'];

/** The live form's link (with optional prefilled answers), its Blade embed code and a QR code. */
export function SharePanel({ form, config }: { form: FormDTO; config: AdminConfig }) {
  const base = publicFormUrl(form, config);
  const [values, setValues] = useState<Record<string, string>>({});
  const [qr, setQr] = useState('');
  const url = useMemo(() => (base ? prefillUrl(base, values, form.schema) : ''), [base, values, form.schema]);

  useEffect(() => {
    let current = true;
    setQr('');
    if (url) void toDataURL(url, { width: 240, margin: 2, errorCorrectionLevel: 'M' }).then((data) => current && setQr(data)).catch(() => undefined);
    return () => { current = false; };
  }, [url]);

  const copy = async (text: string, done: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(done);
    } catch {
      toast.error(__('Could not copy. Select the text and copy it instead.'));
    }
  };

  const embed = shortcode(form);

  return (
    <div className="cf:flex cf:flex-col cf:gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{__('Link')}</CardTitle>
          <CardDescription>{base ? __('The form on its own page.') : __('Publish the form to get its link and QR code.')}</CardDescription>
        </CardHeader>
        {base && (
          <CardContent className="cf:flex cf:flex-col cf:gap-4">
            <div className="cf:flex cf:gap-2">
              <Input readOnly value={url} aria-label={__('Form link')} onFocus={(event: React.FocusEvent<HTMLInputElement>) => event.target.select()} />
              <Button variant="outline" onClick={() => void copy(url, __('Link copied.'))}><Copy /> {__('Copy')}</Button>
              <Button variant="outline" asChild><a href={url} target="_blank" rel="noopener noreferrer"><ExternalLink /> {__('Open')}</a></Button>
            </div>
            <div className="cf:flex cf:flex-wrap cf:items-start cf:gap-6">
              {qr && (
                <div className="cf:flex cf:flex-col cf:items-start cf:gap-2">
                  <img src={qr} width={160} height={160} alt={__('QR code for the form link')} className="cf:rounded-md cf:border cf:bg-white" />
                  <Button variant="outline" size="sm" asChild><a href={qr} download="chatflow-qr.png"><Download /> {__('Download QR code')}</a></Button>
                </div>
              )}
              <details className="cf:min-w-64 cf:flex-1 cf:text-sm">
                <summary className="cf:cursor-pointer cf:font-medium">{__('Prefill answers in the link')}</summary>
                <p className="cf:my-2 cf:text-xs cf:text-muted-foreground">{__('Visitors see these as suggested answers they can change. Links end up in browser history and logs: never put personal or secret data in them.')}</p>
                <div className="cf:grid cf:gap-3 cf:sm:grid-cols-2">
                  {form.schema.steps.filter((step) => !NO_PREFILL.includes(step.type)).map((step) => (
                    <div key={step.id} className="cf:flex cf:flex-col cf:gap-1.5">
                      <Label>{step.label || step.key}</Label>
                      <Input value={values[step.key] ?? ''} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValues({ ...values, [step.key]: event.target.value })} />
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </CardContent>
        )}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{__('Embed in a page')}</CardTitle>
          <CardDescription>{__('Paste this Blade component into any view of your Laravel app. The display mode (inline, button, pop-up) is under Settings → General.')}</CardDescription>
        </CardHeader>
        <CardContent className="cf:flex cf:gap-2">
          <Input readOnly value={embed} className="cf:font-mono cf:text-xs" aria-label={__('Embed code')} onFocus={(event: React.FocusEvent<HTMLInputElement>) => event.target.select()} />
          <Button variant="outline" onClick={() => void copy(embed, __('Embed code copied.'))}><Copy /> {__('Copy')}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
