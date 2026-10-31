import { useEffect, useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import {
  Badge, Button, Card, CardContent, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  Input, Label, PageHeader, SortableHandle, SortableList, Tabs, TabsContent, TabsList, TabsTrigger, toast, useBreadcrumbs,
} from '@imajiner/admin-sdk/ui';
import { Copy, ExternalLink, Plus, Redo2, Trash2, Undo2 } from 'lucide-react';
import type { FormSchema, Step } from '@chatflow/builder/api';
import { duplicateStep, makeStep, publishChanges, removeField, renameOptionValue, renameStepKey } from '@chatflow/builder/model';
import { Endings } from '@/components/builder/Endings';
import { Inspector } from '@/components/builder/Inspector';
import { ChatPreview } from '@/components/builder/ChatPreview';
import { LogicPanel } from '@/components/builder/LogicPanel';
import { Notifications } from '@/components/builder/Notifications';
import { PalettePicker } from '@/components/builder/PalettePicker';
import { SettingSections } from '@/components/builder/SettingSections';
import { SharePanel } from '@/components/builder/SharePanel';
import { Wording } from '@/components/builder/Wording';
import { useConfirm } from '@/components/useConfirm';
import { errorMessage, useAdminApi, type AdminConfig, type FormDTO } from '@/lib/api';
import { useDraft } from '@/lib/draft';
import { fieldTypeLabel, paletteGroups } from '@/lib/fieldTypes';
import { __, sprintf } from '@/lib/i18n';
import { urls } from '@/lib/urls';

const MAX_STEPS = 500;

interface Props {
  formId: number;
  title: string;
  config: AdminConfig;
}

/** Loads the draft, then opens the editor on it. */
export default function Builder({ formId, title, config }: Props) {
  const api = useAdminApi(config);
  const [initial, setInitial] = useState<FormDTO | null>(null);
  const [error, setError] = useState('');
  useBreadcrumbs([{ label: __('Forms'), href: urls.forms() }, { label: initial?.title ?? title }]);

  useEffect(() => {
    api.request<FormDTO>(`admin/forms/${formId}`).then(setInitial).catch((failure) => setError(errorMessage(failure)));
  }, [api, formId]);

  if (!initial) {
    return (
      <div className="cf:flex cf:flex-col cf:gap-6">
        <Head title={title} />
        <PageHeader title={title} back={{ href: urls.forms(), label: __('Forms') }} />
        <p className={error ? 'cf:text-sm cf:text-destructive' : 'cf:text-sm cf:text-muted-foreground'} role={error ? 'alert' : 'status'}>{error || __('Loading…')}</p>
      </div>
    );
  }
  return <Editor api={api} initial={initial} />;
}

function Editor({ api, initial }: { api: ReturnType<typeof useAdminApi>; initial: FormDTO }) {
  const draft = useDraft(api, initial);
  const { controller, state, form, dirty, edit } = draft;
  const schema = form.schema;
  const [confirm, confirmDialog] = useConfirm();
  const [selected, setSelected] = useState(schema.steps[0]?.id ?? '');
  const [publishing, setPublishing] = useState(false);
  const [tab, setTab] = useState('build');
  const [live, setLive] = useState<FormDTO | null>(null);
  const step = schema.steps.find((item) => item.id === selected);

  // Keep a step selected when the selected one goes away (deleted, undone).
  useEffect(() => {
    if (!step && schema.steps[0]) setSelected(schema.steps[0].id);
  }, [step, schema.steps]);

  // The live version, to show what publishing would change.
  useEffect(() => {
    if (!form.version) return;
    let active = true;
    api.request<FormDTO>(`admin/forms/${form.id}/published`).then((result) => active && setLive(result)).catch(() => active && setLive(null));
    return () => { active = false; };
  }, [api, form.id, form.version]);

  const changes = useMemo(() => publishChanges(live, form), [live, form]);
  const unpublished = form.version > 0 && live !== null && changes.length > 0;
  const setSchema = (next: FormSchema) => edit((value) => ({ ...value, schema: next }));
  const setStep = (next: Step) => setSchema({ ...schema, steps: schema.steps.map((item) => (item.id === next.id ? next : item)) as FormSchema['steps'] });

  const insertAfterSelected = (next: Step) => {
    const at = schema.steps.findIndex((item) => item.id === selected);
    const steps = at >= 0 ? [...schema.steps.slice(0, at + 1), next, ...schema.steps.slice(at + 1)] : [...schema.steps, next];
    setSchema({ ...schema, steps: steps as FormSchema['steps'] });
    setSelected(next.id);
  };

  const add = (type: string) => insertAfterSelected(makeStep(type as Step['type'], schema.steps, controller.reservedKeys()));

  const remove = async (target: Step) => {
    if (schema.steps.length <= 1) return;
    if (!(await confirm({
      title: sprintf(__('Delete “%s”?'), target.label || target.key),
      description: __('Rules that use it are removed, and notifications that depend on it are switched off. You can undo this.'),
      confirmLabel: __('Delete field'),
      destructive: true,
    }))) return;
    edit((value) => removeField(value, target.id));
  };

  const publish = async () => {
    try {
      await controller.publish();
      setPublishing(false);
      toast.success(__('Published. Visitors now get this version.'));
    } catch (failure) {
      toast.error(errorMessage(failure));
    }
  };

  const saveState = state.saving ? __('Saving…')
    : state.error ? __('Not saved')
      : dirty ? __('Unsaved changes')
        : draft.savedAt ? sprintf(__('Saved %s'), draft.savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
          : __('Saved');

  return (
    <div className="cf:flex cf:flex-col cf:gap-6">
      <Head title={form.title} />
      {confirmDialog}

      <PageHeader
        title={form.title || __('Untitled form')}
        back={{ href: urls.forms(), label: __('Forms') }}
        menu={[
          ...(form.slug && form.version > 0 && api.config.fullpageBase
            ? [{ label: __('Open live form'), icon: <ExternalLink />, href: `${api.config.siteUrl ?? '/'}${api.config.fullpageBase}/${form.slug}/`, external: true }]
            : []),
          { label: __('Submissions'), href: urls.submissions({ formId: form.id }) },
        ]}
        actions={(
          <>
            <Button variant="ghost" size="icon" aria-label={__('Undo')} disabled={!state.history.length || state.saving} onClick={() => controller.undo()}><Undo2 /></Button>
            <Button variant="ghost" size="icon" aria-label={__('Redo')} disabled={!state.future.length || state.saving} onClick={() => controller.redo()}><Redo2 /></Button>
          </>
        )}
        primary={<Button onClick={() => setPublishing(true)} disabled={Boolean(state.conflict) || Boolean(draft.lockError)}>{__('Publish')}</Button>}
      >
        <Badge variant="outline" role="status">{saveState}</Badge>
        {form.version > 0 ? <Badge>{sprintf(__('Live · v%d'), form.version)}</Badge> : <Badge variant="secondary">{__('Not published')}</Badge>}
        {unpublished && <Badge variant="secondary">{__('Unpublished changes')}</Badge>}
      </PageHeader>

      <Notices draft={draft} />

      <div className="cf:flex cf:max-w-xl cf:flex-col cf:gap-1.5">
        <Label htmlFor="cf-form-title">{__('Form name')}</Label>
        <Input id="cf-form-title" value={form.title} maxLength={500} onChange={(event: React.ChangeEvent<HTMLInputElement>) => edit((value) => ({ ...value, title: event.target.value }))} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="build">{__('Questions')}</TabsTrigger>
          <TabsTrigger value="endings">{__('Endings')}</TabsTrigger>
          <TabsTrigger value="logic">{__('Logic')}</TabsTrigger>
          <TabsTrigger value="design">{__('Design')}</TabsTrigger>
          <TabsTrigger value="settings">{__('Settings')}</TabsTrigger>
          <TabsTrigger value="emails">{__('Emails')}</TabsTrigger>
          <TabsTrigger value="share">{__('Share')}</TabsTrigger>
          <TabsTrigger value="preview">{__('Preview')}</TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="cf:mt-4">
          <div className="cf:grid cf:gap-6 cf:lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
            <div className="cf:flex cf:flex-col cf:gap-3">
              <div className="cf:flex cf:items-center cf:justify-between">
                <h2 className="cf:text-sm cf:font-medium">{sprintf(__('Conversation · %d fields'), schema.steps.length)}</h2>
                <AddField available={api.config.features.fieldTypes} disabled={schema.steps.length >= MAX_STEPS} onAdd={add} />
              </div>
              <SortableList items={schema.steps} getId={(item: Step) => item.id} getLabel={(item: Step) => item.label || item.key}
                onReorder={(steps: Step[]) => setSchema({ ...schema, steps: steps as FormSchema['steps'] })}>
                {(item: Step, { handle, index }) => (
                  <div className={`cf:flex cf:items-center cf:gap-2 cf:rounded-md cf:border cf:bg-card cf:p-2 ${item.id === selected ? 'cf:border-primary cf:ring-1 cf:ring-primary' : ''}`}>
                    <SortableHandle {...handle} label={sprintf(__('Move %s'), item.label || item.key)} />
                    <button type="button" data-step-id={item.id} aria-pressed={item.id === selected} onClick={() => setSelected(item.id)}
                      className="cf:flex cf:min-w-0 cf:flex-1 cf:flex-col cf:items-start cf:text-left">
                      <span className="cf:flex cf:w-full cf:items-center cf:gap-2">
                        <span className="cf:text-xs cf:text-muted-foreground cf:tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                        <span className="cf:truncate cf:font-medium">{item.label || item.key}</span>
                      </span>
                      <span className="cf:text-xs cf:text-muted-foreground">
                        {fieldTypeLabel(item.type)}{item.required ? ` · ${__('Required')}` : ''}{item.hiddenByDefault ? ` · ${__('Hidden')}` : ''}
                      </span>
                    </button>
                  </div>
                )}
              </SortableList>
            </div>

            {step ? (
              <Inspector
                key={step.id}
                step={step}
                schema={schema}
                reservedValues={controller.reservedOptionValues(step.id)}
                onChange={setStep}
                onRenameKey={(key) => edit((value) => renameStepKey(value, step.id, key))}
                onRenameOption={(optionId, value) => edit((current) => renameOptionValue(current, step.id, optionId, value))}
                actions={(
                  <div className="cf:flex cf:gap-1">
                    <Button variant="ghost" size="icon" className="cf:size-8" aria-label={__('Duplicate field')} disabled={schema.steps.length >= MAX_STEPS}
                      onClick={() => insertAfterSelected(duplicateStep(step, schema.steps, controller.reservedKeys()))}><Copy /></Button>
                    <Button variant="ghost" size="icon" className="cf:size-8 cf:text-destructive" aria-label={__('Delete field')} disabled={schema.steps.length <= 1}
                      onClick={() => void remove(step)}><Trash2 /></Button>
                  </div>
                )}
              />
            ) : <Card><CardContent className="cf:text-muted-foreground">{__('Add a field to start.')}</CardContent></Card>}
          </div>
        </TabsContent>

        <TabsContent value="endings" className="cf:mt-4">
          <Endings form={form} onChange={(next) => edit(() => next)} />
        </TabsContent>

        <TabsContent value="design" className="cf:mt-4">
          <div className="cf:grid cf:gap-6 cf:xl:grid-cols-[minmax(0,1fr)_26rem]">
            <div className="cf:flex cf:flex-col cf:gap-4">
              <PalettePicker form={form} onChange={(next) => edit(() => next)} />
              <SettingSections form={form} group="design" defaults={api.config.defaults} languages={api.config.languages} locale={api.config.locale} onChange={(next) => edit(() => next)} />
            </div>
            <div className="cf:xl:sticky cf:xl:top-4 cf:xl:self-start"><ChatPreview form={form} config={api.config} /></div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="cf:mt-4">
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">{__('General')}</TabsTrigger>
              <TabsTrigger value="privacy">{__('Privacy')}</TabsTrigger>
              <TabsTrigger value="spam">{__('Spam')}</TabsTrigger>
              <TabsTrigger value="wording">{__('Texts')}</TabsTrigger>
            </TabsList>
            {(['general', 'privacy', 'spam'] as const).map((group) => (
              <TabsContent key={group} value={group} className="cf:mt-4">
                <SettingSections form={form} group={group} defaults={api.config.defaults} languages={api.config.languages} locale={api.config.locale} onChange={(next) => edit(() => next)} />
              </TabsContent>
            ))}
            <TabsContent value="wording" className="cf:mt-4">
              <Wording form={form} locale={api.config.locale} onChange={(next) => edit(() => next)} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="emails" className="cf:mt-4">
          <Notifications api={api} form={form} onChange={(next) => edit(() => next)} save={() => controller.save()} />
        </TabsContent>

        <TabsContent value="share" className="cf:mt-4">
          <SharePanel form={form} config={api.config} />
        </TabsContent>

        <TabsContent value="preview" className="cf:mt-4">
          <div className="cf:mx-auto cf:w-full cf:max-w-3xl"><ChatPreview form={form} config={api.config} height={680} /></div>
        </TabsContent>

        <TabsContent value="logic" className="cf:mt-4">
          <LogicPanel form={form} onChange={(next) => edit(() => next)} onOpenStep={(id) => { setSelected(id); setTab('build'); }} />
        </TabsContent>
      </Tabs>

      <Dialog open={publishing} onOpenChange={setPublishing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.version > 0 ? __('Publish a new version?') : __('Publish this form?')}</DialogTitle>
            <DialogDescription>
              {form.version > 0
                ? __('Visitors who start the form from now on get the new version. Conversations in progress keep the one they started with.')
                : __('The form becomes available to visitors. Later edits stay in the draft until you publish again.')}
            </DialogDescription>
          </DialogHeader>
          {form.version > 0 && (
            changes.length ? (
              <ul className="cf:list-disc cf:pl-5 cf:text-sm">{changes.map((change) => <li key={change}>{change}</li>)}</ul>
            ) : <p className="cf:text-sm cf:text-muted-foreground">{__('Nothing changed since the live version.')}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPublishing(false)}>{__('Cancel')}</Button>
            <Button onClick={() => void publish()} disabled={state.saving}>{state.saving ? __('Publishing…') : form.version > 0 ? __('Publish new version') : __('Publish')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Field types to add, grouped as in the palette; the new field goes after the selected one. */
function AddField({ available, disabled, onAdd }: { available: string[]; disabled: boolean; onAdd: (type: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" disabled={disabled}><Plus /> {__('Add field')}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="cf:max-h-96 cf:overflow-y-auto">
        {paletteGroups(available).map((group, index) => (
          <div key={group.label}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
            {group.types.map((type) => <DropdownMenuItem key={type} onSelect={() => onAdd(type)}>{fieldTypeLabel(type)}</DropdownMenuItem>)}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Save problems, the edit lock, a revision conflict and validation issues, each with its way out. */
function Notices({ draft }: { draft: ReturnType<typeof useDraft> }) {
  const { controller, state } = draft;
  if (state.conflict) {
    return (
      <Banner tone="error" title={__('Someone else saved this form')}
        text={__('Your edits are kept here but not saved. Load their version (your edits are lost), or keep yours and save over it.')}>
        <Button variant="outline" size="sm" onClick={() => void controller.reload()}>{__('Load their version')}</Button>
        <Button size="sm" onClick={() => void controller.rebaseLocal().then(() => draft.saveNow())}>{__('Keep mine')}</Button>
      </Banner>
    );
  }
  if (draft.lockError) return <Banner tone="warning" title={__('Another admin is editing this form')} text={draft.lockError} />;
  if (state.error) {
    return (
      <Banner tone="error" title={__('The draft was not saved')} text={state.error}>
        <Button variant="outline" size="sm" onClick={() => draft.saveNow()}>{__('Try again')}</Button>
        {state.issues.length > 0 && (
          <ul className="cf:mt-2 cf:w-full cf:list-disc cf:pl-5 cf:text-sm">{state.issues.slice(0, 10).map((issue, index) => <li key={index}>{issue.message}</li>)}</ul>
        )}
      </Banner>
    );
  }
  return null;
}

function Banner({ tone, title, text, children }: { tone: 'error' | 'warning'; title: string; text: string; children?: React.ReactNode }) {
  return (
    <div role="alert" className={`cf:flex cf:flex-wrap cf:items-center cf:gap-3 cf:rounded-lg cf:border cf:p-4 ${tone === 'error' ? 'cf:border-destructive/50 cf:bg-destructive/5' : 'cf:border-amber-500/50 cf:bg-amber-500/5'}`}>
      <div className="cf:min-w-0 cf:flex-1">
        <p className="cf:font-medium">{title}</p>
        <p className="cf:text-sm cf:text-muted-foreground">{text}</p>
      </div>
      {children}
    </div>
  );
}
