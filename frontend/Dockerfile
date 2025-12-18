# Multi-stage build for React application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json only (avoid stale lockfiles)
COPY package.json ./

# Install dependencies for build
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy built application from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create necessary directories
RUN mkdir -p /var/cache/nginx /var/run/nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]