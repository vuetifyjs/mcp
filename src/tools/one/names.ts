export const ONE_TOOL_NAMES = [
  'create_vuetify_bin',
  'get_all_bins',
  'update_vuetify_bin',
  'get_bin',
  'create_vuetify_link',
  'get_all_links',
  'create_vuetify_playground',
  'get_all_playgrounds',
  'update_vuetify_playground',
  'get_playground',
] as const

export const ONE_TOOL_NAME_SET: ReadonlySet<string> = new Set(ONE_TOOL_NAMES)
