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
      createModel: 'Value store layer extending createRegistry with a reactive Set of selected IDs and useProxyModel sync',
      createNested: 'Manage nested/hierarchical context structures with parent-child relationships',
      createQueue: 'Registry queue management',
      createRegistry: 'Foundation for registration-based systems with automatic indexing',
      createTimeline: 'Bounded undo/redo system with fixed-size history',
      createTokens: 'Design token management system with aliases and resolution',
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
    },
  },
  forms: {
    name: 'Forms',
    description: 'Form handling and validation',
    composables: {
      createCombobox: 'Combobox state management with filtering, selection, and keyboard navigation',
      createForm: 'Form state management and validation',
      createInput: 'Input state management with focus, validation, and accessibility',
      createNumberField: 'Number field state with increment/decrement, step, and min/max constraints',
      createNumeric: 'Numeric formatting and parsing utilities for number inputs',
      createRating: 'Rating state management with hover preview and half-star support',
      createSlider: 'Slider state management: value math, step snapping, percentage conversion, and multi-thumb support',
      createValidation: 'Per-input validation built on createGroup',
      useRules: 'Validation rule composable with Standard Schema support',
    },
  },
  system: {
    name: 'System',
    description: 'DOM observers and event handlers with automatic cleanup',
    composables: {
      createFocusTraversal: 'Internal factory for useRovingFocus and useVirtualFocus focus traversal patterns',
      createObserver: 'Internal factory for observer composables (IntersectionObserver, MutationObserver, ResizeObserver)',
      useClickOutside: 'Detect clicks outside an element',
      useEventListener: 'Event listener management with auto-cleanup',
      useHotkey: 'Keyboard hotkey/shortcut handling',
      useIntersectionObserver: 'Detect element visibility changes',
      useMediaQuery: 'Reactive CSS media query matching',
      useMutationObserver: 'Observe DOM mutations',
      usePopover: 'Native popover API behavior with CSS anchor positioning',
      usePresence: 'Animate enter/exit transitions with DOM presence tracking',
      useRaf: 'Scope-disposed safe requestAnimationFrame',
      useResizeObserver: 'Detect element dimension changes',
      useRovingFocus: 'Roving tabindex for keyboard navigation within composite widgets',
      useTimer: 'Reactive timer with pause/resume support',
      useToggleScope: 'Conditionally manages an effect scope based on a reactive boolean',
      useVirtualFocus: 'Virtual focus via aria-activedescendant for keyboard navigation',
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
      useNotifications: 'Notification management built on createRegistry and createQueue',
      usePermissions: 'Permission management',
      useRtl: 'RTL (right-to-left) direction detection with adapter pattern',
      useStack: 'Stack-based state management for layered contexts (dialogs, menus, etc.)',
      useStorage: 'Storage abstraction (localStorage/sessionStorage)',
      useTheme: 'Theme switching and CSS variable management',
    },
  },
  data: {
    name: 'Data',
    description: 'Data processing, filtering, pagination, and virtualization',
    composables: {
      createBreadcrumbs: 'Breadcrumb navigation built on createSingle',
      createDataTable: 'Composable data table that composes existing v0 primitives (selection, pagination, sorting, filtering)',
      createFilter: 'Filter arrays based on search queries',
      createOverflow: 'Computes how many items fit in a container based on available width',
      createPagination: 'Lightweight pagination for navigating through pages with next/prev/first/last methods',
      createProgress: 'Progress state management for determinate and indeterminate indicators',
      createVirtual: 'Virtual scrolling for efficiently rendering large lists',
    },
  },
  reactivity: {
    name: 'Reactivity',
    description: 'Reactive data binding and proxy utilities',
    composables: {
      useProxyModel: 'Proxy model utilities for reactive data binding',
      useProxyRegistry: 'Proxy-based registry with automatic reactivity',
    },
  },
  transformers: {
    name: 'Transformers',
    description: 'Helper functions for type transformations',
    composables: {
      toArray: 'Convert any value to an array with null/undefined handling',
      toElement: 'Resolve various element reference types to a DOM Element',
      toReactive: 'Convert MaybeRef objects to reactive proxies',
    },
  },
} as const

