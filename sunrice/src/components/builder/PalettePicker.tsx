import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@imajiner/admin-sdk/ui';
import { Check } from 'lucide-react';
import type { FormDTO } from '@chatflow/builder/api';
import { applyPalette, palettes } from '@chatflow/builder/themePalettes';
import { __ } from '@/lib/i18n';

/**
 * Ready-made Messaging looks (the standalone builder's palettes): one click sets the
 * colours, light or dark and the wallpaper, keeping every other design choice.
 */
export function PalettePicker({ form, onChange }: { form: FormDTO; onChange: (form: FormDTO) => void }) {
  const appearance = form.settings.appearance ?? {};
  const current = palettes().find((palette) => appearance.style === 'messaging'
    && Object.entries(palette.colors).every(([key, value]) => (appearance as Record<string, unknown>)[key] === value));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{__('Palettes')}</CardTitle>
        <CardDescription>{__('A ready-made Messaging look. You can still change any colour below.')}</CardDescription>
      </CardHeader>
      <CardContent className="cf:grid cf:grid-cols-2 cf:gap-3 cf:sm:grid-cols-3">
        {palettes().map((palette) => (
          <button key={palette.id} type="button" aria-pressed={current?.id === palette.id}
            onClick={() => onChange({ ...form, settings: { ...form.settings, appearance: applyPalette(appearance, palette) } })}
            className="cf:flex cf:flex-col cf:gap-2 cf:rounded-lg cf:border cf:p-3 cf:text-left cf:hover:bg-accent cf:aria-pressed:border-primary cf:aria-pressed:ring-1 cf:aria-pressed:ring-primary">
            <span className="cf:flex cf:h-10 cf:overflow-hidden cf:rounded-md cf:border" aria-hidden="true">
              <span className="cf:flex-1" style={{ background: palette.colors.headerBackground }} />
              <span className="cf:flex-1" style={{ background: palette.colors.chatBackground }} />
              <span className="cf:flex-1" style={{ background: palette.colors.userBubbleBackground }} />
              <span className="cf:flex-1" style={{ background: palette.colors.primary }} />
            </span>
            <span className="cf:flex cf:items-center cf:justify-between cf:text-sm cf:font-medium">
              {palette.label}
              {current?.id === palette.id && <Check className="cf:size-4" aria-hidden="true" />}
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
