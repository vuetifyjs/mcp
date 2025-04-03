/**
 * Documentation Tools for Vuetify MCP
 * Registers documentation-related tools with the MCP server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DocumentationService } from '../services/documentation.js';

// Create a service instance
const documentationService = new DocumentationService();

export function registerDocumentationTools(server: McpServer) {
  /**
   * Get a list of commonly used Vuetify components with brief descriptions
   */
  server.tool(
    "list_vuetify_components",
    "Get a list of commonly used Vuetify components with brief descriptions",
    {},
    async () => {
      const components = documentationService.getComponentList();
      
      let result = "# Commonly Used Vuetify Components\n\n";
      
      for (const [name, description] of Object.entries(components)) {
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
   * Get information about Vuetify's color system
   */
  server.tool(
    "get_color_system_info",
    "Get information about Vuetify's color system",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: documentationService.getColorSystemInfo()
          }
        ]
      };
    }
  );

  /**
   * Get information about Vuetify's grid system
   */
  server.tool(
    "get_grid_system_info",
    "Get information about Vuetify's grid system",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: documentationService.getGridSystemInfo()
          }
        ]
      };
    }
  );

  /**
   * Get installation guide for Vuetify
   */
  server.tool(
    "get_installation_guide",
    "Get installation guide for Vuetify",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: documentationService.getInstallationGuide()
          }
        ]
      };
    }
  );

  /**
   * Get guide for customizing Vuetify themes
   */
  server.tool(
    "get_theme_customization_guide",
    "Get guide for customizing Vuetify themes",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: documentationService.getThemeCustomizationGuide()
          }
        ]
      };
    }
  );

  /**
   * Search Vuetify documentation based on a query
   */
  server.tool(
    "search_docs",
    "Search Vuetify documentation based on a query",
    {
      query: z.string().describe('Search term or phrase')
    },
    async ({ query }) => {
      return {
        content: [
          {
            type: "text",
            text: documentationService.searchDocs(query)
          }
        ]
      };
    }
  );

  /**
   * Get information about Vuetify version compatibility with Vue
   */
  server.tool(
    "get_version_compatibility",
    "Get information about Vuetify version compatibility with Vue",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: documentationService.getVersionCompatibility()
          }
        ]
      };
    }
  );
}
