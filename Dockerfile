# Step 1: Build the application
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install production dependencies (faster and reproducible)
RUN npm ci --omit=dev

# Copy the rest of the source code
COPY . .

# Run "nuxt prepare" after installation (as in postinstall)
RUN npm run postinstall

# Build the Nuxt application in production SSR mode
RUN npm run build

# Step 2: Run the application
FROM node:20-alpine
WORKDIR /app

# Copy only the necessary files from the previous build stage
COPY --from=build /app/.output ./

# Define environment variables at runtime
ENV NUXT_TMDB_API_KEY=$NUXT_TMDB_API_KEY
ENV NUXT_API_BASE_URL=$NUXT_API_BASE_URL

# Expose the port used by Nuxt
EXPOSE 3000

# Start the Nuxt application in SSR mode
CMD ["node", ".output/server/index.mjs"]
