/**
 * Provides documentation-related services for @vuetify/v0 (Vuetify0).
 *
 * Vuetify0 is a headless meta-framework for building UI libraries with Vue 3.
 * It provides unstyled, composable building blocks for creating design systems.
 */
import octokit from '#plugins/octokit'

export const VUETIFY0_COMPOSABLES = {
  foundation: {
    name: 'Foundation',
    description: 'Factory functions for creating reusable patterns',
    composables: {
      createContext: 'Create reusable context for sharing state across components using Vue\'s provide/inject',
      createTrinity: 'Create context provider/consumer pattern utilities returning a 3-item tuple',
      createPlugin: 'Create Vue plugins with standardized patterns',
    },
  },
  registration: {
    name: 'Registration',
    description: 'Manage collections and registries',
    composables: {
      createNested: 'Manage nested/hierarchical context structures with parent-child relationships',
      createQueue: 'Registry queue management',
      createRegistry: 'Foundation for registration-based systems with automatic indexing',
      createTimeline: 'Bounded undo/redo system with fixed-size history',
      createTokens: 'Design token management system with aliases and resolution',
      useProxyRegistry: 'Proxy-based registry with automatic reactivity',
      useStack: 'Stack-based state management for layered contexts (dialogs, menus, etc.)',
    },
  },
  selection: {
    name: 'Selection',
    description: 'Manage selection state in collections',
    composables: {
      createSelection: 'Creates a selection instance for managing multiple selected items (factory function)',
      createGroup: 'Creates a group instance with batch selection operations (extends createSelection)',
      createSingle: 'Creates a single-selection instance (enforces only one selected item)',
      createStep: 'Creates a step/stepper instance for managing multi-step processes',
      createFilter: 'Filter arrays based on search queries',
      createPagination: 'Lightweight pagination for navigating through pages with next/prev/first/last methods',
    },
  },
  forms: {
    name: 'Forms',
    description: 'Form handling and validation',
    composables: {
      createForm: 'Form state management and validation',
      useProxyModel: 'Proxy model utilities for reactive data binding',
    },
  },
  system: {
    name: 'System',
    description: 'DOM observers and event handlers with automatic cleanup',
    composables: {
      useClickOutside: 'Detect clicks outside an element',
      useEventListener: 'Event listener management with auto-cleanup',
      useHotkey: 'Keyboard hotkey/shortcut handling',
      useIntersectionObserver: 'Detect element visibility changes',
      useMediaQuery: 'Reactive CSS media query matching',
      useMutationObserver: 'Observe DOM mutations',
      createOverflow: 'Computes how many items fit in a container based on available width',
      useResizeObserver: 'Detect element dimension changes',
      useToggleScope: 'Conditionally manages an effect scope based on a reactive boolean',
      createVirtual: 'Virtual scrolling for efficiently rendering large lists',
    },
  },
  plugins: {
    name: 'Plugins',
    description: 'Core system utilities',
    composables: {
      useBreakpoints: 'Responsive breakpoint detection',
      useDate: 'Date utilities and formatting',
      useFeatures: 'Feature flag management',
      useHydration: 'SSR hydration utilities',
      useLazy: 'Deferred/lazy evaluation of expensive computations',
      useLocale: 'Internationalization support',
      useLogger: 'Logging system',
      usePermissions: 'Permission management',
      useStorage: 'Storage abstraction (localStorage/sessionStorage)',
      useTheme: 'Theme switching and CSS variable management',
    },
  },
  transformers: {
    name: 'Transformers',
    description: 'Helper functions for type transformations',
    composables: {
      toArray: 'Convert any value to an array with null/undefined handling',
      toReactive: 'Convert MaybeRef objects to reactive proxies',
    },
  },
} as const

export const VUETIFY0_COMPONENTS = {
  Atom: 'Base element wrapper component',
  Avatar: 'Image loading with fallback system',
  Checkbox: 'Checkbox with tri-state and group support',
  Dialog: 'Modal dialog component',
  ExpansionPanel: 'Expandable panel component',
  Group: 'Component grouping/container',
  Pagination: 'Pagination controls with Root, Item, Ellipsis, First, Last, Next, Prev sub-components',
  Popover: 'Popover overlay component',
  Radio: 'Radio button component',
  Scrim: 'Overlay backdrop component for modals and dialogs',
  Selection: 'Selection handling component',
  Single: 'Single item component',
  Step: 'Step/stepper component',
  Tabs: 'Tabbed interface component',
} as const

