# CHRONOVAULT Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            CHRONOVAULT Platform                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                    Frontend (Next.js 14)                      │     │
│  │  ┌──────────┬──────────┬──────────┬──────────┬──────────┐     │     │
│  │  │ Homepage │ Auth     │Dashboard │ Legacy   │ Marketplace │  │     │
│  │  │ Pricing  │ Login    │ Stats    │ Record   │ NFTs     │  │     │
│  │  │ Features │ Register │ Videos   │ Avatar   │ Browse   │  │     │
│  │  └──────────┴──────────┴──────────┴──────────┴──────────┘     │     │
│  │                                                                │     │
│  │  ┌──────────────────────────────────────────────────────┐     │     │
│  │  │              Component Library                      │     │     │
│  │  │ Button, Input, Card, VideoRecorder, AvatarChat    │     │     │
│  │  │ NFTMarketplace, AncestorFundDashboard             │     │     │
│  │  └──────────────────────────────────────────────────────┘     │     │
│  │                                                                │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                    API Routes & Middleware                    │     │
│  │                                                                │     │
│  │  /api/video/upload      → Supabase Storage + DB              │     │
│  │  /api/avatar/chat       → Claude API + Conversation Store    │     │
│  │  /api/nft/create        → Create + Polygon Network           │     │
│  │  /api/fund/create       → Smart Contracts + DB               │     │
│  │  /api/user/*            → Supabase Auth + User Data          │     │
│  │                                                                │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                      State Management                          │     │
│  │                                                                │     │
│  │  Zustand Store (User State) ↔ Supabase Realtime             │     │
│  │  React Hooks (Local State)  ↔ API Client (Axios)            │     │
│  │                                                                │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                         Backend Services Layer                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────┐           │
│  │             Supabase (Database + Auth)                  │           │
│  │  ┌──────────┬──────────┬──────────┬──────────┐          │           │
│  │  │PostgreSQL│ Storage  │ Realtime │ Vectors  │          │           │
│  │  │ Tables   │ (S3)     │ Subs     │ (pgvector)│         │           │
│  │  └──────────┴──────────┴──────────┴──────────┘          │           │
│  │  • RLS for security                                    │           │
│  │  • JWT auth tokens                                    │           │
│  │  • Auto-backups + replicas                            │           │
│  └──────────────────────────────────────────────────────────┘           │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────┐           │
│  │           External AI & Services APIs                   │           │
│  │  ┌──────────┬──────────┬──────────┬──────────┐          │           │
│  │  │ Claude   │ElevenLabs│ D-ID     │ Stripe   │          │           │
│  │  │ Avatars  │Voices    │ Synthesis│Payments  │          │           │
│  │  └──────────┴──────────┴──────────┴──────────┘          │           │
│  └──────────────────────────────────────────────────────────┘           │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────┐           │
│  │            Blockchain Infrastructure                    │           │
│  │  ┌──────────┬──────────┬──────────┐                     │           │
│  │  │ Polygon  │ Smart    │ Wallet   │                     │           │
│  │  │ RPC      │Contracts │Integration│                    │           │
│  │  └──────────┴──────────┴──────────┘                     │           │
│  │  • ERC-721/1155 NFTs                                   │           │
│  │  • DAO governance                                      │           │
│  │  • Royalty contracts                                   │           │
│  └──────────────────────────────────────────────────────────┘           │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Registration
```
User Form
   ↓
/api/auth/register
   ↓
Supabase Auth.signUp()
   ↓
Create User Profile in DB
   ↓
Send Welcome Email (Sendgrid)
   ↓
JWT Token → Local Storage
   ↓
Redirect to Dashboard
```

### 2. Video Recording & Avatar Creation
```
User Records Video
   ↓
VideoRecorder Component (Browser)
   ↓
/api/video/upload
   ↓
Upload to Supabase Storage
   ↓
Whisper API: Transcribe
   ↓
Claude API: Extract Personality
   ↓
Store in Database
   ↓
Create Avatar Record
   ↓
✅ Avatar Ready for Conversations
```

### 3. Avatar Conversation
```
User Message
   ↓
/api/avatar/[id]/chat
   ↓
Retrieve Avatar Data + Personality
   ↓
Fetch Relevant Video Context
   ↓
Build System Prompt (Claude)
   ↓
Claude API: Generate Response
   ↓
Store Conversation in DB
   ↓
Return Response to User
```

### 4. Wisdom NFT Creation & Sales
```
User Creates NFT
   ↓
/api/nft/create
   ↓
Upload Image to Storage
   ↓
Create Metadata JSON
   ↓
Mint on Polygon (Smart Contract)
   ↓
Store Blockchain Address in DB
   ↓
List on Marketplace
   ↓
User Purchases NFT
   ↓
Transfer via Smart Contract
   ↓
Creator Receives Royalties (automated)
```

### 5. Ancestor Fund Creation
```
User Initiates Fund
   ↓
/api/fund/create
   ↓
Define Beneficiaries
   ↓
Deploy Smart Contract (Fund DAO)
   ↓
Setup Distribution Logic
   ↓
Add to Will/Legal Docs
   ↓
While Living: Creator Controls
   ↓
After Death: Beneficiaries Vote (DAO)
   ↓
Automated Monthly Distributions
```

## Technology Stack

### Frontend
```
Next.js 14
├── React 18 (Components)
├── TypeScript (Type Safety)
├── Tailwind CSS (Styling)
├── Zustand (State)
├── React Hook Form (Forms)
├── Axios (HTTP Client)
└── next/image (Optimization)
```

### Backend
```
Supabase
├── PostgreSQL (Database)
├── PostgREST (Auto API)
├── Realtime (Subscriptions)
├── Storage (File Upload)
└── pgvector (ML Embeddings)
```

### AI/ML
```
Claude API
├── text-generation (Responses)
├── embeddings (Context)
└── Vision (Future)

ElevenLabs
└── Voice Cloning & TTS

D-ID / Synthesia
└── Avatar Video Synthesis
```

### Blockchain
```
Polygon Network
├── Smart Contracts (Solidity)
├── ERC-721 (NFTs)
├── ERC-1155 (Royalties)
└── DAO Governance (Aragon)
```

### DevOps
```
Vercel
├── Hosting
├── CI/CD
├── Analytics
└── Edge Functions

Sentry
└── Error Tracking

LogRocket
└── Session Replay
```

## Component Architecture

### Pages (UI Entry Points)
```
/                       → Home (marketing)
/auth/login            → Authentication
/auth/signup           → Registration
/dashboard             → User hub
/legacy                → Video management
/legacy/record         → Recording interface
/legacy/avatar         → Avatar chat
/marketplace           → NFT browsing
/fund                  → Fund management
```

### Components (Reusable UI)
```
Components/
├── Layout
│   ├── Navbar
│   └── Footer
├── Forms
│   ├── Input
│   └── FormField
├── Display
│   ├── Button
│   ├── Card
│   └── Badge
├── Features
│   ├── VideoRecorder
│   ├── AvatarChat
│   ├── NFTMarketplace
│   └── AncestorFundDashboard
└── Common
    └── Loading, Error, Modal
```

### Hooks (Logic Reuse)
```
Hooks/
├── useAuth()         → Authentication state
├── useUser()         → User profile
├── useVideo()        → Video upload
├── useAvatar()       → Avatar operations
├── useNFT()          → NFT operations
└── useTheme()        → Theme management
```

### API Layer
```
lib/api.ts
├── avatarAPI
├── videoAPI
├── nftAPI
├── fundAPI
└── userAPI
```

## Database Schema

### Core Tables
```
users
├── id, email, full_name
├── avatar_url, bio
└── timestamps

legacy_videos
├── id, user_id
├── title, description
├── video_url, transcription
├── category
└── timestamps

avatars
├── id, user_id (1:1)
├── personality_data (JSONB)
├── voice_id
└── conversation_count

avatar_conversations
├── id, avatar_id, user_id
├── conversation_data (JSONB)
└── timestamps
```

### NFT & Marketplace
```
wisdom_nfts
├── id, user_id
├── title, description
├── blockchain_address, token_id
├── price, total_sales
└── royalty_earned

nft_sales
├── id, nft_id
├── buyer_id, seller_id
├── amount, transaction_hash
└── is_secondary (for royalties)
```

### Funds & Beneficiaries
```
ancestor_funds
├── id, creator_id (1:1)
├── name, status
├── total_value, monthly_earnings
└── legal_document_url

beneficiaries
├── id, fund_id
├── name, relationship
├── allocation_percentage
├── monthly_payout
└── wallet_address
```

## Security Architecture

### Authentication
```
User Input (Email/Password)
   ↓
Supabase Auth API
   ↓
Verify Credentials
   ↓
Issue JWT Token (valid 1 hour)
   ↓
Store in HttpOnly Cookie
   ↓
Send to All Requests (auto)
```

### Authorization
```
JWT Token
   ↓
Verify Signature
   ↓
Check User ID Matches
   ↓
RLS Policies (DB level)
   ↓
Only User Can See Own Data
```

### Data Privacy
```
User Videos
├── End-to-End Encrypted (at rest)
├── HTTPS/TLS in transit
├── Accessible only to user + family
└── Delete on request (GDPR)

Personality Data
├── Stored as JSONB
├── Never shared publicly
├── Only used for avatar
└── Anonymized for analytics
```

## Scaling Strategy

### Phase 1: 10k Users (Current)
- Single Vercel deployment
- Single Supabase instance
- Claude API calls on-demand
- No caching layer

### Phase 2: 100k Users
- Multi-region Vercel
- Supabase read replicas
- Redis caching (Upstash)
- Batch processing for videos
- CDN for videos (Cloudflare)

### Phase 3: 1M+ Users
- Kubernetes orchestration
- Microservices:
  - Avatar service
  - Video processing
  - NFT service
  - Fund service
- Message queue (Bull/RabbitMQ)
- Distributed caching (Redis cluster)
- Multi-region database

## Monitoring & Observability

### Metrics Collected
```
Performance
├── API latency (p50, p95, p99)
├── DB query times
├── Frontend Core Web Vitals
└── Error rates

Business
├── User signups
├── Video uploads
├── Conversation count
├── NFT sales
└── Fund distributions

Infrastructure
├── CPU/Memory usage
├── Database connections
├── Storage usage
└── API quota consumption
```

### Logging
```
Level: Debug → Info → Warning → Error → Critical

Tools:
├── Vercel Logs (frontend errors)
├── Supabase Logs (database)
├── Sentry (error tracking)
└── LogRocket (user sessions)
```

## Deployment Pipeline

```
Git Push to Main
   ↓
GitHub Actions (Tests)
   ↓
ESLint + TypeCheck
   ↓
Build Next.js
   ↓
Run Tests (coming soon)
   ↓
Push to Vercel
   ↓
Deploy to Edge
   ↓
Run E2E Tests (staging)
   ↓
Promote to Production
   ↓
Health Checks
   ↓
✅ Live
```

## Performance Optimizations

### Frontend
- Code splitting (automatic)
- Image optimization (Next.js)
- CSS-in-JS minification
- Bundle analysis
- Service Workers (PWA)

### Backend
- Database indexes
- Query optimization
- Connection pooling
- Caching headers (Redis)
- Compression (gzip)

### Network
- CDN (Vercel Edge)
- Image optimization (Cloudflare)
- Video streaming (HLS)
- Lazy loading

## Future Architecture

```
Phase 4: AI Infrastructure
├── Fine-tuned models per user
├── Distributed inference (NVIDIA)
├── Real-time video processing
└── Multimodal responses (text + video)

Phase 5: Decentralized
├── User data ownership (blockchain)
├── DAO governance
├── P2P video streaming
└── Smart contract automation
```

This architecture is designed to scale from MVP (thousands) to unicorn status (billions) without major rewrites. Each layer is modular and independently scalable.
