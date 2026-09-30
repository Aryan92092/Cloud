# ============================================================
# Frontend Dockerfile  -  2-stage build
#
# Stage 1 (builder): Install deps + run "npm run build"
#                    produces static files in /app/dist
# Stage 2 (runner) : Copy /dist into a lightweight Nginx image
#                    Nginx serves the files and proxies /api/*
#                    to the backend container.
# ============================================================

# -- Stage 1: Build the React application --------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for Docker layer caching
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies needed by Vite)
RUN npm ci

# Copy the rest of the frontend source code
COPY . .

# Build the production bundle  (output goes to /app/dist)
RUN npm run build

# -- Stage 2: Serve with Nginx --------------------------------
FROM nginx:1.27-alpine AS runner

# Remove the default Nginx HTML placeholder
RUN rm -rf /usr/share/nginx/html/*

# Copy our built React files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx listens on port 80
EXPOSE 80

# Start Nginx in the foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]
