<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.vuetifyjs.com/docs/images/logos/vmcp-logo2-dark.png">
    <img alt="Vuetify One Logo" src="https://cdn.vuetifyjs.com/docs/images/logos/vmcp-logo-light.png" height="150">
  </picture>
</p>

[![npm version](https://img.shields.io/npm/v/@vuetify/mcp.svg)](https://www.npmjs.com/package/@vuetify/mcp)
[![npm downloads](https://img.shields.io/npm/dm/@vuetify/mcp?color=blue)](https://npm.chart.dev/@vuetify/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Model Context Protocol (MCP) server providing Vuetify component information and documentation to any MCP-compatible client or IDE.

## Overview

The Vuetify Model Context Protocol (MCP) server bridges the gap between Vuetify's powerful component library and AI-assisted development environments. This integration enables seamless access to Vuetify's extensive component ecosystem directly within your development workflow.

This MCP server enables IDEs and other Model Context clients to assist with:

- Generating Vuetify components with proper props and attributes
- Creating common UI layouts and patterns following best practices
- Providing comprehensive information about Vuetify features and APIs
- Accessing installation guides, FAQs, and release notes without leaving your IDE
- Working with @vuetify/v0 composables and headless components for building custom design systems

By connecting your development environment to the Vuetify MCP server, you gain AI-powered assistance that understands Vuetify's component structure, styling conventions, and implementation details.

## Quick Start

### Hosted HTTP Server (Easiest)

Use the hosted MCP server directly:

```bash
# Claude Desktop
claude mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp
```

### Local Installation

Run Vuetify MCP locally:

```bash
# Start the Vuetify MCP server
npx -y @vuetify/mcp
```

This command downloads and runs the latest version of the Vuetify MCP server, making it immediately available to your MCP-compatible clients.

## Configuration

You can configure the Vuetify MCP server in your IDE or client by running the interactive CLI or by manually updating your settings file.

### Using the Interactive CLI

The interactive CLI provides the simplest way to configure your environment:

```bash
# Configure for hosted remote server
npx -y @vuetify/mcp config --remote

# Or configure for local installation
npx -y @vuetify/mcp config
```

The CLI will:

1. Detect supported IDEs on your system (VS Code, Claude, Cursor, Trae, Windsurf)
2. Prompt you if multiple IDEs are found
3. Apply the necessary settings automatically to your selected environment
4. Use the hosted server (with `--remote`) or local installation

### Manual Configuration

Below are the locations and JSON snippets for each supported environment. Copy the JSON into your client or IDE settings file at the specified path.

| IDE      | Settings File Path                                                                                                                             | JSON Key Path             |
|----------|------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| VSCode   | `<user home>/.config/Code/User/settings.json`                                                                                                  | `mcp.servers.vuetify-mcp` |
| Claude   | `<user home>/Library/Application Support/Claude/claude_desktop_config.json` (macOS)<br>`%APPDATA%\Claude\claude_desktop_config.json` (Windows) | `mcpServers.vuetify-mcp`  |
| Cursor   | `<user home>/.config/Cursor/User/mcp.json`                                                                                                     | `mcpServers.vuetify-mcp`  |
| Trae     | `<user home>/.config/Trae/User/mcp.json`                                                                                                       | `mcpServers.vuetify-mcp`  |
| Windsurf | `<user home>/.config/Windsurf/User/mcp.json`                                                                                                   | `mcpServers.vuetify-mcp`  |

**Local stdio (most IDEs):**

```json
{
  "mcpServers": {
    "vuetify-mcp": {
      "command": "npx",
      "args": ["-y", "@vuetify/mcp"]
    }
  }
}
```

**Hosted remote server (most IDEs):**

```json
{
  "mcpServers": {
    "vuetify-mcp": {
      "url": "https://mcp.vuetifyjs.com/mcp"
    }
  }
}
```

**VSCode local:**

```json
{
  "servers": {
    "vuetify-mcp": {
      "command": "npx",
      "args": ["-y", "@vuetify/mcp"],
      "env": {
        "VUETIFY_API_KEY": "<YOUR_API_KEY>",
        "GITHUB_TOKEN": "<YOUR_GITHUB_TOKEN>"
      }
    }
  }
}
```

**VSCode remote:**

```json
{
  "servers": {
    "vuetify-mcp": {
      "url": "https://mcp.vuetifyjs.com/mcp"
    }
  }
}
```

**WSL (Windows Subsystem for Linux)**

If you prefer to run the MCP server from Windows using WSL:

```json
{
  "mcpServers": {
    "vuetify-mcp": {
      "command": "wsl.exe",
      "args": [
        "bash",
        "-c",
        "/home/<user>/.nvm/versions/node/<version>/bin/node /home/<user>/sites/mcp/dist/index.js"
      ]
    }
  }
}
```

Replace `<user>` and `<version>` with your actual WSL username and Node.js version.

### Self-Hosted HTTP Server

Run your own HTTP server for remote access:

```bash
# Start with HTTP transport
npx -y @vuetify/mcp --transport=http --port=3000 --host=0.0.0.0 --stateless
```

**Configuration:**

```json
{
  "mcpServers": {
    "vuetify-mcp": {
      "url": "http://your-server:3000/mcp"
    }
  }
}
```

**CLI Arguments:**
- `--transport=http` - Enable HTTP transport
- `--port=3000` - Port number (default: 3000)
- `--host=0.0.0.0` - Host address (default: localhost)
- `--path=/mcp` - Endpoint path (default: /mcp)
- `--stateless` - Stateless mode (recommended for public servers)

## Features

The Vuetify MCP server provides a comprehensive set of tools to enhance your development experience. These tools are automatically available to any MCP-compatible client once the server is configured.

### API Tools

- `get_vuetify_api_by_version`: Download and cache Vuetify API types by version. Supports all major Vuetify versions (2.x and 3.x).
- `get_component_api_by_version`: Return the API list for a specific Vuetify component, including props, events, slots, and exposed methods.
- `get_directive_api_by_version`: Return the API information for a specific Vuetify directive (e.g., `v-ripple`, `v-scroll`). Includes directive description, arguments, default values, and source reference.

### Documentation Tools

- `get_installation_guide`: Get detailed installation guides for various environments, including Vue CLI, Nuxt, Vite, and manual installation methods.
- `get_available_features`: Get a list of available Vuetify features, including components, directives, and composables.
- `get_exposed_exports`: Get a list of exports from the Vuetify npm package, useful for understanding what can be imported directly.
- `get_frequently_asked_questions`: Get the FAQ section from the Vuetify docs, providing answers to common questions and issues.
- `get_release_notes_by_version`: Get release notes for one or more Vuetify versions, helping you understand changes between versions.
- `get_vuetify_one_installation_guide`: Get the README contents for @vuetify/one package from GitHub.

### Vuetify0 (@vuetify/v0) Tools

Support for @vuetify/v0, a headless meta-framework providing unstyled components and composables for building design systems:

- `get_vuetify0_installation_guide`: Get installation and usage instructions for @vuetify/v0 from GitHub.
- `get_vuetify0_package_guide`: Get package-specific documentation for @vuetify/v0.
- `get_vuetify0_composable_list`: List all 28+ composables organized by category (foundation, registration, selection, forms, system, plugins, transformers).
- `get_vuetify0_component_list`: List all 8 headless components (Atom, Avatar, ExpansionPanel, Group, Popover, Selection, Single, Step).
- `get_vuetify0_composable_guide`: Get detailed documentation and source code for specific composables.
- `get_vuetify0_component_guide`: Get detailed documentation and source code for specific components.

## Project Structure

The Vuetify MCP server follows a modular architecture that separates concerns and makes the codebase easier to navigate and extend:

```text
vuetify-mcp/
├── bin/
│   └── cli.js          # CLI entry point with argument handling
├── src/
│   ├── index.ts        # Main server entry point
│   ├── services/       # Core business logic
│   │   ├── api.ts         # API-related services
│   │   ├── documentation.ts # Documentation services
│   │   └── vuetify0.ts    # @vuetify/v0 services
│   ├── tools/          # MCP tool definitions
│   │   ├── api.ts         # API tools
│   │   ├── documentation.ts # Documentation tools (includes @vuetify/v0)
│   ├── transports/     # Transport implementations
│   │   └── http.ts        # HTTP transport with stateless/stateful modes
│   └── cli/            # Interactive CLI configuration
├── package.json
├── tsconfig.json
└── README.md
```

This structure makes it easy to locate specific functionality and extend the server with new features.

## Development

If you want to contribute to the Vuetify MCP server or customize it for your own needs, follow these steps to set up your development environment:

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The development server will start with hot-reloading enabled, allowing you to see your changes immediately.

### Adding New Features

To add new features or extend existing ones:

1. Add or update service methods in the appropriate service file (e.g., `src/services/component.ts`)
2. Register the tool in the corresponding tools file (e.g., `src/tools/component.ts`)
3. Build and test your changes

## MCP SDK Integration

This project uses the `@modelcontextprotocol/sdk` package to create a Model Context Protocol server that Claude and other AI assistants can interact with. The MCP architecture enables AI assistants to:

- Call specific tools defined in the server
- Receive structured responses in a standardized format
- Provide a better experience for Vuetify-related inquiries

The implementation follows the standard MCP patterns with:

- Server initialization using `McpServer` class
- Parameter validation with Zod schemas for type safety
- Multiple transport options: stdio (default) and HTTP with session management

### Example Tool Implementation

Here's a simplified example of how a tool is implemented in the Vuetify MCP server:

```typescript
// In src/tools/component.ts
import { z } from 'zod';
import { componentService } from '../services/component';

export const getComponentApiByVersion = {
  name: 'get_component_api_by_version',
  description: 'Return the API list for a Vuetify component',
  parameters: z.object({
    component: z.string().describe('The component name (e.g., "VBtn")'),
    version: z.string().optional().describe('Vuetify version (defaults to latest)')
  }),
  handler: async ({ component, version }) => {
    return componentService.getComponentApi(component, version);
  }
};
```

## Troubleshooting

### Common Issues

- **Server Not Starting**: Ensure you have Node.js 16 or higher installed
- **Configuration Not Working**: Verify the paths and JSON structure in your settings file
- **Missing API Information**: Check that you're using a supported Vuetify version

### Getting Help

If you encounter issues not covered here, please:

1. Check the [GitHub issues](https://github.com/vuetifyjs/mcp/issues) for similar problems
2. Join the [Vuetify Discord](https://discord.com/invite/vuetify) for community support
3. Open a new issue with detailed reproduction steps

## Version Compatibility

The Vuetify MCP server is compatible with:

- Vuetify 3.x
- Node.js 22 and higher
- All major MCP-compatible clients (Claude, VSCode, etc.)

## License

Vuetify MCP is available under the [MIT](http://opensource.org/licenses/MIT) software license.

Copyright (c) 2025-present Vuetify, LLC
