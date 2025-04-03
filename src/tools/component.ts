/**
 * Component Tools for Vuetify MCP
 * Registers component-related tools with the MCP server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ComponentService } from '../services/component.js';

// Create a service instance
const componentService = new ComponentService();

export function registerComponentTools(server: McpServer) {
  /**
   * Get detailed information about a Vuetify component's properties
   */
  server.tool(
    "get_component_props",
    "Get detailed information about a Vuetify component's properties",
    {
      componentName: z.string().describe('The name of the Vuetify component (e.g., v-btn, v-card)')
    },
    async ({ componentName }) => {
      const props = componentService.getComponentProps(componentName);
      
      if (Object.keys(props).length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No information available for component '${componentName}'. Please check the component name.`
            }
          ]
        };
      }
      
      let result = `# Properties for ${componentName}\n\n`;
      
      for (const [prop, details] of Object.entries(props)) {
        if (Array.isArray(details)) {
          result += `- **${prop}**: Options: ${details.join(', ')}\n`;
        } else {
          result += `- **${prop}**: ${details}\n`;
        }
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
   * Generate a Vuetify component with specified properties
   */
  server.tool(
    "generate_component",
    "Generate a Vuetify component with specified properties",
    {
      componentName: z.string().describe('The name of the component (e.g., v-btn, v-card)'),
      props: z.record(z.any()).describe('Dictionary of property names and values'),
      content: z.string().optional().describe('Optional content to include inside the component')
    },
    async ({ componentName, props, content }) => {
      const code = componentService.generateComponentCode(componentName, props, content);
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
   * Generate a Vuetify form with specified fields
   */
  server.tool(
    "generate_form",
    "Generate a Vuetify form with specified fields",
    {
      formFields: z.array(
        z.object({
          type: z.string().describe('Type of form field (e.g., v-text-field, v-select)'),
          label: z.string().optional().describe('Label for the field'),
          props: z.record(z.any()).optional().describe('Additional properties for the field')
        })
      ).describe('List of field configurations for the form')
    },
    async ({ formFields }) => {
      const formCode = componentService.generateForm(formFields);
      return {
        content: [
          {
            type: "text",
            text: `\`\`\`html\n${formCode}\n\`\`\``
          }
        ]
      };
    }
  );
}
