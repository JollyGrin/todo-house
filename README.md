# Todo House PWA

A Progressive Web App for tracking household chores and shopping lists with a point-based reward system.

## Features

- 🔔 **Push Notifications**: Real-time notifications with custom icons
- 📱 **PWA**: Installable on mobile devices with offline support
- 🏆 **Point System**: Earn points for completing chores
- 📝 **Shared Lists**: Collaborative shopping lists and chore tracking

## Quick Start

### Development

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd todo-house
   cd apps/web && npm install
   ```

2. **Generate VAPID keys for notifications:**
   ```bash
   cd apps/web
   npx web-push generate-vapid-keys
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Add your VAPID keys to .env.local
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

### Testing Notifications

1. Allow notification permissions when prompted
2. Click "Enable Notifications" to subscribe
3. Click "Send Test Notification" to test the system
4. Check that notifications appear with the custom Todo House icon

## Deployment on Railway

### Automatic Deployment

1. **Connect your GitHub repo** to Railway
2. **Set environment variables** in Railway dashboard:
   ```
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
   VAPID_PRIVATE_KEY=your_private_key  
   VAPID_EMAIL=mailto:your@email.com
   ```
3. **Deploy** - Railway will automatically build and deploy

### Manual Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy
railway up
```

## Project Structure

```
todo-house/
├── apps/web/                    # Next.js PWA app
│   ├── src/
│   │   ├── app/                # App router pages
│   │   ├── hooks/              # Custom React hooks
│   │   └── lib/                # Utilities
│   ├── public/
│   │   ├── manifest.json       # PWA manifest
│   │   ├── sw.js              # Service worker
│   │   └── icons/             # App icons
│   └── package.json
├── railway.json                # Railway deployment config
└── README.md
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | VAPID public key for push notifications | Yes |
| `VAPID_PRIVATE_KEY` | VAPID private key (server-side only) | Yes |
| `VAPID_EMAIL` | Contact email for VAPID | Yes |

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **PWA**: next-pwa, Service Workers
- **Notifications**: Web Push API with VAPID
- **Deployment**: Railway
- **Database**: PostgreSQL (coming soon)

## Next Steps

- [ ] Add PostgreSQL database
- [ ] Implement user authentication  
- [ ] Build chore management system
- [ ] Add shopping list functionality
- [ ] Implement point tracking