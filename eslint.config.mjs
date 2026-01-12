// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslintConfigPrettier,
  ...nextVitals,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    rules: {
      'no-empty': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