export const VUETIFY0_COMPONENTS = {
  Alert: 'Contextual feedback messages for user actions',
  AlertDialog: 'Modal confirmation dialog requiring user acknowledgment before proceeding',
  Atom: 'Base element wrapper component',
  Avatar: 'Image loading with fallback system',
  Breadcrumbs: 'Responsive navigation trail with automatic overflow handling and ellipsis support',
  Button: 'Interactive button controls with toggle groups, loading states, and icon support',
  Carousel: 'Slideshow component for cycling through content panels',
  Checkbox: 'Checkbox with tri-state and group support',
  Collapsible: 'Animated expand/collapse container for showing and hiding content',
  Combobox: 'Filterable dropdown with text input for searching and selecting options',
  DataGrid: 'Data grid component for tabular data display with sorting and filtering',
  DatePicker: 'Calendar-based date selection component',
  DateRangePicker: 'Calendar-based date range selection with start and end dates',
  Dialog: 'Modal dialog component',
  ExpansionPanel: 'Expandable panel component',
  Form: 'Coordinates validation across fields with submit/reset handling',
  Group: 'Component grouping/container',
  Image: 'Image component with lazy loading, aspect ratio, and placeholder support',
  Input: 'Text input control with validation, error messages, and help text',
  Locale: 'Scoped locale provider for internationalization within a component subtree',
  NumberField: 'Numeric input with increment/decrement controls and min/max constraints',
  Overflow: 'Container that detects and manages content overflow',
  Pagination: 'Pagination controls with Root, Item, Ellipsis, First, Last, Next, Prev sub-components',
  Popover: 'Popover overlay component',
  Portal: 'Teleport content to a different location in the DOM tree',
  Presence: 'Animate mount/unmount transitions with DOM presence lifecycle',
  Progress: 'Determinate and indeterminate progress indicators',
  Radio: 'Radio button component',
  Rating: 'Star rating input with hover preview and fractional value support',
  Scrim: 'Overlay backdrop component for modals and dialogs',
  Select: 'Dropdown selection with virtual focus, popover content, and keyboard navigation',
  Selection: 'Selection handling component',
  Single: 'Single item component',
  Slider: 'Range input with drag interaction, keyboard navigation, and multi-thumb support',
  Snackbar: 'Toast notification system with queue management, auto-dismiss, and accessibility',
  Splitter: 'Resizable panel layout with draggable handles and flex-based sizing',
  Step: 'Step/stepper component',
  Switch: 'Toggle control with group support, tri-state, and form integration',
  Tabs: 'Tabbed interface component',
  Theme: 'Scoped theme provider for applying theme context to component subtrees',
  TimePicker: 'Time selection component with hour, minute, and period controls',
  Toggle: 'Pressable toggle button with on/off state management',
  Tooltip: 'Informational popup that appears on hover or focus',
  Tour: 'Guided walkthrough system for onboarding and feature discovery',
  Treeview: 'Hierarchical tree with expand/collapse, multi-selection, and keyboard navigation',
  Virtualizer: 'Virtual scrolling container for efficiently rendering large lists',
} as const

