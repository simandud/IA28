# CHRONOVAULT - Complete Integration Guide

## Overview

This guide provides step-by-step instructions for integrating all 14 API endpoints with your frontend components and features.

---

## Quick Start: API Route Structure

**Total Routes: 14**

### 1. Authentication (4 routes)
- ✅ POST `/api/auth/register` - User signup
- ✅ POST `/api/auth/login` - User login
- ✅ GET `/api/auth/me` - Get current user
- ✅ POST `/api/auth/me` - User logout

### 2. User Management (2 routes)
- ✅ GET `/api/user/[userId]` - Get profile / metrics
- ✅ PATCH `/api/user/[userId]` - Update profile

### 3. Videos (2 routes)
- ✅ POST `/api/video/upload` - Upload video
- ✅ GET `/api/video/upload` - List user videos

### 4. Avatar (1 route)
- ✅ POST `/api/avatar/[avatarId]/chat` - Chat with avatar

### 5. NFTs (5 routes)
- ✅ GET/POST `/api/nft` - List/Create NFTs
- ✅ GET/PATCH/DELETE `/api/nft/[nftId]` - Get/Update/Delete NFT
- ✅ POST/GET `/api/nft/[nftId]/purchase` - Purchase NFT / Sales history

### 6. Funds (7 routes)
- ✅ GET/POST `/api/fund` - List/Create funds
- ✅ GET/PATCH/DELETE `/api/fund/[fundId]` - Fund operations
- ✅ GET/POST `/api/fund/[fundId]/beneficiaries` - Manage beneficiaries
- ✅ PATCH/DELETE `/api/fund/[fundId]/beneficiaries/[id]` - Beneficiary CRUD
- ✅ GET/POST `/api/fund/[fundId]/earnings` - Earnings management

---

## Hook Integration Guide

### Authentication Flow

```typescript
import { useAuth } from '@/hooks'

export function LoginPage() {
  const { signIn, loading, error } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await signIn(email, password)
    if (!error) {
      // User is logged in, redirect to dashboard
      router.push('/dashboard')
    }
  }

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault()
        handleLogin(email, password)
      }}>
        {error && <p className="error">{error}</p>}
        {loading && <p>Logging in...</p>}
        {/* form fields */}
      </form>
    </div>
  )
}
```

### Video Management

```typescript
import { useVideo } from '@/hooks'
import { useAuth } from '@/hooks'

export function VideoRecorder() {
  const { uploadVideo, loading, error } = useVideo()
  const { user } = useAuth()

  const handleUpload = async (file: File) => {
    const { success, data } = await uploadVideo(file, {
      title: 'My Story',
      description: 'Recording about my life',
      category: 'advice',
      userId: user?.id, // Required!
    })

    if (success) {
      console.log('Video uploaded:', data)
    }
  }

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {loading && <p>Uploading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  )
}
```

### NFT Operations

```typescript
import { useNFT } from '@/hooks'

export function NFTMarketplace() {
  const {
    listNFTs,
    createNFT,
    purchaseNFT,
    getNFTSalesHistory,
    loading,
    error,
  } = useNFT()

  // List all NFTs
  const loadNFTs = async () => {
    const { success, data } = await listNFTs({
      limit: 20,
      offset: 0,
      category: 'wisdom',
    })
    setNFTs(data.data)
  }

  // Create NFT
  const handleCreateNFT = async () => {
    const { success, data } = await createNFT({
      userId: user.id,
      title: 'My Wisdom',
      description: 'Life lessons',
      videoClipUrl: 'https://...',
      imageUrl: 'https://...',
      category: 'wisdom',
      price: 50,
    })
  }

  // Purchase NFT
  const handlePurchase = async (nftId: string) => {
    const { success, data } = await purchaseNFT(
      nftId,
      buyerId,
      '0x...' // optional transaction hash
    )
  }

  // Get sales history
  const getSalesHistory = async (nftId: string) => {
    const { success, data } = await getNFTSalesHistory(nftId)
    console.log(data.data) // Array of sales
  }

  return (
    <div>
      {/* NFT listing UI */}
    </div>
  )
}
```

### Fund Management

