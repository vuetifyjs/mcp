/**
 * Vuetify MCP - Main Entry Point
 * 
 * This file initializes the MCP server and registers all the available tools.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from 'dotenv';

// Import tool registration functions
import { registerComponentTools } from './tools/component.js';
import { registerLayoutTools } from './tools/layout.js';
import { registerDocumentationTools } from './tools/documentation.js';

// Load environment variables
dotenv.config();

// Initialize MCP server
const server = new McpServer({
  name: 'vuetify',
  version: '1.0.0',
  capabilities: {
    resources: {
      description: "No resources required for Vuetify assistance."
    },
    tools: {
      description: "Tools to help with Vuetify component properties, layouts, and documentation."
    },
  },
});

// Register tools with MCP
registerComponentTools(server);
registerLayoutTools(server);
registerDocumentationTools(server);

// Main function to start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Vuetify MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
