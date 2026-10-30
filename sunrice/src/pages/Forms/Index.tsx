import { PageHeader, useBreadcrumbs } from '@imajiner/admin-sdk/ui';
import { __ } from '@/lib/i18n';

export default function FormsIndex() {
  useBreadcrumbs([{ label: __('Forms') }]);
  return <PageHeader title={__('Forms')} />;
}
