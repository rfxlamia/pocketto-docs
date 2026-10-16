import nextPlugin from 'eslint-config-next';

const config = [
  ...nextPlugin,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  {
    ignores: ['.next/', '.source/', 'node_modules/', 'scripts/'],
  },
];

export default config;
