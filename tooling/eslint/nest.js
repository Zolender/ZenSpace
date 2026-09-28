import globals from 'globals';
import base from './base.js';

export default [
  ...base,
  {
    languageOptions: { globals: globals.node },
    rules: {
      // Nest modules are classes with decorators and no members.
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
];
