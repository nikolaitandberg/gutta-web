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

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Authentication**: NextAuth.js v4
- **Database**: PostgreSQL with Prisma ORM
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use Prisma dev server)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values (most are pre-configured)

3. **Set up the database**:
   ```bash
   # Start Prisma dev server (easiest for development)
   npx prisma dev
   
   # Then in another terminal, push the schema
   npx prisma db push
   
   # Generate Prisma client
   npx prisma generate
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Visit the application**:
   Open [http://localhost:3000](http://localhost:3000)

## Authentication Setup

### Google OAuth (Optional)

To enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add `http://localhost:3000/api/auth/callback/google` to redirect URIs
4. Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`

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

## Development

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate client after schema changes
npx prisma generate
```

## Security Features

- Password hashing with bcrypt
- JWT-based sessions with NextAuth.js
- CSRF protection
- Role-based access control
- Secure environment variable handling

## Next Steps

The authentication system is now fully set up. Future development can focus on:

1. **Expense Management**: Implement expense tracking and splitting
2. **Task Management**: Build task assignment features  
3. **User Management**: Admin panel for managing flatmates
4. **Notifications**: Email/SMS notifications
5. **File Uploads**: Receipt management
6. **Reporting**: Financial and task reports
