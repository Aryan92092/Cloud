# ============================================================
# Backend Dockerfile
# Node.js 20 LTS on Alpine Linux (small, secure, stable)
# ============================================================

# -- Stage 1: Install production dependencies ----------------
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files first (Docker cache layer optimisation)
COPY package.json package-lock.json ./

# Install ONLY production dependencies (no devDependencies)
RUN npm ci --omit=dev

# -- Stage 2: Runtime image -----------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the entire backend application source code
COPY . .

# Expose the backend port (must match PORT env variable)
EXPOSE 5000

# Health check: calls the existing /api/health endpoint every 30 s
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# Start the backend using the existing production start command
CMD ["node", "server.js"]
