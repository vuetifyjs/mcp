import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

export async function registerDocumentationPrompts (server: McpServer) {
  server.prompt(
    'install-vuetify',
    async () => {
      return {
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text',
              text: 'Use the get_installation_guide tool to install Vuetify in my project. Determine the best available platform based on the context of this conversation. Determine the best package manager to use based on the context of this conversation. If you are not certain, ask the user for clarification.',
            },
          },
        ],
      }
    },
  )

  server.prompt(
    'upgrade-v2-to-v3',
    async () => {
      return {
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text',
              text: `You are upgrading this project from Vue 2 + Vuetify 2 to Vue 3 + Vuetify 3.13 LTS using the vuetify-mcp tools.

1. Confirm package.json shows vue@2 and vuetify@2. If the project is already on Vuetify 3 or 4, stop and say so.
2. Call get_v3_upgrade_playbook and follow every phase in order.
3. Phase 0 first: call get_v3_upgrade_baseline_recipe. Scaffold Playwright if missing. Capture upgrade-baseline/ BEFORE changing dependencies. Inventory routes and cover high-risk shells (app-bar, drawer, data tables, date pickers, lists, forms, dialogs). Do not skip because the app is large.
4. Call get_v2_to_v3_component_map and list every v2 component used in this repo with its v3.13 fate.
5. Call get_v3_breaking_changes in this order: layout, v-list, v-data-table, v-date-picker, theme, general, gotchas; then other categories as needed. For each hit, report file, line number, and the recommended fix.
6. Add eslint-plugin-vuetify with the recommended preset (NOT recommended-v4) and run --fix.
7. Apply remaining catalog fixes (use the before/after snippets).
8. Re-run Playwright into upgrade-after/. Functional failures are blockers. Classify screenshot diffs (layout-break vs intended v3 look).
9. Do not apply Vuetify 4 breaking changes. Do not treat @vue/compat as the Vuetify upgrade path.
10. Target vuetify@^3.13.0. Link https://v3-migration.vuejs.org/ for Vue 2 → 3 language changes.`,
            },
          },
        ],
      }
    },
  )
}
