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
pnpm install

# Build the project
pnpm run build

# Start the server
pnpm start
```

## Configuration for Claude

To use this MCP server with Claude, add the following to your `.vscode/mcp.json` file:

```json
{
  "servers": {
    "vuetify-mcp": {
      "command": "node",
      "args": [
        "C:\\PATH\\TO\\PARENT\\FOLDER\\vuetify-mcp\\dist\\index.js"
      ],
      "env": {
        "VUETIFY_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Make sure to replace `C:\PATH\TO\PARENT\FOLDER` with the actual path to the parent directory containing your vuetify-mcp folder.


## Features

The Vuetify MCP provides the following capabilities:

### Component Tools

- `get_component_props`: Get detailed information about a component's properties

### Documentation Tools

- `get_installation_guide`: Guide for installing Vuetify

## Project Structure

```
vuetify-mcp/
├── src/
│   ├── index.ts        # Main entry point
│   ├── services/       # Core business logic
│   │   ├── auth.ts        # Authentication service
│   │   ├── component.ts   # Component-related service
│   │   ├── documentation.ts # Documentation-related service
│   └── tools/          # MCP tool definitions
│       ├── component.ts   # Component-related tools
│       ├── documentation.ts # Documentation-related tools
│   └── transports/     # Transport wrappers
│       ├── auth.ts        # Authentication transport wrapper
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Development

To add new features or extend existing ones:

1. Add or update service methods in the appropriate service file.
2. Register the tool in the corresponding tools file.
3. Build and test your changes.

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
