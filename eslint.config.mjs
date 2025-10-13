// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'max-lines': ['error', {
        max: 650,
        skipBlankLines: true,
        skipComments: true,
      }],
      'vue/no-v-html': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
)
