# CHRONOVAULT - Your Legacy Lives Forever

A cutting-edge platform for creating immortal digital legacies through AI-powered avatars, wisdom NFTs, and generational wealth creation.

## 🎯 Features

- **Video Recording**: Record your wisdom, stories, and memories
- **AI Avatar**: Create a conversational avatar that learns from your videos
- **Wisdom NFTs**: Monetize your insights through blockchain NFTs
- **Ancestor Fund**: Create generational wealth for your heirs
- **Marketplace**: Buy and sell wisdom from creators worldwide
- **Family Management**: Invite family members and control access

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for backend)
- Claude API key (for avatar conversations)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd chronovault

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your credentials to .env.local
# NEXT_PUBLIC_SUPABASE_URL=your-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
# ANTHROPIC_API_KEY=your-claude-key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # User dashboard
│   ├── legacy/         # Legacy management
│   ├── marketplace/    # NFT marketplace
│   └── fund/           # Ancestor fund
├── components/         # React components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
├── store/             # Zustand stores
├── types/             # TypeScript types
└── utils/             # Helper functions
```

## 🔐 Database Schema

### Users Table
- id (UUID)
- email (string)
- full_name (string)
- avatar_url (string)
- bio (text)
- created_at (timestamp)

### Legacy Videos Table
- id (UUID)
- user_id (UUID)
- title (string)
- video_url (string)
- category (enum)
- transcription (text)
- created_at (timestamp)

### Avatars Table
- id (UUID)
- user_id (UUID)
- name (string)
- voice_id (string)
- personality_data (jsonb)
- created_at (timestamp)

### Wisdom NFTs Table
- id (UUID)
- user_id (UUID)
- title (string)
- video_clip_url (string)
- price (decimal)
- blockchain_address (string)
- created_at (timestamp)

### Ancestor Funds Table
- id (UUID)
- creator_id (UUID)
- total_value (decimal)
- status (enum)
- created_at (timestamp)

## 🔌 API Routes

### Video
- `POST /api/video/upload` - Upload a new legacy video
- `GET /api/user/:id/videos` - Get user's videos
- `DELETE /api/video/:id` - Delete a video

### Avatar
- `POST /api/avatar` - Create avatar
- `POST /api/avatar/:id/chat` - Send message to avatar

### NFT
- `POST /api/nft/create` - Create wisdom NFT
- `GET /api/nft/marketplace` - List NFTs
- `POST /api/nft/:id/purchase` - Purchase NFT

### Fund
- `POST /api/fund/create` - Create ancestor fund
- `POST /api/fund/:id/beneficiary` - Add beneficiary
- `GET /api/fund/:id/earnings` - Get fund earnings

## 🛠️ Technology Stack

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)

**Backend:**
- Node.js/Express
- Supabase (database & auth)
- Claude API (LLM)
- Polygon (blockchain)

**Integrations:**
- ElevenLabs (voice cloning)
- D-ID (avatar synthesis)
- Stripe (payments)
- Vercel (hosting)

## 📝 Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
ELEVENLABS_API_KEY=
DEID_API_KEY=
SENDGRID_API_KEY=
```

## 🧪 Testing

```bash
npm run test
```

## 📊 Metrics & Analytics

Track key metrics:
- User growth and retention
- Video uploads and views
- Avatar conversations
- NFT sales and royalties
- Fund earnings and distributions

## 🤝 Contributing

Contributions welcome! Please follow our coding standards:
- TypeScript for type safety
- Component-driven architecture
- Atomic design principles
- ESLint + Prettier for formatting

## 📄 License

MIT License - see LICENSE file for details

## 🎯 Roadmap

**Q1 2024:**
- [ ] Production launch
- [ ] Multi-language support
- [ ] Advanced avatar animations
- [ ] Premium NFT features

**Q2 2024:**
- [ ] Neuralink integration
- [ ] VR avatar experience
- [ ] Corporate licensing
- [ ] Educational partnerships

**Q3 2024:**
- [ ] Governance DAO
- [ ] Secondary marketplace
- [ ] Ancestor fund automation
- [ ] Cross-chain NFT support

**Q4 2024:**
- [ ] $1B annual revenue target
- [ ] 100M+ users
- [ ] Global expansion to 50+ countries
- [ ] Unicorn valuation milestone

## 📞 Support

- Website: https://chronovault.app
- Email: hello@chronovault.app
- Twitter: @chronovault
- Discord: discord.gg/chronovault

## 🙏 Acknowledgments

Built with inspiration from:
- Meaningful human connection
- The permanence of wisdom
- Generational wealth creation
- The immortality of great ideas
