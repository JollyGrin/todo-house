# Todo House PWA - Implementation Plan

## Project Overview
A PWA web application for tracking daily household chores and shopping lists with a point-based reward system. The app will be deployed as a monorepo with Next.js frontend and PostgreSQL database on Railway.

## Technology Stack (Validated)

### Frontend
- **Next.js 14+** with App Router
- **PWA with next-pwa** package for offline capabilities
- **Tailwind CSS** for mobile-first responsive design
- **TanStack Query** for state management and caching
- **Axios** for API requests

### Backend
- **Next.js API Routes** for backend logic
- **PostgreSQL** database hosted on Railway
- **Prisma ORM** for database operations
- **VAPID** for push notifications

### Deployment
- **Railway** for hosting both frontend and database
- **PWA** installable on mobile devices

## Database Schema Design

### Core Tables

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url VARCHAR(500),
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chores table
CREATE TABLE chores (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  points INTEGER NOT NULL DEFAULT 10,
  deadline_time TIME, -- specific time of day (e.g., "18:00")
  is_required BOOLEAN DEFAULT false, -- required daily vs optional
  is_repeatable BOOLEAN DEFAULT false, -- can be done multiple times
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Daily chore instances (resets daily)
CREATE TABLE chore_completions (
  id SERIAL PRIMARY KEY,
  chore_id INTEGER REFERENCES chores(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT NOW(),
  points_earned INTEGER NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  UNIQUE(chore_id, user_id, date) -- one completion per user per chore per day (unless repeatable)
);

-- Shopping list items
CREATE TABLE shopping_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  added_by INTEGER REFERENCES users(id),
  completed_by INTEGER REFERENCES users(id),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Previously used shopping items for quick add
CREATE TABLE shopping_history (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  usage_count INTEGER DEFAULT 1,
  last_used TIMESTAMP DEFAULT NOW()
);

-- User point history for detailed tracking
CREATE TABLE point_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  chore_id INTEGER REFERENCES chores(id) ON DELETE SET NULL,
  points INTEGER NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Push notification subscriptions
CREATE TABLE notification_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);
```

## Monorepo Structure

```
todo-house/
├── package.json                 # Root package.json with workspaces
├── pnpm-workspace.yaml         # pnpm workspace config
├── README.md
├── PLAN.md
├── IMPLEMENTATION_PLAN.md
├── railway.json                # Railway deployment config
│
├── apps/
│   └── web/                    # Next.js PWA frontend
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       ├── public/
│       │   ├── manifest.json
│       │   ├── sw.js
│       │   └── icons/
│       ├── src/
│       │   ├── app/            # App router pages
│       │   ├── components/     # React components
│       │   ├── lib/           # Utilities, db, auth
│       │   ├── hooks/         # Custom hooks (TanStack Query)
│       │   └── types/         # TypeScript types
│       └── worker/            # Service worker for notifications
│
├── packages/                   # Shared packages (if needed)
│   └── ui/                    # Shared UI components
│
└── docs/                      # Documentation
    └── api.md                 # API documentation
```

## API Endpoints Plan

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Chores
- `GET /api/chores` - Get all chores with today's completion status
- `POST /api/chores` - Create new chore
- `PUT /api/chores/[id]` - Update chore
- `DELETE /api/chores/[id]` - Delete chore
- `POST /api/chores/[id]/complete` - Mark chore as completed

### Shopping List
- `GET /api/shopping` - Get current shopping list
- `POST /api/shopping` - Add item to shopping list
- `PUT /api/shopping/[id]` - Update shopping item (toggle completion)
- `DELETE /api/shopping/[id]` - Remove shopping item
- `GET /api/shopping/history` - Get frequently used items

### Points & Stats
- `GET /api/users/[id]/points` - Get user's point history
- `GET /api/users/[id]/stats` - Get user's weekly/all-time stats
- `GET /api/leaderboard` - Get household leaderboard

### Notifications
- `POST /api/notifications/subscribe` - Subscribe to push notifications
- `POST /api/notifications/unsubscribe` - Unsubscribe from notifications
- `POST /api/notifications/send` - Send notification (internal)

## PWA Notification Implementation

### Features
- **Custom Icons**: Use app-specific icons instead of browser default
- **Real-time Notifications**: Deadline reminders, chore completions, shopping list updates
- **Offline Support**: Service worker caches for offline functionality

### Implementation Components
1. **Service Worker** (`public/sw.js`)
   - Handle push events
   - Show notifications with custom icons
   - Cache API responses for offline use

2. **VAPID Setup**
   - Generate public/private key pair
   - Store in environment variables
   - Use for secure push messaging

3. **Notification Types**
   - Chore deadline approaching (15 min before)
   - Chore deadline passed
   - New shopping item added
   - Chore completed by another user

## Real-time Features Implementation

### Approach: Polling + Push Notifications
- **Short Polling** (30-60 seconds) for real-time updates when app is active
- **Push Notifications** for updates when app is in background
- **TanStack Query** automatic refetching on focus/reconnect

### Real-time Updates For:
- Shopping list item additions/completions
- Chore completions by other users
- Point total updates
- New chore additions

## Development Phases

### Phase 1: Core Setup
1. Initialize Next.js project with PWA config
2. Set up PostgreSQL database on Railway
3. Implement basic authentication
4. Create core database schema

### Phase 2: Chore Management
1. CRUD operations for chores
2. Daily reset functionality
3. Point calculation system
4. Basic mobile UI

### Phase 3: Shopping List
1. Shared shopping list functionality
2. Quick-add from history
3. Real-time updates via polling

### Phase 4: PWA & Notifications
1. PWA manifest and service worker
2. Push notification setup with VAPID
3. Notification scheduling for deadlines
4. Offline functionality

### Phase 5: Advanced Features
1. Point tracking and statistics
2. User leaderboards
3. Advanced notification types
4. Performance optimizations

## Key Implementation Notes

### Mobile-First Design
- Touch-friendly interface
- Large tap targets
- Swipe gestures for actions
- Bottom navigation

### Performance Considerations
- TanStack Query infinite queries for pagination
- Image optimization for icons/avatars
- Service worker caching strategy
- Database indexing on frequently queried fields

### Security
- Input validation on all endpoints
- CSRF protection
- Rate limiting on API routes
- Secure VAPID key storage

This implementation plan provides a comprehensive roadmap for building the Todo House PWA with all specified requirements while following modern web development best practices.