import nextPlugin from '@next/eslint-plugin-next';
import globals from 'globals';
import base from './base.js';

export default [
  ...base,
  {
    plugins: { '@next/next': nextPlugin },
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
];
