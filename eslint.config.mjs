import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

// eslint-config-next@16 ships native flat-config arrays; spread them directly.
const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'coverage/**',
      // Deployment package artifacts (standalone build output + zip staging) —
      // compiled JS, never source.
      'deploy/**',
      'next-env.d.ts',
      '*.tsbuildinfo',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Allow intentionally-unused params in skeleton signatures to use the
      // conventional underscore prefix instead of being flagged.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
];

export default eslintConfig;
