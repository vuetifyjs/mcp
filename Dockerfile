FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN pnpm build

# Expose port
EXPOSE 3000

# Start server with HTTP transport
CMD ["node", "bin/cli.js", "--transport=http", "--host=0.0.0.0", "--port=3000", "--path=/mcp", "--stateless"]
