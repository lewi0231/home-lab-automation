# Personal Blog

A personal blog built with Next.js 15, React 19, Tailwind CSS v4, and Prisma with PostgreSQL (Supabase). Features include admin access control, Mermaid diagram support, and a modern responsive design.

## Features

- Blog posts with MDX support
- Admin panel with secret key access control
- Mermaid diagram rendering in blog posts
- Responsive and accessible design
- Dark/light mode support
- PostgreSQL database with Prisma ORM
- Supabase integration for production database

## Database Setup

This project uses Supabase as the production database. Supabase provides two database URLs:

- `DATABASE_URL`: Used for general database operations and connection pooling
- `DIRECT_URL`: Used for migrations and direct database access

Prisma automatically selects the appropriate URL based on the operation:
- Migrations and schema pushes use `DIRECT_URL` (if available)
- General queries use `DATABASE_URL`

### Environment Variables

Create the following environment files:

**Development** (`.env.development`):
```
DATABASE_URL="postgresql://username:password@localhost:5432/blog_dev"
ADMIN_SECRET="your-secret-key-here"
```

**Production** (`.env.production`):
```
DATABASE_URL="postgresql://postgres:[password]@[project-ref].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[password]@[project-ref].supabase.co:5432/postgres"
ADMIN_SECRET="your-production-secret-key"
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables (see above)

3. Push the database schema:
```bash
# Development
npm run db:push

# Production (Supabase)
npm run db:push:production
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema to development database
- `npm run db:push:production` - Push schema to production database
- `npm run db:studio` - Open Prisma Studio
- `npm run migrate:mdx` - Migrate MDX content to JSON format

## Environment-Specific Commands

For different environments, use these commands:

```bash
# Development
npm run dev:development
npm run build:development
npm run start:development

# Production
npm run dev:production
npm run build:production
npm run start:production
```

## Admin Access

Access the admin panel at `/admin` with the secret key defined in your `ADMIN_SECRET` environment variable.

## Deployment

The project is configured for deployment in a Kubernetes cluster with Supabase as the production database. The Dockerfile includes Prisma client generation during build to avoid runtime database access requirements.

## Contributing

This is a personal blog project. Feel free to fork and adapt for your own use.
