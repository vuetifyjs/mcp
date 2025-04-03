/**
 * Documentation Service for Vuetify MCP
 * Provides documentation and guides
 */

export class DocumentationService {
  private componentList: Record<string, string>;
  
  constructor() {
    // Initialize component list with descriptions
    this.componentList = {
      "v-app": "The v-app component is required for all applications. It's the root component that manages theme and more.",
      "v-btn": "Buttons with various styles, colors, and states.",
      "v-card": "Cards for containing content and actions about a single subject.",
      "v-dialog": "Dialog for showing temporary content or getting user input.",
      "v-form": "Form validation and submission handling.",
      "v-text-field": "Text input with Vuetify styling and validation.",
      "v-select": "Dropdown selection component.",
      "v-tabs": "Tabbed interface component.",
      "v-data-table": "Data table with sorting, pagination, and filtering.",
      "v-navigation-drawer": "Side navigation component.",
      "v-app-bar": "Top application bar component.",
      "v-footer": "Footer component for applications.",
      "v-list": "Versatile component used for displaying information. Can be used as a navigation, list of contacts, or simple menu.",
      "v-menu": "Popup menu that can be attached to any component.",
      "v-sheet": "Base component that most components are built upon.",
      "v-autocomplete": "Select component with autocomplete functionality.",
      "v-combobox": "Combination of text field and select with ability to add new values.",
      "v-checkbox": "Standard checkbox component.",
      "v-radio": "Radio button input.",
      "v-switch": "Toggle switch input.",
      "v-slider": "Slider control for selecting from a range of values.",
      "v-chip": "Small, versatile component for selections, information, or actions.",
      "v-tooltip": "Popup tooltip that appears when hovering over an element.",
      "v-snackbar": "Brief message that appears at the bottom of the screen.",
      "v-alert": "Colored banner for displaying important information.",
      "v-icon": "Material Design icons."
    };
  }

  /**
   * Get list of common components with descriptions
   * @returns Object mapping component names to descriptions
   */
  getComponentList(): Record<string, string> {
    return this.componentList;
  }

  /**
   * Get information about Vuetify's color system
   * @returns Markdown-formatted string with color system documentation
   */
  getColorSystemInfo(): string {
    return `
# Vuetify Color System

## Built-in Colors
Vuetify comes with a predefined set of colors based on the Material Design color palette:
- \`primary\`: Default theme primary color (default: blue)
- \`secondary\`: Default theme secondary color (default: grey)
- \`accent\`: Default theme accent color
- \`error\`: Used to indicate error state (default: red)
- \`info\`: Used to display information (default: blue)
- \`success\`: Used to indicate success state (default: green)
- \`warning\`: Used to indicate warning state (default: orange)

## Usage Examples
- In components: \`<v-btn color="primary">Button</v-btn>\`
- In styles: \`class="bg-primary text-white"\`

## Color Variations
Each color has multiple variations from lightest to darkest:
- Lighten: \`primary-lighten-5\` through \`primary-lighten-1\`
- Base: \`primary\`
- Darken: \`primary-darken-1\` through \`primary-darken-5\`

## CSS Classes
- Background: \`bg-[color]\` (e.g., \`bg-primary\`)
- Text: \`text-[color]\` (e.g., \`text-primary\`)

## Theme Customization
You can customize the theme in your Vuetify configuration:

\`\`\`javascript
// plugins/vuetify.js
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',   // Customize primary color
          secondary: '#424242', // Customize secondary color
          accent: '#82B1FF',    // Customize accent color
          error: '#FF5252',     // Customize error color
          info: '#2196F3',      // Customize info color
          success: '#4CAF50',   // Customize success color
          warning: '#FB8C00',   // Customize warning color
        }
      },
      dark: {
        dark: true,
        colors: {
          // Custom dark theme colors
        }
      }
    }
  }
})
\`\`\`
`;
  }

