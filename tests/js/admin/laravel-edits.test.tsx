// @vitest-environment jsdom
import { act } from 'react';
import { createElement, createRoot } from '@wordpress/element';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminApi } from '../../../resources/js/builder/api';
import type { AdminConfig, FormDTO } from '../../../resources/js/builder/api';
import { blankForm, v1Types } from '../../../resources/js/builder/model';
import { MediaIdField } from '../../../resources/js/builder/controls';
import { DisplaySettings, HtmlEditor } from '../../../resources/js/builder/FormSettings';
import { Share } from '../../../resources/js/builder/Share';

vi.mock('qrcode', () => ({ toDataURL: vi.fn(async () => 'data:image/png;base64,test') }));

const config: AdminConfig = {
  restUrl: 'https://app.test/chatflow/admin/api/',
  publicRestUrl: 'https://app.test/chatflow/api/v1/',
  nonce: 'csrf',
  pluginUrl: '/vendor/chatflow/',
  adminUrl: 'https://app.test/chatflow/admin',
  screen: 'builder',
  locale: 'en',
  capabilities: { manage_forms: true },
  features: { fieldTypes: v1Types, uploads: false, xlsx: false },
};
let container: HTMLDivElement, root: ReturnType<typeof createRoot>;
const render = (element: ReturnType<typeof createElement>) => act(async () => root.render(element));
const labels = () => [...container.querySelectorAll('label')].map(label => label.textContent ?? '');
beforeEach(() => {
  (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  delete (globalThis as { wp?: unknown }).wp;
});

describe('Laravel admin edits', () => {
  it('hides media pickers when the WordPress media library is absent', async () => {
    await render(createElement(MediaIdField, { label: 'Avatar image', value: 3, onChange: vi.fn() }));
    expect(container.innerHTML).toBe('');
    (globalThis as { wp?: unknown }).wp = { media: vi.fn() };
    await render(createElement(MediaIdField, { label: 'Avatar image', value: 3, onChange: vi.fn() }));
    expect(container.textContent).toContain('Replace image');
  });
  it('shows launcher page targeting only when the feature is enabled', async () => {
    const form: FormDTO = { ...blankForm(), id: 4, settings: { display: { mode: 'launcher' } } };
    await render(createElement(DisplaySettings, { form, api: new AdminApi(config), onChange: vi.fn() }));
    expect(labels().some(text => text.includes('Only show on these pages'))).toBe(false);
    const enabled = new AdminApi({ ...config, features: { ...config.features, pageTargeting: true } });
    await render(createElement(DisplaySettings, { form, api: enabled, onChange: vi.fn() }));
    expect(container.textContent).toContain('Only show on these pages');
    expect(container.textContent).toContain('Never show on these pages');
  });
  it('falls back to a plain textarea for the HTML email body', async () => {
    const onChange = vi.fn();
    await render(createElement(HtmlEditor, { value: '<p>Hi</p>', onChange }));
    const textarea = container.querySelector('textarea')!;
    expect(textarea.value).toBe('<p>Hi</p>');
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!;
      setter.call(textarea, '<p>Hello</p>');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(onChange).toHaveBeenCalledWith('<p>Hello</p>');
  });
  it('embeds with the Blade component and the public visitor API', async () => {
    const form: FormDTO = { ...blankForm(), id: 9, version: 1, slug: 'contact' };
    await render(createElement(Share, { form, config: { ...config, siteUrl: 'https://app.test/' } }));
    const embed = [...container.querySelectorAll('button')].find(button => button.textContent === 'Embed')!;
    await act(async () => embed.click());
    const snippets = [...container.querySelectorAll('pre')].map(pre => pre.textContent);
    expect(snippets[0]).toBe('<x-chatflow::form :id="9" mode="inline" />');
    expect(snippets[1]).toBe('<cff-chat data-form-id="9" data-rest-url="https://app.test/chatflow/api/v1/"></cff-chat>');
    expect(container.textContent).not.toMatch(/WordPress|Elementor|shortcode/i);
  });
});
