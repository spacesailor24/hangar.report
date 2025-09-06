# Hangar Report

A Star Citizen news and leaks curation website with a NASA-punk aesthetic. Built with Next.js, Prisma, and PostgreSQL.

## Local Development Setup

### Prerequisites
- Node.js (18+)
- pnpm (recommended) or npm
- Docker (for local database)

### Database Setup

This project uses PostgreSQL with Prisma ORM. Follow these steps to get your local database running:

#### 1. Start PostgreSQL with Docker Compose

Start the PostgreSQL database using the provided docker-compose file:

```bash
docker-compose up -d
```

**What this does:**
- Reads the `docker-compose.yml` file in your project root
- Creates a PostgreSQL container named "hangar_report_db"
- Sets up the database with username "postgres", password "postgres"
- Creates a database called "hangar_report"
- Maps port 5433 on your machine to port 5432 in the container
- Runs PostgreSQL 16 Alpine (lightweight version)
- Creates a persistent volume so your data survives container restarts

#### 2. Environment Setup

Create a `.env.local` file in your project root with:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/hangar_report?schema=public"
```

**What this is:**
- A connection string that tells your app how to connect to the database
- Format: `postgresql://[username]:[password]@[host]:[port]/[database_name]?schema=public`
- Matches the credentials defined in `docker-compose.yml`

#### 3. Install Dependencies

```bash
pnpm install
```

#### 4. Database Schema Setup

Generate the Prisma client (this creates TypeScript types based on your database schema):

```bash
pnpx prisma generate
```

Apply the database schema (this creates the actual tables in your database):

```bash
pnpx prisma db push
```

**What this does:**
- Reads your `prisma/schema.prisma` file
- Creates tables, columns, and relationships in your PostgreSQL database
- No migration files needed for local development

#### 5. Seed the Database

Populate your database with sample data:

```bash
pnpx tsx prisma/seed.ts
```

**What this does:**
- Runs the seed script to create sample transmissions, tags, and topics
- Uses the markdown files in `prisma/content/` for transmission content
- Creates realistic test data you can see in your local app

### Development Commands

#### Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

#### Database Management

View your database in a web interface:
```bash
pnpx prisma studio
```

Reset your database (clears all data):
```bash
pnpx prisma db push --force-reset
```

Re-seed after reset:
```bash
pnpx tsx prisma/seed.ts
```

#### Docker Database Management

Stop the database:
```bash
docker-compose down
```

Start the database (if already created):
```bash
docker-compose up -d
```

Remove the database and volumes completely (this deletes all data):
```bash
docker-compose down -v
```

Check if database is running:
```bash
docker-compose ps
```

View database logs:
```bash
docker-compose logs postgres
```

### Project Structure

- `src/app/` - Next.js 15 App Router pages and layouts
- `src/components/` - React components
- `src/lib/` - Utility functions and Prisma client
- `prisma/schema.prisma` - Database schema definition
- `prisma/content/` - Markdown files for transmission content
- `prisma/seed.ts` - Database seeding script

### Adding New Transmissions

1. Create a new markdown file in `prisma/content/`
2. Add the transmission data to `prisma/seed.ts`
3. Re-run the seed script: `pnpx tsx prisma/seed.ts`

### Troubleshooting

**Database connection failed?**
- Make sure Docker is running: `docker-compose ps`
- Check if the database container is running: `docker-compose up -d`
- Verify the DATABASE_URL in `.env.local` matches the docker-compose.yml settings
- Check database logs: `docker-compose logs postgres`

**Prisma client errors?**
- Regenerate the client: `pnpx prisma generate`
- Make sure the database schema is applied: `pnpx prisma db push`

**Seed script fails?**
- Check that all markdown files exist in `prisma/content/`
- Ensure the database is running and accessible
- Try resetting the database: `pnpx prisma db push --force-reset`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