  /**
   * Get information about Vuetify's grid system
   * @returns Markdown-formatted string with grid system documentation
   */
  getGridSystemInfo(): string {
    return `
# Vuetify Grid System

Vuetify uses a 12-column grid system based on Flexbox.

## Basic Structure
\`\`\`html
<v-container>
  <v-row>
    <v-col cols="12" md="6">Column 1</v-col>
    <v-col cols="12" md="6">Column 2</v-col>
  </v-row>
</v-container>
\`\`\`

## Breakpoints
- \`xs\`: < 600px
- \`sm\`: 600px > < 960px
- \`md\`: 960px > < 1280px
- \`lg\`: 1280px > < 1920px
- \`xl\`: >= 1920px

## Column Props
- \`cols\`: Number of columns (1-12) on extra small screens and up
- \`sm\`, \`md\`, \`lg\`, \`xl\`: Number of columns at respective breakpoints

## Alignment
- \`align="start|center|end|baseline|stretch"\`
- \`justify="start|center|end|space-between|space-around"\`

## Spacing
- \`<v-container fluid>\`: Full-width container
- \`<v-container class="pa-0">\`: Container with no padding
- \`<v-row dense>\`: Row with less gutter
- \`<v-spacer>\`: Flexible spacer between components

## Examples

### Basic Grid
\`\`\`html
<v-container>
  <v-row>
    <v-col cols="12" sm="6" md="4">
      <v-card title="Column 1"></v-card>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-card title="Column 2"></v-card>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-card title="Column 3"></v-card>
    </v-col>
  </v-row>
</v-container>
\`\`\`

### Nested Grid
\`\`\`html
<v-container>
  <v-row>
    <v-col cols="12" md="6">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="6">Nested Column 1</v-col>
            <v-col cols="6">Nested Column 2</v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card title="Regular Column"></v-card>
    </v-col>
  </v-row>
</v-container>
\`\`\`

### Column Offsets
\`\`\`html
<v-container>
  <v-row>
    <v-col cols="4">Column 1</v-col>
    <v-col cols="4" offset="4">Column 2 (with offset)</v-col>
  </v-row>
  <v-row>
    <v-col cols="3" offset="3">Column 3 (with offset)</v-col>
    <v-col cols="3" offset="3">Column 4 (with offset)</v-col>
  </v-row>
</v-container>
\`\`\`
`;
  }

  /**
   * Get installation guide for Vuetify
   * @returns Markdown-formatted string with installation guide
   */
  getInstallationGuide(): string {
    return `
# Vuetify Installation Guide

## Using Vue CLI
\`\`\`bash
vue create my-app
cd my-app
vue add vuetify
\`\`\`

## Using Vite
\`\`\`bash
# Create a new Vite project
npm create vuetify
\`\`\`

## Nuxt.js
\`\`\`bash
yarn add @nuxtjs/vuetify -D
\`\`\`

Then add to your \`nuxt.config.js\`:
\`\`\`js
buildModules: [
  '@nuxtjs/vuetify',
]
\`\`\`

## Manual Installation (Vue 3)
\`\`\`bash
npm install vuetify@next
\`\`\`

In your \`main.js\`:
\`\`\`js
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

createApp(App)
  .use(vuetify)
  .mount('#app')
\`\`\`

Create \`plugins/vuetify.js\`:
\`\`\`js
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

export default createVuetify({
  // Configuration options
})
\`\`\`

## Required Imports

### Fonts and Icons
To use Material Design Icons:

\`\`\`bash
npm install @mdi/font -D
\`\`\`

Then in your \`plugins/vuetify.js\`:
\`\`\`js
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  // Configuration options
})
\`\`\`

### Tree-shaking Setup
For tree-shaking (optimized bundle size):

\`\`\`js
import { createVuetify } from 'vuetify'
import { VBtn, VCard } from 'vuetify/components'

export default createVuetify({
  components: {
    VBtn,
    VCard,
    // Add only the components you use
  }
})
\`\`\`
`;
  }

