# Use Node.js alpine as base image instead of plain alpine
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set a dummy DATABASE_URL for build time (Prisma generate doesn't need real DB)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Generate Prisma client (this doesn't need database connection)
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production 

# Copy built artifacts and necessary files from builder stage
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
# Copy the generated Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Run the application
USER node
EXPOSE 3000
CMD ["npm", "start"]