export const VUETIFY0_EXPORTS = {
  utilities: {
    name: 'Utilities',
    path: '@vuetify/v0/utilities',
    description: 'Helper functions for type checking, object manipulation, color, and common transformations',
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
      mergeDeep: 'Deeply merge source objects into a target object (non-mutating)',
      useId: 'Generate unique IDs (SSR-safe with Vue\'s useId)',
      clamp: 'Clamp a value between a minimum and maximum',
      range: 'Create an array of sequential numbers',
      debounce: 'Debounce a function call by a specified delay',
      apca: 'APCA (Accessible Perceptual Contrast Algorithm) contrast calculation',
      foreground: 'Determine optimal foreground color (black/white) for a given background hex',
      hexToRgb: 'Convert hex color string to RGB object',
      rgbToHex: 'Convert RGB object to hex color string',
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
      Extensible: 'Preserves string literal autocomplete while allowing arbitrary strings',
      Activation: 'Keyboard activation mode: automatic (select follows focus) or manual (Enter/Space to select)',
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
  dataTable: {
    name: 'Data Table',
    path: '@vuetify/v0/data-table',
    description: 'Data table module with pluggable adapters for client-side, server-side, and virtual scrolling',
    exports: {
      'adapters/client': 'Client-side data table adapter with local sorting, filtering, and pagination',
      'adapters/server': 'Server-side data table adapter for remote data fetching',
      'adapters/virtual': 'Virtual scrolling data table adapter for large datasets',
    },
  },
  features: {
    name: 'Features',
    path: '@vuetify/v0/features',
    description: 'Feature flag management with pluggable provider adapters',
    exports: {
      'adapters/flagsmith': 'Flagsmith feature flag adapter',
      'adapters/launchdarkly': 'LaunchDarkly feature flag adapter',
      'adapters/posthog': 'PostHog feature flag adapter',
    },
  },
  locale: {
    name: 'Locale',
    path: '@vuetify/v0/locale',
    description: 'Internationalization module with pluggable locale adapters',
    exports: {
      'adapters/v0': 'Built-in v0 locale adapter',
      'adapters/vue-i18n': 'Vue I18n locale adapter',
    },
  },
  logger: {
    name: 'Logger',
    path: '@vuetify/v0/logger',
    description: 'Logging module with pluggable logger adapters',
    exports: {
      'adapters/consola': 'Consola logger adapter',
      'adapters/pino': 'Pino logger adapter',
      'adapters/v0': 'Built-in v0 logger adapter',
    },
  },
  notifications: {
    name: 'Notifications',
    path: '@vuetify/v0/notifications',
    description: 'Notification system types and utilities',
    exports: {},
  },
  palettes: {
    name: 'Palettes',
    path: '@vuetify/v0/palettes',
    description: 'Color palette modules with generation utilities for popular design systems',
    exports: {
      'ant': 'Ant Design color palette',
      'ant/generate': 'Ant Design palette generation',
      'leonardo/generate': 'Adobe Leonardo contrast-based palette generation',
      'material': 'Material Design color palette',
      'material/generate': 'Material Design palette generation (HCT)',
      'md1': 'Material Design 1 color palette',
      'md2': 'Material Design 2 color palette',
      'radix': 'Radix UI color palette',
      'tailwind': 'Tailwind CSS color palette',
    },
  },
  permissions: {
    name: 'Permissions',
    path: '@vuetify/v0/permissions',
    description: 'Permission management with pluggable adapters',
    exports: {
      'adapters/v0': 'Built-in v0 permissions adapter',
    },
  },
  rules: {
    name: 'Rules',
    path: '@vuetify/v0/rules',
    description: 'Validation rules with Standard Schema support',
    exports: {},
  },
  storage: {
    name: 'Storage',
    path: '@vuetify/v0/storage',
    description: 'Storage abstraction with pluggable adapters',
    exports: {
      'adapters/memory': 'In-memory storage adapter',
    },
  },
  theme: {
    name: 'Theme',
    path: '@vuetify/v0/theme',
    description: 'Theme system with CSS variable management and pluggable adapters',
    exports: {
      'adapters/v0': 'Built-in v0 theme adapter',
    },
  },
  browser: {
    name: 'Browser',
    path: '@vuetify/v0/browser',
    description: 'Browser-specific build for non-SSR environments',
    exports: {},
  },
} as const

export type Vuetify0Category = keyof typeof VUETIFY0_COMPOSABLES
export type Vuetify0Component = keyof typeof VUETIFY0_COMPONENTS
export type Vuetify0Export = keyof typeof VUETIFY0_EXPORTS

function text (value: string) {
  return { content: [{ type: 'text' as const, text: value }] }
}

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

      return text(`# @vuetify/v0 (Vuetify0) Documentation\n\nSource: https://github.com/vuetifyjs/0\nWebsite: https://0.vuetifyjs.com/\n\n${data}`)
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

      return text(`# @vuetify/v0 Package Documentation\n\nSource: https://github.com/vuetifyjs/0/tree/master/packages/0\n\n${data}`)
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

      return text(`# @vuetify/v0 Composables\n\nVuetify0 provides 63 tree-shakeable composables organized into 9 categories:\n\n${categories}\n\n**Note**: Vuetify0 is currently in Alpha (v1.0.0-alpha.0). Features may not function as expected.\n\n**Documentation**: https://0.vuetifyjs.com/composables`)
    },

    getComponentList: async () => {
      const components = Object.entries(VUETIFY0_COMPONENTS)
        .map(([name, description]) => `- **${name}**: ${description}`)
        .join('\n')

      return text(`# @vuetify/v0 Components\n\nVuetify0 provides 46 headless components (unstyled, logic-only building blocks):\n\n${components}\n\n**Note**: These are headless components - they provide only logic and state without imposed styling.\n\n**Documentation**: https://0.vuetifyjs.com/components`)
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

        return text(`# ${name}\n\n**Category**: ${categoryData.name} (${category})\n**Description**: ${categoryData.composables[name as keyof typeof categoryData.composables]}\n\n**Documentation**: https://0.vuetifyjs.com/composables/${category}/${kebabName}\n**Source**: https://github.com/vuetifyjs/0/blob/master/packages/0/src/composables/${name}/index.ts\n\n## Source Code\n\n\`\`\`typescript\n${data}\n\`\`\``)
      } catch {
        // If source code fetch fails, return basic info with documentation link
        return text(`# ${name}\n\n**Category**: ${categoryData.name} (${category})\n**Description**: ${categoryData.composables[name as keyof typeof categoryData.composables]}\n\n**Documentation**: https://0.vuetifyjs.com/composables/${category}/${kebabName}\n**Source**: https://github.com/vuetifyjs/0/blob/master/packages/0/src/composables/${name}/index.ts\n\n*Note*: For detailed API documentation, examples, and usage, please visit the documentation link above.`)
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

        return text(`# ${name}\n\n**Description**: ${VUETIFY0_COMPONENTS[name]}\n\n**Documentation**: https://0.vuetifyjs.com/components/${kebabName}\n**Source**: https://github.com/vuetifyjs/0/blob/master/packages/0/src/components/${name}/index.ts\n\n## Source Code\n\n\`\`\`typescript\n${data}\n\`\`\``)
      } catch {
        return text(`# ${name}\n\n**Description**: ${VUETIFY0_COMPONENTS[name]}\n\n**Documentation**: https://0.vuetifyjs.com/components/${kebabName}\n**Source**: https://github.com/vuetifyjs/0/blob/master/packages/0/src/components/${name}/index.ts\n\n*Note*: For detailed API documentation, props, events, and usage examples, please visit the documentation link above.`)
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

      return text(`# @vuetify/v0 Subpath Exports\n\nVuetify0 provides subpath exports for utilities, types, constants, date handling, and feature modules with pluggable adapters:\n\n${exports}\n\n**Documentation**: https://0.vuetifyjs.com/`)
    },

    getSkill: async () => {
      try {
        // Fetch from the docs site for the most up-to-date version
        const response = await fetch('https://0.vuetifyjs.com/SKILL.md')
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }
        const data = await response.text()

        return text(data)
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

        return text(String(data))
      }
    },
  }
}