  /**
   * Get guide for customizing Vuetify themes
   * @returns Markdown-formatted string with theme customization guide
   */
  getThemeCustomizationGuide(): string {
    return `
# Vuetify Theme Customization Guide

Vuetify allows extensive customization of your application's theme, including colors, dark mode, and more.

## Basic Theme Configuration

\`\`\`js
// plugins/vuetify.js
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#2196F3',
          secondary: '#757575',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        }
      }
    }
  }
})
\`\`\`

## Runtime Theme Switching

You can switch between themes at runtime with the \`useTheme\` composable:

\`\`\`vue
<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

// Toggle between light and dark
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<template>
  <v-btn @click="toggleTheme">
    Toggle Theme
    <v-icon>
      {{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
    </v-icon>
  </v-btn>
</template>
\`\`\`

## Custom Theme Creation

You can create custom themes beyond just light and dark:

\`\`\`js
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: { /* light theme colors */ },
      dark: { /* dark theme colors */ },
      customBlue: {
        dark: false,
        colors: {
          primary: '#1E88E5',
          secondary: '#0D47A1',
          accent: '#82B1FF',
          // other colors
        }
      },
      customGreen: {
        dark: false,
        colors: {
          primary: '#4CAF50',
          secondary: '#1B5E20',
          accent: '#B9F6CA',
          // other colors
        }
      }
    }
  }
})
\`\`\`

## SASS Variables

For deeper customization, you can override SASS variables:

1. Create a \`variables.scss\` file:
\`\`\`scss
// variables.scss
@import 'vuetify/settings';

// Override variables here
$border-radius-root: 6px;
$font-size-root: 16px;
$btn-letter-spacing: 0;
\`\`\`

2. Import in your Vuetify configuration:
\`\`\`js
// vite.config.js
export default {
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: \`@import "@/styles/variables.scss";\`
      }
    }
  }
}
\`\`\`

## Variants and Elevations

You can also customize component variants and elevations:

\`\`\`js
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    // ...theme configuration
  },
  defaults: {
    VBtn: {
      color: 'primary',
      variant: 'flat',
      size: 'large',
    },
    VCard: {
      elevation: 4,
      border: true,
    }
  }
})
\`\`\`
`;
  }

  /**
   * Get information about Vuetify version compatibility with Vue
   * @returns Markdown-formatted string with version compatibility information
   */
  getVersionCompatibility(): string {
    return `
# Vuetify Version Compatibility

## Vuetify 3.x
- Compatible with Vue 3.x
- Latest release: Vuetify 3.5.x
- Requires Node.js 16+
- Modern browser support only

## Vuetify 2.x
- Compatible with Vue 2.x
- Latest release: Vuetify 2.7.x
- Requires Node.js 12+
- Supports IE11 with polyfills

## Migration
To migrate from Vuetify 2 to Vuetify 3:
1. Update Vue to version 3
2. Update Vuetify to version 3
3. Follow the migration guide: https://next.vuetifyjs.com/en/getting-started/upgrade-guide/

## Key Differences
- Vuetify 3 is built with the Composition API
- Component props and events have changed in v3
- CSS variables are used more extensively in v3
- Better tree-shaking in v3
- Improved TypeScript support in v3
`;
  }

  /**
   * Search Vuetify documentation based on a query
   * @param query Search term or phrase
   * @returns Markdown-formatted search results
   */
  searchDocs(query: string): string {
    // In a real implementation, this would connect to a search index or API
    // This is a simplified example showing structure only
    
    // Simulate search results
    const results: Record<string, string> = {
      "button": "Buttons are an essential element of user interaction. Vuetify offers the v-btn component with various styles and properties.",
      "card": "Cards are versatile containers for content and actions about a single subject.",
      "grid": "Vuetify uses a 12-column grid system based on flexbox.",
      "theme": "Vuetify's theming system allows for complete customization of your application's colors and styles.",
      "form": "Vuetify provides comprehensive form components with validation capabilities.",
      "icon": "Vuetify supports Material Design Icons and other icon sets.",
      "layout": "Vuetify includes several components for creating responsive layouts.",
      "navigation": "Navigation components include v-navigation-drawer, v-app-bar, and more."
    };
    
    // Check for matching terms
    const matchingResults: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(results)) {
      if (key.toLowerCase().includes(query.toLowerCase()) || 
          value.toLowerCase().includes(query.toLowerCase())) {
        matchingResults[key] = value;
      }
    }
    
    if (Object.keys(matchingResults).length === 0) {
      return `No documentation found for query: '${query}'. Try a different search term.`;
    }
    
    // Format results
    let result = `# Search Results for '${query}'\n\n`;
    
    for (const [key, value] of Object.entries(matchingResults)) {
      result += `## ${key.charAt(0).toUpperCase() + key.slice(1)}\n${value}\n\n`;
    }
    
    return result;
  }
}
