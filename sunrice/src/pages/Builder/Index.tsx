import { Head } from '@inertiajs/react';
import { PageHeader, useBreadcrumbs } from '@imajiner/admin-sdk/ui';
import { __ } from '@/lib/i18n';
import { urls } from '@/lib/urls';

// Stand-in until the builder lands (SUNRICE.md, phase P4).
export default function Builder({ title }: { formId: number; title: string }) {
  useBreadcrumbs([{ label: __('Forms'), href: urls.forms() }, { label: title }]);
  return (
    <>
      <Head title={title} />
      <PageHeader title={title} back={{ href: urls.forms(), label: __('Forms') }} />
    </>
  );
}