```typescript
import { useFund } from '@/hooks'

export function AncestorFundDashboard() {
  const {
    createFund,
    getFund,
    updateFund,
    listBeneficiaries,
    addBeneficiary,
    updateBeneficiary,
    getFundEarnings,
    recordEarnings,
    loading,
    error,
  } = useFund()

  // Create fund
  const handleCreateFund = async () => {
    const { success, data } = await createFund({
      creatorId: user.id,
      name: 'Smith Family Legacy Fund',
      description: 'Generational wealth...',
      legalDocumentUrl: 'https://...',
    })
  }

  // Get fund with beneficiaries
  const loadFund = async (fundId: string) => {
    const { success, data } = await getFund(fundId)
    setFund(data)
    setFundBeneficiaries(data.beneficiaries)
  }

  // Add beneficiary
  const handleAddBeneficiary = async (fundId: string) => {
    const { success, data } = await addBeneficiary(fundId, {
      name: 'Jane Smith',
      relationship: 'daughter',
      allocationPercentage: 50,
      walletAddress: '0x...',
    })
  }

  // Record earnings
  const handleRecordEarnings = async (fundId: string) => {
    const { success, data } = await recordEarnings(fundId, {
      source: 'nft_sales', // or 'subscriptions', 'licensing', 'other'
      amount: 500,
      description: 'Monthly NFT royalties',
    })
  }

  // Get earnings
  const loadEarnings = async (fundId: string) => {
    const { success, data } = await getFundEarnings(fundId, {
      limit: 20,
    })
    setEarnings(data.data)
  }

  return (
    <div>
      {/* Fund UI */}
    </div>
  )
}
```

---

## Complete User Journey Flow

### 1. User Registration & Onboarding

```
Flow: Registration → Create Avatar → Record First Video → Set up Fund

1. useAuth.signUp()
   → POST /api/auth/register
   → Returns user + JWT token
   → Stored in localStorage

2. Navigate to dashboard
   → User profile is ready
   → Can start recording videos

3. Record legacy video
   → useVideo.uploadVideo()
   → POST /api/video/upload
   → Video stored in Supabase Storage
   → DB record created

4. Create avatar
   → Avatar automatically created from first video
   → Personality extracted with Claude
   → Ready for conversations

5. Create ancestor fund
   → useFund.createFund()
   → POST /api/fund
   → Add beneficiaries
   → Setup wealth distribution
```

### 2. Video Recording to NFT Creation

```
Flow: Video Upload → Avatar Chat → Create NFT → List on Marketplace

1. Upload video
   → useVideo.uploadVideo(file, metadata)
   → File sent as FormData
   → Stored in Supabase Storage
   → Public URL returned

2. Extract personality
   → Claude API analyzes video
   → Personality traits saved
   → Avatar bio created

3. Chat with avatar
   → useAvatar.sendMessage()
   → POST /api/avatar/[id]/chat
   → AI responds based on video context
   → Conversation saved

4. Create NFT
   → useNFT.createNFT()
   → POST /api/nft
   → Video clip + image + metadata
   → NFT record created

5. List on marketplace
   → GET /api/nft
   → NFT appears in marketplace
   → Buyers can purchase
   → Royalties auto-distributed
```

### 3. NFT Purchase with Royalties

```
Flow: User Purchases NFT → Royalties Auto-distributed to Fund

1. Browse marketplace
   → useNFT.listNFTs()
   → GET /api/nft?category=wisdom
   → Filter by category, creator

2. View NFT details
   → useNFT.getNFT(nftId)
   → GET /api/nft/[nftId]
   → Shows price, creator, sales history

3. Purchase NFT
   → useNFT.purchaseNFT(nftId, buyerId, txHash)
   → POST /api/nft/[nftId]/purchase
   → Creates nft_sales record
   → Updates sales count

4. Calculate royalty (if secondary sale)
   → Auto-calculated: 10% of sale price
   → Added to NFT royalty_earned
   → Can be recorded as fund earnings

5. Record earnings in fund
   → useFund.recordEarnings(fundId)
   → POST /api/fund/[fundId]/earnings
   → Amount added to total_value
   → Distributed to beneficiaries

6. View sales history
   → useNFT.getNFTSalesHistory(nftId)
   → GET /api/nft/[nftId]/purchase
   → Shows all buyers, amounts, dates
```

### 4. Fund Distribution Workflow

```
Flow: Fund Receives Earnings → Distributed to Beneficiaries → Monthly Payouts

1. Fund receives earnings (from NFT sales, subscriptions, etc.)
   → useFund.recordEarnings(fundId, {source, amount})
   → POST /api/fund/[fundId]/earnings
   → Fund total_value increased
   → monthly_earnings calculated

2. Beneficiaries receive allocation
   → Allocation percentage defined (e.g., 50% for daughter)
   → monthly_payout = total_earnings * (allocation_percentage / 100)
   → Updated in beneficiaries table

3. Check fund status
   → useFund.getFund(fundId)
   → GET /api/fund/[fundId]
   → Shows total_value, monthly_earnings
   → Lists all beneficiaries with payouts
   → Shows recent earnings entries

4. Manage beneficiaries
   → useFund.addBeneficiary() - Add new beneficiary
   → useFund.updateBeneficiary() - Change allocation
   → useFund.deleteBeneficiary() - Remove beneficiary
   → Validation: Total allocation can't exceed 100%

5. Monthly payout execution (automated)
   → Smart contract automatically sends payments
   → Wallet address used for transfers
   → is_verified flag determines eligibility
```

