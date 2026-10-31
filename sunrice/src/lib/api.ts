import { useMemo } from 'react';
import { AdminApi, type AdminConfig } from '@chatflow/builder/api';

export { AdminApi, ApiError, can, errorMessage } from '@chatflow/builder/api';
export type { AdminConfig, Capability, FormDTO, FormSchema, FormSettings } from '@chatflow/builder/api';

/** The admin JSON API client for a page's `config` prop (restUrl under the panel, the CSRF token). */
export function useAdminApi(config: AdminConfig): AdminApi {
  return useMemo(() => new AdminApi(config), [config]);
}
