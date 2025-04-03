/**
 * Layout Tools for Vuetify MCP
 * Registers layout-related tools with the MCP server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LayoutService } from '../services/layout.js';

// Create a service instance
const layoutService = new LayoutService();

export function registerLayoutTools(server: McpServer) {
  /**
   * Generate example code for common Vuetify layouts
   */
  server.tool(
    "create_layout_example",
    "Generate example code for common Vuetify layouts",
    {
      layoutType: z.string().describe('Type of layout (e.g., dashboard, login, landing)')
    },
    async ({ layoutType }) => {
      const code = layoutService.getLayoutCode(layoutType);
      
      if (!code) {
        const availableLayouts = layoutService.getAvailableLayouts();
        return {
          content: [
            {
              type: "text",
              text: `Layout type '${layoutType}' not found. Available layouts: ${availableLayouts.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: `\`\`\`html\n${code}\n\`\`\``
          }
        ]
      };
    }
  );

  /**
   * Get a list of available layout templates with descriptions
   */
  server.tool(
    "list_available_layouts",
    "Get a list of available layout templates with descriptions",
    {},
    async () => {
      const layouts = {
        "dashboard": "Admin dashboard with navigation drawer, app bar, and content area",
        "login": "Simple login form in a card centered on the page",
        "landing": "Marketing landing page with hero section, features, and footer"
      };
      
      let result = "# Available Layout Templates\n\n";
      
      for (const [name, description] of Object.entries(layouts)) {
        result += `- **${name}**: ${description}\n`;
      }
      
      return {
        content: [
          {
            type: "text",
            text: result
          }
        ]
      };
    }
  );

  /**
   * Generate a custom layout based on specified components
   */
  server.tool(
    "create_custom_layout",
    "Generate a custom layout based on specified components",
    {
      components: z.array(
        z.object({
          type: z.string().describe('Type of component (e.g., v-app-bar, v-navigation-drawer)'),
          props: z.record(z.any()).optional().describe('Properties for the component'),
          content: z.string().optional().describe('Content to include inside the component'),
          position: z.enum(['header', 'sidebar', 'main', 'footer']).describe('Position in the layout')
        })
      ).describe('List of component configurations for the layout')
    },
    async ({ components }) => {
      const layoutCode = layoutService.createCustomLayout(components);
      return {
        content: [
          {
            type: "text",
            text: `\`\`\`html\n${layoutCode}\n\`\`\``
          }
        ]
      };
    }
  );
}
