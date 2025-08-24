# Personal Blog

A personal blog built with Next.js 15, React 19, Tailwind CSS v4, and Prisma with PostgreSQL (Supabase). Features include admin access control, Mermaid diagram support, and a modern responsive design.

## Deployment

## Features

- Blog posts with MDX support
- Admin panel with secret key access control
- Mermaid diagram rendering in blog posts
- Responsive and accessible design
- Dark/light mode support
- PostgreSQL database with Prisma ORM
- Supabase integration for production database

## Environment Setup

This project uses a dual-environment setup that separates **Next.js environment** from **database environment**:

### Environment Variables

The project uses two types of environment configuration:

1. **`NODE_ENV`** - Controls Next.js behavior (development/production)
2. **Database Environment Files** - Control which database to connect to

### Database Setup

This project uses Supabase as the production database. Supabase provides two database URLs:

- `DATABASE_URL`: Used for general database operations and connection pooling
- `DIRECT_URL`: Used for migrations and direct database access

Prisma automatically selects the appropriate URL based on the operation:

- Migrations and schema pushes use `DIRECT_URL` (if available)
- General queries use `DATABASE_URL`

### Environment Files

**Development Database** (`.env.development`):

```
DATABASE_URL="postgresql://blog_user:blog_password@localhost:5432/personal_blog"
ADMIN_SECRET="your-secret-key-here"
```

**Production Database** (`.env.production`):

```
DATABASE_URL="postgresql://postgres:[password]@[project-ref].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[password]@[project-ref].supabase.co:5432/postgres"
ADMIN_SECRET="your-production-secret-key"
```

## Database Migrations

### Production Database Migrations

Migrations are only relevant for the production database (Supabase). The local development database uses `prisma db push` for schema changes.

#### Creating a New Migration

When you modify the Prisma schema (`prisma/schema.prisma`), create a migration:

```bash
# Create and apply a new migration
npm run db:migrate -- --name your_migration_name

# Example:
npm run db:migrate -- --name add_user_profile_fields
```

#### Migration Commands

```bash
# Create and apply a new migration
npm run db:migrate -- --name migration_name

# Apply pending migrations
npm run db:migrate

# Reset database and apply all migrations (⚠️ DESTROYS ALL DATA)
npx dotenv -e .env.production -- npx prisma migrate reset

# View migration status
npx dotenv -e .env.production -- npx prisma migrate status

# Generate Prisma client after schema changes
npx prisma generate
```

#### Migration Workflow

1. **Modify schema**: Edit `prisma/schema.prisma`
2. **Create migration**: `npm run db:migrate -- --name descriptive_name`
3. **Test locally**: `npm run dev:production` to test against production DB
4. **Deploy**: The migration will be applied when you deploy

#### Troubleshooting Migrations

If you get "drift detected" errors:

```bash
# Check what's different between schema and database
npx dotenv -e .env.production -- npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-url $DATABASE_URL

# Reset if needed (⚠️ DESTROYS ALL DATA)
npx dotenv -e .env.production -- npx prisma migrate reset
```

## Script Usage Patterns

The scripts use a combination of `NODE_ENV` and `dotenv` to control both Next.js behavior and database connections:

### Development Mode + Local Database

```bash
npm run dev:development
# NODE_ENV=development + .env.development
# Next.js in development mode + local PostgreSQL (requires port forwarding)
```

### Development Mode + Production Database

```bash
npm run dev:production
# NODE_ENV=development + .env.production
# Next.js in development mode + Supabase database
# Useful for testing against production data
```

### Production Mode + Production Database

```bash
npm run build:production
npm run start:production
# NODE_ENV=production + .env.production
# Next.js in production mode + Supabase database
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up your environment variables (see above)

3. For local development with port forwarding:

```bash
# Port forward to your k3s cluster PostgreSQL
kubectl port-forward svc/personal-blog-db 5432:5432

# Start development server with local database
npm run dev:development
```

4. For development with production database:

```bash
# Start development server with Supabase database
npm run dev:production
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

## Available Scripts

### Core Commands

- `npm run dev` - Start development server (uses .env)
- `npm run build` - Build for production
- `npm run start` - Start production server

### Database Commands

- `npm run db:push` - Push schema to development database
- `npm run db:push:production` - Push schema to production database
- `npm run db:migrate` - Run migrations on production database
- `npm run db:studio` - Open Prisma Studio with production database

### Environment-Specific Commands

**Development Environment:**

```bash
npm run dev:development    # Dev mode + local database
npm run build:development  # Build with local database
npm run start:development  # Start with local database
```

**Production Environment:**

```bash
npm run dev:production     # Dev mode + Supabase database
npm run build:production   # Build with Supabase database
npm run start:production   # Start with Supabase database
```

## Admin Access

Access the admin panel at `/admin` with the secret key defined in your `ADMIN_SECRET` environment variable.

## Deployment

The project is configured for deployment in a Kubernetes cluster with Supabase as the production database. The Dockerfile includes Prisma client generation during build to avoid runtime database access requirements.

## Contributing

This is a personal blog project. Feel free to fork and adapt for your own use.
