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

# Set environment variables for build time
ARG CC_DATABASE_URL
ARG CC_DIRECT_URL
ARG CLOUDINARY_API_SECRET
ARG CLOUDINARY_API_KEY
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV DATABASE_URL=$CC_DATABASE_URL
ENV DIRECT_URL=$CC_DIRECT_URL
ENV CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET
ENV CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME


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

RUN mkdir -p /app/.next/cache/images && chown -R node:node /app

# Run the application
USER node
EXPOSE 3000
CMD ["npm", "start"]