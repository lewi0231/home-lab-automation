# Database Setup for Personal Blog

This guide will help you set up the PostgreSQL database and migrate from MDX files to the database.

## Prerequisites

1. PostgreSQL database running in your K3s cluster
2. Node.js and npm/pnpm installed
3. Access to the personal-blog application

## Step 1: Deploy PostgreSQL Database

The PostgreSQL database is configured to run in your K3s cluster. Deploy it using:

```bash
# From the clusters/homelab directory
kubectl apply -k environments/development/apps/personal-blog-db
```

## Step 2: Install Dependencies

```bash
cd apps/personal-blog
npm install
```

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the `apps/personal-blog` directory:

```env
DATABASE_URL="postgresql://blog_user:blog_password@personal-blog-db.development.svc.cluster.local:5432/personal_blog"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Generate Prisma Client

```bash
npm run db:generate
```

## Step 5: Push Database Schema

```bash
npm run db:push
```

## Step 6: Migrate Existing MDX Content

You can use Prisma Studio to manually add your existing MDX content:

```bash
npm run db:studio
```

Or create a migration script to import your existing MDX files.

## Step 7: Test the Application

```bash
npm run dev
```

Visit:

- `http://localhost:3000/blog` - Blog listing
- `http://localhost:3000/admin` - Admin interface

## Database Schema

The database includes the following models:

- **Post**: Blog posts with support for different layouts
- **User**: Authors/users
- **Page**: Static pages
- **Setting**: Application settings

### Post Model Features

- Support for different layouts (default, featured, minimal, etc.)
- Custom fields stored as JSON for layout-specific data
- Tags as an array
- SEO metadata
- Author relationships
- Draft/published status

## Next Steps

1. Import your existing MDX content into the database
2. Set up authentication for the admin interface
3. Add markdown rendering for post content
4. Implement the different layout components
5. Add image upload functionality
6. Set up proper SEO metadata

## Troubleshooting

### Database Connection Issues

If you can't connect to the database:

1. Check if the PostgreSQL pod is running:

   ```bash
   kubectl get pods -n development | grep personal-blog-db
   ```

2. Check the database logs:

   ```bash
   kubectl logs -n development deployment/personal-blog-db
   ```

3. Verify the service is accessible:
   ```bash
   kubectl get svc -n development personal-blog-db
   ```

### Prisma Issues

If you encounter Prisma errors:

1. Regenerate the client:

   ```bash
   npm run db:generate
   ```

2. Reset the database (WARNING: This will delete all data):
   ```bash
   npx prisma migrate reset
   ```
