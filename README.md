This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Database Configuration

## Setting up the Database

This project uses Vercel Postgres for database storage and Vercel Blob for file storage. Here's how to set it up:

### Local Development

#### Option 1: With Vercel Postgres and Blob (recommended for production)

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. In the Vercel dashboard, create a new Postgres database:
   - Go to the "Storage" tab
   - Select "Create New" → "Postgres"
   - Connect it to your project
   - Copy the provided environment variables to your `.env.local` file

3. In the Vercel dashboard, create a new Blob store:
   - Go to the "Storage" tab
   - Select "Create New" → "Blob"
   - Connect it to your project
   - Copy the provided `BLOB_READ_WRITE_TOKEN` to your `.env.local` file

4. Run the development server:
   ```bash
   npm run dev
   ```

   The database will automatically be initialized with tables and sample data on first run.

#### Option 2: Development Mode (without Vercel services)

The application includes a fallback mode that works without setting up Vercel Postgres or Blob Storage:

1. Simply run the development server:
   ```bash
   npm run dev
   ```

2. The application will:
   - Use in-memory data storage instead of a database
   - Store uploaded files in the `public/uploads` directory
   - Provide all functionality without requiring external services

This mode is ideal for quick local development and testing.

### Production Deployment

1. When deploying to Vercel, add the following environment variables in your project settings:
   - All the Postgres connection variables (automatically added when you connect the database)
   - The Blob token (automatically added when you connect the blob store)
   - `NEXTAUTH_SECRET` - A secure random string for authentication
   - `NEXTAUTH_URL` - Your production URL
   - `ADMIN_USERNAME` and `ADMIN_PASSWORD` - For admin authentication

## Database Schema

The application uses a simple schema:

- `portfolio_items` - Stores portfolio entries with their metadata
  - Fields: id, title, category, video_url, thumbnail, description, tags, created_at, updated_at

## File Storage

Files are stored in Vercel Blob with the following structure:
- Images are stored in the `images/` path
- Videos are stored in the `videos/` path

Files are automatically organized and named with timestamps to prevent collisions.

## Multiple Projects with One Blob Storage

You can use a single Vercel Blob storage instance across multiple projects by:

1. Using the same `BLOB_READ_WRITE_TOKEN` in all projects
2. Creating project-specific prefixes in your file paths
   ```javascript
   // Example of project-specific path
   const blobPath = `project-name/${type}s/${fileName}`;
   ```
3. Being mindful of security considerations since all projects will have access to the same storage
