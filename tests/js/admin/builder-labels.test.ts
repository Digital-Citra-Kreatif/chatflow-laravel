import { expect, it } from 'vitest';
import { blankForm } from '../../../resources/js/builder/model';
import { questionLabel, withStepMessages } from '../../../resources/js/builder/labels';

it('starts new generic forms with the plugin brand rather than a template-specific bot name', () => {
  expect(blankForm().schema.bot.name).toBe('ChatFlow');
});

it('labels a question by its text, with merge tags as the answers they name', () => {
  expect(questionLabel('Thanks {{name}}! What is your email?')).toBe('Thanks [name]! What is your email?');
  expect(questionLabel('Hi {{ answer:name | there }}, and {{meta:utm_source}}?')).toBe('Hi [name], and [utm_source]?');
  // Not a tag: left out.
  expect(questionLabel('Price {{ 1 + 2 }} <b>now</b>')).toBe('Price now');
});

it('keeps a label that follows its question in step as the question changes', () => {
  const step = { id: 's1', key: 'email', label: 'Thanks [name]! What is your email?', type: 'email', messages: ['Thanks {{name}}! What is your email?'], required: true } as never;
  expect(withStepMessages(step, ['And your email, {{name}}?']).label).toBe('And your email, [name]?');
});
