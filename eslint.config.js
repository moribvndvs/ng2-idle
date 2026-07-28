// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['projects/core/**/*.ts', 'projects/keepalive/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true
      }
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'lib',
          style: 'camelCase'
        }
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'lib',
          style: 'kebab-case'
        }
      ]
    }
  },
  {
    files: ['projects/core/**/*.html', 'projects/keepalive/**/*.html'],
    extends: [angular.configs.templateRecommended],
    rules: {}
  }
);