export const VUETIFY0_EXPORTS = {
  utilities: {
    name: 'Utilities',
    path: '@vuetify/v0/utilities',
    description: 'Helper functions for type checking, object manipulation, and common transformations',
    exports: {
      isFunction: 'Check if a value is a function',
      isString: 'Check if a value is a string',
      isNumber: 'Check if a value is a number',
      isBoolean: 'Check if a value is a boolean',
      isObject: 'Check if a value is a plain object (excludes null and arrays)',
      isArray: 'Check if a value is an array',
      isNull: 'Check if a value is null',
      isUndefined: 'Check if a value is undefined',
      isNullOrUndefined: 'Check if a value is null or undefined',
      isPrimitive: 'Check if a value is a primitive (string, number, or boolean)',
      isSymbol: 'Check if a value is a symbol',
      isNaN: 'Check if a value is NaN',
      mergeDeep: 'Deeply merge source objects into a target object',
      useId: 'Generate unique IDs (SSR-safe with Vue\'s useId)',
      clamp: 'Clamp a value between a minimum and maximum',
      range: 'Create an array of sequential numbers',
      debounce: 'Debounce a function call by a specified delay',
    },
  },
  types: {
    name: 'Types',
    path: '@vuetify/v0/types',
    description: 'Shared TypeScript type definitions',
    exports: {
      DOMElement: 'Valid element types for Vue\'s h() render function',
      GenericObject: 'Generic object with string keys and any values',
      UnknownObject: 'Object with string keys and unknown values (safer alternative)',
      ID: 'Identifier type used throughout the registry system (string | number)',
      DeepPartial: 'Recursively makes all properties of T optional',
      MaybeArray: 'Union type that accepts either a single value or an array',
      MaybeRef: 'Value that may be wrapped in a Vue ref, readonly ref, shallow ref, or getter',
    },
  },
  constants: {
    name: 'Constants',
    path: '@vuetify/v0/constants',
    description: 'Shared constants and element references',
    exports: {
      htmlElements: 'HTML element tag names',
      globals: 'Global constants',
    },
  },
  date: {
    name: 'Date',
    path: '@vuetify/v0/date',
    description: 'Date adapter using the Temporal API',
    exports: {
      Vuetify0DateAdapter: 'Temporal API-based date adapter implementation',
    },
  },
} as const

export type Vuetify0Category = keyof typeof VUETIFY0_COMPOSABLES
export type Vuetify0Component = keyof typeof VUETIFY0_COMPONENTS
export type Vuetify0Export = keyof typeof VUETIFY0_EXPORTS

