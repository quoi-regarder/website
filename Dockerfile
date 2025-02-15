# Step 1: Build the application
FROM node:20-alpine AS build
WORKDIR /app

# Disable Husky in Docker builds
ENV HUSKY=0
ENV CI=true

# Copy dependency files
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the rest of the source code
COPY . .

# Run "nuxt prepare" after installation
RUN npm run postinstall

# Build the Nuxt application in production SSR mode
RUN npm run build

# Step 2: Run the application
FROM node:20-alpine
WORKDIR /app

# Copy only the necessary files from the previous build stage
COPY --from=build /app/.output ./

# Expose the port used by Nuxt
EXPOSE 3000

# Start the Nuxt application in SSR mode
CMD ["node", ".output/server/index.mjs"]
