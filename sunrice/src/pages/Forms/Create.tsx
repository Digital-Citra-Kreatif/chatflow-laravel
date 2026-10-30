import { useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader, toast, useBreadcrumbs } from '@imajiner/admin-sdk/ui';
import { FilePlus2, Upload } from 'lucide-react';
import { importForm } from '@chatflow/builder/formIO';
import { blankForm } from '@chatflow/builder/model';
import { errorMessage, useAdminApi, type AdminConfig, type FormDTO } from '@/lib/api';
import { __ } from '@/lib/i18n';
import { urls } from '@/lib/urls';

interface Template {
  id: string;
  title: string;
  description: string;
  locale: string;
}

interface Props {
  templates: Template[];
  config: AdminConfig;
}

/**
 * Start a form: blank, from a template, or from an exported JSON file. Each creates
 * a draft on the server first, then opens it in the builder.
 */
export default function FormsCreate({ templates, config }: Props) {
  useBreadcrumbs([{ label: __('Forms'), href: urls.forms() }, { label: __('New form') }]);
  const api = useAdminApi(config);
  const [busy, setBusy] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const create = async (key: string, make: () => Promise<FormDTO>) => {
    if (busy) return;
    setBusy(key);
    try {
      const form = await make();
      router.visit(urls.form(form.id));
    } catch (error) {
      toast.error(errorMessage(error));
      setBusy(null);
    }
  };

  const blank = () => create('blank', () => {
    const form = blankForm(config.defaults);
    return api.request<FormDTO>('admin/forms', 'POST', { title: form.title, schema: form.schema, settings: form.settings });
  });

  const fromTemplate = (template: Template) => create(template.id, () => api.request<FormDTO>(`admin/templates/${template.id}`, 'POST', {}));

  const fromFile = (file: File) => create('import', async () => importForm(await file.text(), api));

  return (
    <div className="cf:flex cf:flex-col cf:gap-6">
      <Head title={__('New form')} />
      <PageHeader
        title={__('New form')}
        description={__('Start blank, from a template, or from a form you exported. You can edit every question before publishing.')}
        back={{ href: urls.forms(), label: __('Forms') }}
      />

      <div className="cf:grid cf:gap-4 cf:sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{__('Blank form')}</CardTitle>
            <CardDescription>{__('A welcome message and an ending, ready for your questions.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => void blank()} disabled={busy !== null}><FilePlus2 /> {busy === 'blank' ? __('Creating…') : __('Start blank')}</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{__('Import a form')}</CardTitle>
            <CardDescription>{__('A JSON file exported from ChatFlow. It becomes a new draft; webhooks come in turned off.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <input ref={fileInput} type="file" accept=".json,application/json" className="cf:sr-only" aria-label={__('Form JSON file')}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                event.currentTarget.value = '';
                if (file) void fromFile(file);
              }} />
            <Button variant="outline" onClick={() => fileInput.current?.click()} disabled={busy !== null}>
              <Upload /> {busy === 'import' ? __('Importing…') : __('Choose a file')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="cf:flex cf:flex-col cf:gap-3">
        <h2 className="cf:text-lg cf:font-semibold">{__('Templates')}</h2>
        <div className="cf:grid cf:gap-4 cf:sm:grid-cols-2 cf:xl:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="cf:flex cf:flex-col">
              <CardHeader>
                <CardTitle>{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="cf:mt-auto cf:flex cf:items-center cf:justify-between cf:gap-2">
                <Badge variant="outline">{template.locale.replace('_', '-')}</Badge>
                <Button variant="outline" onClick={() => void fromTemplate(template)} disabled={busy !== null}
                  aria-label={`${__('Use template')}: ${template.title}`}>
                  {busy === template.id ? __('Creating…') : __('Use template')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
