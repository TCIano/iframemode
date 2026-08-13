export default {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue'],
  overrides: [
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
    },
  ],
  rules: {
    'no-empty-source': null,
    'selector-class-pattern':
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*((__|--)[a-z0-9]+(-[a-z0-9]+)*)*$',
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['deep', 'global', 'slotted'] },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      { ignorePseudoElements: ['deep', 'v-deep'] },
    ],
  },
}
