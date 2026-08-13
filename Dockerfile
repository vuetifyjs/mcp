FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Pin to packageManager (10.24.0). Unpinned `npm i -g pnpm` then fails
# --frozen-lockfile on a linux-x64 optional binary this lockfile omits.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate && pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN pnpm build

# Expose port
EXPOSE 3000

# Start server with HTTP transport
CMD ["node", "bin/cli.js", "--transport=http", "--host=0.0.0.0", "--port=3000", "--path=/mcp"]
