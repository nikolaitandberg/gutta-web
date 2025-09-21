# Gutta Web - Flatshare Management Application

A Next.js application for managing your flatshare with NextAuth.js authentication and Prisma database integration.

## Features

- 🔐 **Authentication System**
  - Email/password authentication
  - Google OAuth integration
  - Role-based access (Admin, Resident, Former Resident)
  - Secure session management

- 🏠 **Flatshare Management** (Coming Soon)
  - Shared expense tracking  
  - Task assignment and management
  - Flatmate coordination
  - Payment tracking

- 🐳 **Docker Support**
  - Development and production Docker configurations
  - PostgreSQL database container
  - Database admin interface (Adminer)
  - Health check endpoints

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Authentication**: NextAuth.js v4
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Docker & Docker Compose
- **TypeScript**: Full type safety

## Getting Started (Docker - Recommended)

### Prerequisites

- Docker and Docker Compose
- Git

### Quick Start

1. **Clone and start the application**:
   ```bash
   git clone <your-repo-url>
   cd gutta-web
   npm run docker:dev
   ```

2. **Set up the database**:
   ```bash
   # In another terminal, run database setup
   docker-compose exec app npm run setup:db
   ```

3. **Visit the application**:
   - **App**: [http://localhost:3000](http://localhost:3000)
   - **Database Admin**: [http://localhost:8080](http://localhost:8080)

That's it! 🎉

### Manual Setup (Alternative)

If you prefer running without Docker:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

3. **Start PostgreSQL** and **set up the database**:
   ```bash
   npm run setup:db
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## Docker Commands

### Development
```bash
# Start development environment
npm run docker:dev

# Stop all containers
npm run docker:down

# Clean up containers and volumes
npm run docker:clean

# Database operations (inside container)
docker-compose exec app npm run prisma:studio
docker-compose exec app npm run setup:db
```

### Production
```bash
# Build and start production environment
npm run docker:prod

# Using environment file
cp .env.prod.example .env.prod
# Edit .env.prod with production values
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## Environment Configuration

### Development (.env.docker.example)
- Pre-configured for Docker development
- Uses Docker PostgreSQL service
- Includes database admin interface

### Production (.env.prod.example)  
- Template for production deployment
- Secure database credentials
- Production domain configuration

## Authentication Setup

### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
4. Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your environment files

### First User Setup

- The first user to register will automatically become an **Admin**
- Subsequent users will be **Residents** by default

## Database Schema

### Authentication Models (NextAuth.js)
- `User` - User accounts with flatshare-specific fields
- `Account` - OAuth account linking  
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

### Flatshare Models
- `Expense` - Shared expenses with categories
- `ExpenseSplit` - Individual expense splits per user
- `Task` - House tasks and assignments

### User Roles
- `ADMIN` - Full access to all features
- `RESIDENT` - Standard flatmate access
- `FORMER_RESIDENT` - Limited access for past residents

## Usage

### Registration
1. Visit `/auth/register`
2. Fill in your details (name, email, password, optional phone/room)
3. First user becomes admin automatically

### Sign In
1. Visit `/auth/signin` or the home page
2. Use email/password or Google OAuth
3. Access the dashboard after authentication

## Development Workflow

### Database Management

```bash
# With Docker (recommended)
docker-compose exec app npm run prisma:studio    # Open Prisma Studio
docker-compose exec app npm run setup:db         # Setup database
docker-compose exec app npm run prisma:migrate   # Run migrations

# Without Docker
npm run prisma:studio     # Open Prisma Studio  
npm run setup:db         # Setup database
npm run prisma:migrate   # Run migrations
```

### Container Access

```bash
# Access app container shell
docker-compose exec app sh

# View logs
docker-compose logs app
docker-compose logs db

# Monitor containers
docker-compose ps
```

### Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| Hot Reload | ✅ Volume mounts | ❌ Optimized build |
| Database Admin | ✅ Adminer on :8080 | ❌ Security focused |
| Build Target | `dev` (faster) | `runner` (optimized) |
| Volumes | Source code mounted | Standalone build |
| Health Checks | Basic | Full monitoring |

## Security Features

- Password hashing with bcrypt
- JWT-based sessions with NextAuth.js
- CSRF protection
- Role-based access control
- Secure environment variable handling

## Deployment

### Production Deployment

1. **Prepare production environment**:
   ```bash
   cp .env.prod.example .env.prod
   # Edit .env.prod with production values
   ```

2. **Deploy with Docker Compose**:
   ```bash
   docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
   ```

3. **Initialize database**:
   ```bash
   docker-compose -f docker-compose.prod.yml exec app npm run setup:db
   ```

4. **Monitor health**:
   - Health check: `https://yourdomain.com/api/health`
   - View logs: `docker-compose -f docker-compose.prod.yml logs`

### Container Orchestration

The Docker setup is ready for:
- **Kubernetes**: Use the Dockerfile with K8s manifests
- **Docker Swarm**: Deploy with stack files
- **Cloud Services**: AWS ECS, Google Cloud Run, Azure Container Instances

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App  │◄──►│   PostgreSQL    │    │     Adminer     │
│   (Port 3000)  │    │   (Port 5432)   │    │   (Port 8080)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                        ┌─────────────────┐
                        │  Docker Network │
                        │ (gutta-network) │
                        └─────────────────┘
```

## Next Steps

The authentication system is now fully set up with Docker support. Future development can focus on:

1. **Expense Management**: Implement expense tracking and splitting
2. **Task Management**: Build task assignment features  
3. **User Management**: Admin panel for managing flatmates
4. **Notifications**: Email/SMS notifications
5. **File Uploads**: Receipt management
6. **Reporting**: Financial and task reports
7. **CI/CD Pipeline**: Automated testing and deployment
