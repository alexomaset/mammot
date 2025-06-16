# Production Deployment Guide

## Required Environment Variables

### Authentication
```
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_long_random_jwt_secret_key
```

### Database (Vercel Postgres)
```
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...
```

### File Storage (Vercel Blob)
```
BLOB_READ_WRITE_TOKEN=vercel_blob_token
```

### Optional Settings
```
NODE_ENV=production
USE_FILE_STORAGE=false  # Set to true if no database available
```

## Deployment Options

### Option 1: Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Option 2: Netlify
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Uses the netlify.toml configuration

## Database Setup for Production

### If using Vercel Postgres:
1. Create a Vercel Postgres database
2. Copy connection strings to environment variables
3. Database tables will be created automatically

### If using file storage (fallback):
1. Set `USE_FILE_STORAGE=true`
2. Data will be persisted to JSON files
3. Suitable for small portfolios

## Security Checklist

- [ ] Set strong `ADMIN_PASSWORD` (min 12 characters)
- [ ] Generate secure `JWT_SECRET` (64+ character random string)
- [ ] Never commit `.env` files
- [ ] Use environment-specific configurations
- [ ] Enable HTTPS in production
- [ ] Review and update dependencies regularly

## Build and Start Commands

```bash
# Build for production
npm run build

# Start production server
npm run start

# Development server
npm run dev
```

## Testing Production Build Locally

```bash
npm run build
npm run start
```

Visit http://localhost:3000 to test the production build locally.