---

## Error Handling Strategy

### Consistent Error Pattern

All endpoints return errors in this format:

```typescript
// Error response
{
  "error": "Descriptive error message"
}

// Caught in hooks and returned as:
{
  success: false,
  error: "Descriptive error message"
}
```

### Common Error Codes

```
400 Bad Request
  - Missing required fields
  - Invalid email format
  - Invalid allocation percentage
  - File too large
  - Price must be positive

401 Unauthorized
  - No token provided
  - Invalid token
  - Token expired

403 Forbidden
  - Cannot purchase own NFT
  - Cannot delete other user's video

404 Not Found
  - User not found
  - NFT not found
  - Fund not found
  - Beneficiary not found

500 Internal Server Error
  - Database error
  - Upload error
  - AI generation error
```

### Error Handling in Components

```typescript
const { data, error } = await someFunction()

if (error) {
  // Show user-friendly error message
  if (error.includes('required fields')) {
    toast.error('Please fill all required fields')
  } else if (error.includes('Fund')) {
    toast.error('Fund operation failed. Please try again.')
  } else {
    toast.error(error)
  }
  return
}

// Process successful response
```

---

## Database Relationships

### Entity Relationships

```
users (1) ──→ (many) legacy_videos
users (1) ──→ (1) avatars
users (1) ──→ (many) avatar_conversations
users (1) ──→ (many) wisdom_nfts
users (1) ──→ (1) ancestor_funds

avatars (1) ──→ (many) avatar_conversations
wisdom_nfts (1) ──→ (many) nft_sales
ancestor_funds (1) ──→ (many) beneficiaries
ancestor_funds (1) ──→ (many) fund_earnings
```

### Cascade Operations

- Delete user → Delete all videos, avatars, conversations, NFTs, funds
- Delete NFT → Delete all sales records
- Delete fund → Delete all beneficiaries and earnings records

---

## Performance Optimization Tips

### 1. Pagination

Always use pagination for list endpoints:

```typescript
// Good
await listNFTs({ limit: 20, offset: 0 })

// Bad - don't fetch all at once
await listNFTs() // Could return thousands
```

### 2. Filtering

Use filters to reduce data transfer:

```typescript
// Good - only fetch user's NFTs
await listNFTs({ userId: user.id })

// Bad - fetch all then filter in frontend
const allNFTs = await listNFTs()
const userNFTs = allNFTs.filter(nft => nft.userId === user.id)
```

### 3. Caching

Cache user data to reduce API calls:

```typescript
const { user } = useAuth() // Cached in state
// Don't call /api/auth/me on every component mount

const [nfts, setNfts] = useState([])
// Fetch once, reuse throughout session
```

### 4. Batch Operations

When possible, batch related operations:

```typescript
// Instead of multiple calls:
for (let i = 0; i < beneficiaries.length; i++) {
  await updateBeneficiary(fundId, beneficiaries[i].id, data)
}

// Consider creating a batch update endpoint
```

---

## Authentication Token Management

### Token Storage

```typescript
// Automatically handled in /lib/api.ts
// Tokens stored in localStorage and set in request headers

// In any hook/component:
const token = localStorage.getItem('auth_token')
// Token automatically added to all requests via axios interceptor
```

### Token Refresh (when needed)

```typescript
// If token expires:
// 1. API will return 401
// 2. Clear token from localStorage
// 3. Redirect to login page
// 4. User logs in again to get new token

// This is handled automatically in the auth flow
```

---

## Testing API Routes

### Using cURL

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get current user (with token)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman/Insomnia

1. Create environment variables:
   - `BASE_URL`: http://localhost:3000
   - `TOKEN`: (paste JWT from login response)

2. Create requests:
   - POST {{BASE_URL}}/api/auth/login
   - GET {{BASE_URL}}/api/auth/me
     - Header: Authorization: Bearer {{TOKEN}}

3. Save responses to environment variables for chaining requests

---

## Deployment Checklist

Before deploying to production:

- [ ] All Supabase environment variables configured
- [ ] Database migrations run
- [ ] Storage buckets created (legacy-videos, nft-images)
- [ ] Row Level Security (RLS) policies enabled
- [ ] API rate limiting configured
- [ ] Error monitoring (Sentry) integrated
- [ ] CORS headers configured
- [ ] HTTPS enabled
- [ ] Environment variables not in code
- [ ] Database backups configured

---

## Next Steps

1. **Form Validation** - Add validation to all input forms
2. **Error Handling** - Implement comprehensive error boundaries
3. **External Services** - Connect Claude API, Polygon blockchain, etc.
4. **Testing** - Create integration and E2E tests
5. **Performance** - Optimize queries and add caching
6. **Security** - Implement rate limiting, input sanitization
7. **Monitoring** - Setup error tracking and analytics

