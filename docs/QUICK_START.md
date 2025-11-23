# CHRONOVAULT Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+
- npm or yarn
- Git
- A code editor (VS Code recommended)

## Local Development (5 minutes)

### 1. Clone & Install

```bash
git clone <repo-url>
cd chronovault
npm install
```

### 2. Setup Environment

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your values (for dev, you can use dummy values)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

## Project Structure (Quick Overview)

```
chronovault/
├── src/
│   ├── app/              # Pages & routes
│   │   ├── page.tsx      # Homepage
│   │   ├── auth/         # Login/signup
│   │   ├── dashboard/    # User dashboard
│   │   ├── legacy/       # Video recording & avatar
│   │   ├── marketplace/  # NFT marketplace
│   │   ├── fund/         # Ancestor fund
│   │   └── api/          # API routes
│   ├── components/       # React components
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities (Supabase, API client)
│   ├── types/           # TypeScript types
│   └── utils/           # Helpers
├── public/              # Static files
├── supabase/            # DB migrations
├── docs/                # Documentation
└── package.json         # Dependencies
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/components/VideoRecorder.tsx` | Record legacy videos |
| `src/components/AvatarChat.tsx` | Chat with AI avatar |
| `src/components/NFTMarketplace.tsx` | Browse/buy wisdom NFTs |
| `src/components/AncestorFundDashboard.tsx` | Manage generational wealth |
| `src/lib/api.ts` | API client functions |
| `src/hooks/useAuth.ts` | Authentication hook |

## First Features to Explore

### 1. Homepage
Go to [http://localhost:3000](http://localhost:3000)
- See the hero section
- Understand the pitch
- View pricing

### 2. Authentication
- Click "Get Started" → Sign up
- Create test account
- See mock data in dashboard

### 3. Record Video (Mock)
- Go to Dashboard → Record New Video
- Component loads but needs Supabase setup
- Video recording works without backend

### 4. Avatar Chat (Mock)
- Go to Dashboard → Talk to Avatar
- Send test messages
- See mock responses

### 5. NFT Marketplace (Mock)
- Go to Marketplace
- Browse wisdom NFTs with sample data
- See filtering by category

## Making Your First Change

### Example: Change Homepage Title

```bash
# 1. Open the file
open src/app/page.tsx

# 2. Find the h1 tag
<h1 className="text-5xl lg:text-6xl font-garamond font-bold text-vault-900">

# 3. Change the text
Your Legacy<br />
<span className="gradient-text">Lives Forever</span>

# 4. Save and see hot reload! ✨
```

## Common Tasks

### Add a New Page

```bash
# Create directory
mkdir -p src/app/new-page

# Create page component
cat > src/app/new-page/page.tsx << 'EOF'
export default function NewPage() {
  return (
    <div className="min-h-screen">
      <h1>New Page</h1>
    </div>
  )
}
EOF

# Access at /new-page
```

### Add a New Component

```bash
cat > src/components/MyComponent.tsx << 'EOF'
import React from 'react'

interface MyComponentProps {
  title: string
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return <div>{title}</div>
}
EOF
```

### Use a Component

```tsx
import { MyComponent } from '@/components/MyComponent'

export default function Page() {
  return <MyComponent title="Hello" />
}
```

## Styling Guide

### Colors (from tailwind.config.ts)

```tsx
// Primary vault (dark blue)
className="text-vault-900 bg-vault-500"

// Gold (accent)
className="text-gold-500 bg-gold-100"

// Legacy (purple)
className="text-legacy-500 bg-legacy-100"
```

### Common Patterns

```tsx
// Full width button
<Button variant="primary" fullWidth>Click me</Button>

// Card with hover effect
<Card hoverable>
  <h2>Title</h2>
  <p>Content</p>
</Card>

// Input with label
<Input
  label="Your Name"
  placeholder="Enter name"
  error={error}
/>
```

## Running Tests

```bash
# Lint code
npm run lint

# Type check
npm run type-check

# (Tests coming soon)
npm run test
```

## Debugging

### Browser DevTools
- Press F12 to open
- Check Console for errors
- Use React DevTools extension

### VS Code Debugging
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Connecting to Real Services (Optional)

### Connect to Supabase

1. Create Supabase project at https://supabase.com
2. Get your URL and Anon Key
3. Update `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```
4. Run migrations:
   ```bash
   supabase link --project-id YOUR_ID
   supabase db push
   ```

### Connect Claude API

1. Get API key from https://console.anthropic.com
2. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

## Next Steps

- [ ] Read [CLAUDE_INTEGRATION.md](./CLAUDE_INTEGRATION.md) for AI features
- [ ] Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- [ ] Review architecture in main [README.md](../README.md)
- [ ] Start building features!

## Useful Commands

```bash
# Format code
npm run format

# Check types
npm run type-check

# Build for production
npm run build

# Start production build locally
npm run build && npm start

# Clean node_modules (if issues)
rm -rf node_modules && npm install
```

## Troubleshooting

### Issue: Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Issue: Changes not reflecting
```bash
# Clear Next.js cache
rm -rf .next

# Restart server
npm run dev
```

### Issue: Module not found
```bash
# Check import path matches file location
# Remember: paths use @ alias from tsconfig.json
import { Button } from '@/components/Button'  # ✅
import { Button } from '../components/Button'  # ❌
```

## Resources

- 📚 [Next.js Docs](https://nextjs.org/docs)
- 🎨 [Tailwind CSS](https://tailwindcss.com/docs)
- 🔐 [Supabase Docs](https://supabase.com/docs)
- 🤖 [Claude API](https://docs.anthropic.com)
- 💬 [Discord Community](#) (coming soon)

## Need Help?

1. Check existing issues on GitHub
2. Read documentation files in `/docs`
3. Check console for error messages
4. Ask in Discord community

Happy coding! 🚀
