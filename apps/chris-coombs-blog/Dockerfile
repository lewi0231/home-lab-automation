# syntax=docker/dockerfile:1.4
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

# Build the Next.js app using ephemeral secrets (not persisted in layers)
RUN --mount=type=secret,id=CC_DATABASE_URL \
    --mount=type=secret,id=CC_DIRECT_URL \
    --mount=type=secret,id=CLOUDINARY_API_KEY \
    --mount=type=secret,id=CLOUDINARY_API_SECRET \
    --mount=type=secret,id=NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME \
    DATABASE_URL="$(cat /run/secrets/CC_DATABASE_URL 2>/dev/null || true)" \
    DIRECT_URL="$(cat /run/secrets/CC_DIRECT_URL 2>/dev/null || true)" \
    CLOUDINARY_API_KEY="$(cat /run/secrets/CLOUDINARY_API_KEY 2>/dev/null || true)" \
    CLOUDINARY_API_SECRET="$(cat /run/secrets/CLOUDINARY_API_SECRET 2>/dev/null || true)" \
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="$(cat /run/secrets/NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 2>/dev/null || true)" \
    && export DATABASE_URL DIRECT_URL CLOUDINARY_API_KEY CLOUDINARY_API_SECRET NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME \
    && npx prisma generate \
    && npm run build

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

RUN mkdir -p /app/.next/cache/images && chown -R node:node /app

# Run the application
USER node
EXPOSE 3000
CMD ["npm", "start"]