export function createVuetify0Service () {
  return {
    getInstallationGuide: async () => {
      const { data } = await octokit.rest.repos.getContent({
        owner: 'vuetifyjs',
        repo: '0',
        path: 'README.md',
        mediaType: {
          format: 'raw',
        },
      })

      return {
        content: [
          {
            type: 'text',
            text: `# @vuetify/v0 (Vuetify0) Documentation\n\nSource: https://github.com/vuetifyjs/0\nWebsite: https://0.vuetifyjs.com/\n\n${data}`,
          } as const,
        ],
      }
    },

    getPackageGuide: async () => {
      const { data } = await octokit.rest.repos.getContent({
        owner: 'vuetifyjs',
        repo: '0',
        path: 'packages/0/README.md',
        mediaType: {
          format: 'raw',
        },
      })

      return {
        content: [
          {
            type: 'text',
            text: `# @vuetify/v0 Package Documentation\n\nSource: https://github.com/vuetifyjs/0/tree/main/packages/0\n\n${data}`,
          } as const,
        ],
      }
    },

    getComposableList: async () => {
      const categories = Object.entries(VUETIFY0_COMPOSABLES)
        .map(([key, category]) => {
          const composables = Object.entries(category.composables)
            .map(([name, description]) => `  - **${name}**: ${description}`)
            .join('\n')

          return `## ${category.name} (${key})\n${category.description}\n\n${composables}`
        })
        .join('\n\n')

      return {
        content: [
          {
            type: 'text',
            text: `# @vuetify/v0 Composables\n\nVuetify0 provides 40 tree-shakeable composables organized into 7 categories:\n\n${categories}\n\n**Note**: Vuetify0 is currently in Pre-Alpha. Features may not function as expected.\n\n**Documentation**: https://0.vuetifyjs.com/composables`,
          } as const,
        ],
      }
    },

    getComponentList: async () => {
      const components = Object.entries(VUETIFY0_COMPONENTS)
        .map(([name, description]) => `- **${name}**: ${description}`)
        .join('\n')

      return {
        content: [
          {
            type: 'text',
            text: `# @vuetify/v0 Components\n\nVuetify0 provides 14 headless components (unstyled, logic-only building blocks):\n\n${components}\n\n**Note**: These are headless components - they provide only logic and state without imposed styling.\n\n**Documentation**: https://0.vuetifyjs.com/components`,
          } as const,
        ],
      }
    },

    getComposableGuide: async ({ category, name }: { category: Vuetify0Category, name: string }) => {
      if (!VUETIFY0_COMPOSABLES[category]) {
        throw new Error(`Category "${category}" not found. Available categories: ${Object.keys(VUETIFY0_COMPOSABLES).join(', ')}`)
      }

      const categoryData = VUETIFY0_COMPOSABLES[category]
      if (!categoryData.composables[name as keyof typeof categoryData.composables]) {
        const availableComposables = Object.keys(categoryData.composables).join(', ')
        throw new Error(`Composable "${name}" not found in category "${category}". Available composables: ${availableComposables}`)
      }

      // Convert camelCase to kebab-case for documentation URL
      const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

      try {
        // Fetch the source code from GitHub - composables are stored flat, each in their own directory
        const { data } = await octokit.rest.repos.getContent({
          owner: 'vuetifyjs',
          repo: '0',
          path: `packages/0/src/composables/${name}/index.ts`,
          mediaType: {
            format: 'raw',
          },
        })

        return {
          content: [
            {
              type: 'text',
              text: `# ${name}\n\n**Category**: ${categoryData.name} (${category})\n**Description**: ${categoryData.composables[name as keyof typeof categoryData.composables]}\n\n**Documentation**: https://0.vuetifyjs.com/composables/${category}/${kebabName}\n**Source**: https://github.com/vuetifyjs/0/blob/main/packages/0/src/composables/${name}/index.ts\n\n## Source Code\n\n\`\`\`typescript\n${data}\n\`\`\``,
            } as const,
          ],
        }
      } catch {
        // If source code fetch fails, return basic info with documentation link
        return {
          content: [
            {
              type: 'text',
              text: `# ${name}\n\n**Category**: ${categoryData.name} (${category})\n**Description**: ${categoryData.composables[name as keyof typeof categoryData.composables]}\n\n**Documentation**: https://0.vuetifyjs.com/composables/${category}/${kebabName}\n**Source**: https://github.com/vuetifyjs/0/blob/main/packages/0/src/composables/${name}/index.ts\n\n*Note*: For detailed API documentation, examples, and usage, please visit the documentation link above.`,
            } as const,
          ],
        }
      }
    },

    getComponentGuide: async ({ name }: { name: Vuetify0Component }) => {
      if (!VUETIFY0_COMPONENTS[name]) {
        throw new Error(`Component "${name}" not found. Available components: ${Object.keys(VUETIFY0_COMPONENTS).join(', ')}`)
      }

      const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

      try {
        const { data } = await octokit.rest.repos.getContent({
          owner: 'vuetifyjs',
          repo: '0',
          path: `packages/0/src/components/${name}/index.ts`,
          mediaType: {
            format: 'raw',
          },
        })

        return {
          content: [
            {
              type: 'text',
              text: `# ${name}\n\n**Description**: ${VUETIFY0_COMPONENTS[name]}\n\n**Documentation**: https://0.vuetifyjs.com/components/${kebabName}\n**Source**: https://github.com/vuetifyjs/0/blob/main/packages/0/src/components/${name}/index.ts\n\n## Source Code\n\n\`\`\`typescript\n${data}\n\`\`\``,
            } as const,
          ],
        }
      } catch {
        return {
          content: [
            {
              type: 'text',
              text: `# ${name}\n\n**Description**: ${VUETIFY0_COMPONENTS[name]}\n\n**Documentation**: https://0.vuetifyjs.com/components/${kebabName}\n**Source**: https://github.com/vuetifyjs/0/blob/main/packages/0/src/components/${name}/index.ts\n\n*Note*: For detailed API documentation, props, events, and usage examples, please visit the documentation link above.`,
            } as const,
          ],
        }
      }
    },

    getExportsList: async () => {
      const exports = Object.entries(VUETIFY0_EXPORTS)
        .map(([_key, category]) => {
          const items = Object.entries(category.exports)
            .map(([name, description]) => `  - **${name}**: ${description}`)
            .join('\n')

          return `## ${category.name}\n**Import**: \`${category.path}\`\n${category.description}\n\n${items}`
        })
        .join('\n\n')

      return {
        content: [
          {
            type: 'text',
            text: `# @vuetify/v0 Subpath Exports\n\nVuetify0 provides additional subpath exports for utilities, types, constants, and date handling:\n\n${exports}\n\n**Documentation**: https://0.vuetifyjs.com/`,
          } as const,
        ],
      }
    },

    getSkill: async () => {
      try {
        // Fetch from the docs site for the most up-to-date version
        const response = await fetch('https://0.vuetifyjs.com/SKILL.md')
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }
        const data = await response.text()

        return {
          content: [
            {
              type: 'text',
              text: data,
            } as const,
          ],
        }
      } catch {
        // Fallback to GitHub if docs site is unavailable
        const { data } = await octokit.rest.repos.getContent({
          owner: 'vuetifyjs',
          repo: '0',
          path: 'skills/vuetify0/SKILL.md',
          mediaType: {
            format: 'raw',
          },
        })

        return {
          content: [
            {
              type: 'text',
              text: String(data),
            } as const,
          ],
        }
      }
    },
  }
}
