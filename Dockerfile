# Multi-stage build for Panel Dashboard
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files for both client and server
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci
RUN cd client && npm ci
RUN cd server && npm ci

# Build the client
FROM base AS client-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY client ./client

# Build client for production
RUN cd client && npm run build

# Production server image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy server dependencies and source
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY server ./server

# Copy built client files to server public directory
COPY --from=client-builder /app/client/dist ./server/public

# Create images directory for file uploads
RUN mkdir -p ./server/images

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "server/index.js"]