import vuetify from 'eslint-config-vuetify'

export default vuetify({
  perfectionist: {
    import: false,
  },
},
{
  rules: {
    'unicorn/prefer-add-event-listener': 'off',
  },
})
