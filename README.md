# Vuetify MCP

Machine Context Protocol (MCP) server for Vuetify assistance in Claude.

## Overview

This MCP server provides Claude with access to Vuetify component information, layout templates, and documentation. It enables Claude to assist with:

- Generating Vuetify components with proper props
- Creating common UI layouts
- Providing information about Vuetify features
- Answering questions about the Vuetify framework

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## Configuration for Claude

To use this MCP server with Claude, add the following to your `.mcp.json` file:

```json
{
    "mcpServers": {
        "vuetify-mcp": {
            "command": "node",
            "args": [
                "C:\\PATH\\TO\\PARENT\\FOLDER\\vuetify-mcp\\dist\\index.js"
            ]
        }
    }
}
```

Make sure to replace `C:\PATH\TO\PARENT\FOLDER` with the actual path to the parent directory containing your vuetify-mcp folder.


## Features

The Vuetify MCP provides the following capabilities:

### Component Tools

- `get_component_props`: Get detailed information about a component's properties
- `generate_component`: Create HTML for a Vuetify component with specified properties
- `generate_form`: Create a Vuetify form with specified fields

### Layout Tools

- `create_layout_example`: Generate example code for common layouts (dashboard, login, landing)
- `list_available_layouts`: Get a list of available layout templates
- `create_custom_layout`: Generate a custom layout based on components specification

### Documentation Tools

- `list_vuetify_components`: Get a list of commonly used Vuetify components
- `get_color_system_info`: Information about Vuetify's color system
- `get_grid_system_info`: Information about Vuetify's grid system
- `get_installation_guide`: Guide for installing Vuetify
- `get_theme_customization_guide`: Guide for customizing Vuetify themes
- `search_docs`: Search Vuetify documentation based on a query
- `get_version_compatibility`: Information about Vuetify version compatibility with Vue

## Project Structure

```
vuetify-mcp/
├── src/
│   ├── index.ts        # Main entry point
│   ├── services/       # Core business logic
│   │   ├── component.ts   # Component generation service
│   │   ├── layout.ts      # Layout creation service
│   │   └── documentation.ts # Documentation service
│   ├── tools/          # MCP tool definitions
│   │   ├── component.ts   # Component-related tools
│   │   ├── layout.ts      # Layout-related tools
│   │   └── documentation.ts # Documentation-related tools
│   └── types/          # TypeScript type definitions
├── dist/               # Compiled JavaScript files
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Development

To add new features or extend existing ones:

1. Add or update service methods in the appropriate service file
2. Register the tool in the corresponding tools file
3. Build and test your changes

## MCP SDK Integration

This project uses the `@modelcontextprotocol/sdk` package to create a Machine Context Protocol server that Claude can interact with. The MCP architecture enables Claude to:

- Call specific tools defined in the server
- Receive structured responses
- Provide a better experience for Vuetify-related inquiries

The implementation follows the standard MCP patterns with:
- Server initialization using `McpServer`
- Parameter validation with Zod schemas
- StdioServerTransport for communication

## License

MIT
