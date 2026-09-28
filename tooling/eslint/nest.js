import node from './node.js';

export default [
  ...node,
  {
    rules: {
      // Nest modules are classes with decorators and no members.
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
];
