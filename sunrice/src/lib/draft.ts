import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { DraftController, type DraftState } from '@chatflow/builder/model';
import { useUnsavedChanges } from '@imajiner/admin-sdk/ui';
import { errorMessage, type AdminApi, type FormDTO } from '@/lib/api';

export interface Draft {
  controller: DraftController;
  state: DraftState;
  form: FormDTO;
  dirty: boolean;
  /** When the last save finished; null before the first one. */
  savedAt: Date | null;
  /** Set while another admin holds the form's edit lock. */
  lockError: string;
  edit: (transform: (form: FormDTO) => FormDTO) => void;
  saveNow: () => void;
}

const AUTOSAVE_MS = 3000;
const LOCK_MS = 60000;

/**
 * The builder's draft: ChatFlow's DraftController (serialized saves, undo/redo, revision
 * conflicts, publishing) as React state, plus the page's duties around it, as in the
 * standalone builder: hold the edit lock, autosave every few seconds while there are
 * changes (paused by errors, conflicts and a held lock until the next edit or a retry),
 * and, through the panel's useUnsavedChanges, save on Ctrl/Cmd+S and ask before leaving
 * with unsaved changes.
 */
export function useDraft(api: AdminApi, initial: FormDTO): Draft {
  const controller = useMemo(() => new DraftController(api, initial), [api, initial]);
  const state = useSyncExternalStore(controller.subscribe, controller.snapshot);
  const [lockError, setLockError] = useState('');
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const dirty = controller.dirty();

  // The edit lock: taken when the builder opens and renewed every minute.
  useEffect(() => {
    let active = true;
    const acquire = () => api.request(`admin/forms/${initial.id}/lock`, 'POST', {})
      .then(() => active && setLockError(''))
      .catch((error) => active && setLockError(errorMessage(error)));
    void acquire();
    const timer = window.setInterval(() => void acquire(), LOCK_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [api, initial.id]);

  const saveNow = useCallback(() => {
    if (!lockError && !controller.state.conflict && !controller.state.saving) void controller.save().catch(() => undefined);
  }, [controller, lockError]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const current = controller.state;
      if (!lockError && !current.conflict && !current.error && !current.saving && controller.dirty()) void controller.save().catch(() => undefined);
    }, AUTOSAVE_MS);
    return () => window.clearInterval(timer);
  }, [controller, lockError]);

  const wasSaving = useRef(false);
  useEffect(() => {
    if (wasSaving.current && !state.saving && !state.error) setSavedAt(new Date());
    wasSaving.current = state.saving;
  }, [state.saving, state.error]);

  // The panel's guard: asks before leaving (Inertia visits and the browser) and saves on Ctrl/Cmd+S.
  useUnsavedChanges(dirty, saveNow);

  const edit = useCallback((transform: (form: FormDTO) => FormDTO) => controller.edit(transform), [controller]);

  return { controller, state, form: state.form, dirty, savedAt, lockError, edit, saveNow };
}
