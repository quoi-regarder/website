# Build Stage 1

FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

# Copy dependency files
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies
RUN pnpm i

# Copy the entire project
COPY . ./

# Increase memory limit to prevent heap out-of-memory crashes
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the project
RUN pnpm run build

# Build Stage 2

FROM node:22-alpine
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output/ ./


EXPOSE 3000

CMD ["node", "/app/server/index.mjs"]
