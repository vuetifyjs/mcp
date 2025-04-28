import { resolve } from "path"
import { ansi256 } from "kolorist"

const dirname = new URL('.', import.meta.url).pathname
const mcpPath = resolve(dirname, '../index.js')

const blue = ansi256(33)

const startMessage = blue(`Welcome to the Vuetify MCP Server!
You run this server, but you don't have to.
Open your IDE and paste this into your
.vscode/settings.json file:`)

const configMessage = blue(`Welcome to the Vuetify MCP Server!
Open your IDE and paste this into your
.vscode/settings.json file:`)

export const intro = (command?: 'config' | (string & {})) => console.log(`
${command === 'config' ? configMessage : startMessage}

{
  "servers": {
    "vuetify-mcp": {
      "command": "node",
      "args": [
        "${mcpPath}"
      ],
      "env": {
        "VUETIFY_API_KEY": "your_api_key_here"
      }
    }
  }
}
`)