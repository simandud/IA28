# CHRONOVAULT - Complete API Routes Documentation

## Overview

All 14 API routes fully implemented with complete CRUD operations, validation, and error handling.

---

## 1. Authentication Routes

### POST /api/auth/register
**Register a new user**

```
Request:
{
  "email": "user@example.com",
  "password": "securepassword123",
  "fullName": "John Doe"
}

Response (201):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": null,
    "bio": null
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600
  }
}

Errors:
- 400: Missing required fields
- 400: Email already exists
- 500: Database error
```

### POST /api/auth/login
**Authenticate user**

```
Request:
{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response (200):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": null,
    "bio": null
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600
  }
}

Errors:
- 400: Missing required fields
- 401: Invalid credentials
- 500: Authentication error
```

### GET /api/auth/me
**Get current authenticated user**

```
Request:
Headers: {
  "Authorization": "Bearer jwt_token"
}

Response (200):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://...",
    "bio": "My bio",
    "created_at": "2024-01-15T10:00:00Z"
  }
}

Errors:
- 401: No token provided
- 401: Invalid token
- 404: User not found
- 500: Server error
```

### POST /api/auth/me
**Logout user (clears auth token)**

```
Request:
Headers: {
  "Authorization": "Bearer jwt_token"
}

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. User Routes

### GET /api/user/[userId]
**Get user profile**

```
Response (200):
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://...",
  "bio": "My bio",
  "is_verified": false,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}

Errors:
- 404: User not found
- 500: Database error
```

### PATCH /api/user/[userId]
**Update user profile**

```
Request:
{
  "full_name": "Jane Doe",
  "avatar_url": "https://new-avatar.jpg",
  "bio": "Updated bio"
}

Response (200):
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "Jane Doe",
  "avatar_url": "https://new-avatar.jpg",
  "bio": "Updated bio",
  "is_verified": false,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T11:00:00Z"
}

Errors:
- 400: Invalid email (if changed)
- 404: User not found
- 500: Database error
```

### GET /api/user/[userId]?metrics=true
**Get user metrics and statistics**

```
Response (200):
{
  "userId": "uuid",
  "videoCount": 5,
  "nftCount": 3,
  "nftSalesCount": 12,
  "totalEarnings": 5000.00,
  "stats": {
    "total_conversations": 45,
    "portfolio_value": 15000.00,
    "monthly_income": 1200.00
  }
}

Errors:
- 404: User not found
- 500: Database error
```

---

## 3. Video Routes

### POST /api/video/upload
**Upload and store a legacy video**

```
Request:
FormData:
- file: (binary video file, required)
- title: "My Life Story" (required)
- description: "A video about my experiences"
- category: "advice|story|memory|lesson" (required)
- userId: "uuid" (required)

Response (201):
{
  "id": "uuid",
  "title": "My Life Story",
  "description": "A video about my experiences",
  "category": "advice",
  "video_url": "https://storage.supabase.co/...",
  "user_id": "uuid",
  "created_at": "2024-01-15T10:00:00Z"
}

Errors:
- 400: Missing required fields
- 400: Invalid file type (must be video)
- 400: File too large
- 500: Upload error
- 500: Database error
```

### GET /api/video/upload?userId=uuid
**Retrieve all videos for a user**

```
Query Parameters:
- userId: "uuid" (required)
- limit: 20 (default)
- offset: 0 (default)

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "title": "My Life Story",
      "description": "A video about my experiences",
      "category": "advice",
      "video_url": "https://storage.supabase.co/...",
      "duration": 300,
      "views_count": 15,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 5,
  "limit": 20,
  "offset": 0
}

Errors:
- 400: Missing userId
- 500: Database error
```

---

## 4. Avatar Routes

### POST /api/avatar/[avatarId]/chat
**Chat with AI avatar**

```
Request:
{
  "userId": "uuid",
  "message": "What was your best life lesson?"
}

Response (200):
{
  "id": "uuid",
  "role": "assistant",
  "content": "One of my greatest lessons was learning to appreciate the small moments...",
  "timestamp": "2024-01-15T10:00:00Z",
  "conversationId": "uuid"
}

Errors:
- 400: Missing required fields
- 404: Avatar not found
- 500: Chat generation error
- 500: Database error
```

---

## 5. NFT Routes

### GET /api/nft
**List all NFTs (with filters)**

```
Query Parameters:
- userId: "uuid" (optional - filter by creator)
- category: "wisdom" (optional - filter by category)
- limit: 20 (default)
- offset: 0 (default)

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "title": "Wisdom About Life",
      "description": "Lessons learned over 50 years",
      "videoClipUrl": "https://storage.supabase.co/...",
      "imageUrl": "https://storage.supabase.co/...",
      "category": "wisdom",
      "price": 50.00,
      "userId": "uuid",
      "blockchainAddress": "0x...",
      "tokenId": "123",
      "totalSales": 5,
      "royaltyEarned": 25.00,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 25,
  "limit": 20,
  "offset": 0
}

Errors:
- 500: Database error
```

### POST /api/nft
**Create a new NFT**

```
Request:
{
  "userId": "uuid",
  "title": "Wisdom About Life",
  "description": "Lessons learned over 50 years",
  "videoClipUrl": "https://storage.supabase.co/...",
  "imageUrl": "https://storage.supabase.co/...",
  "category": "wisdom",
  "price": 50.00
}

Response (201):
{
  "id": "uuid",
  "title": "Wisdom About Life",
  "description": "Lessons learned over 50 years",
  "videoClipUrl": "https://storage.supabase.co/...",
  "imageUrl": "https://storage.supabase.co/...",
  "category": "wisdom",
  "price": 50.00,
  "userId": "uuid",
  "createdAt": "2024-01-15T10:00:00Z"
}

Errors:
- 400: Missing required fields
- 400: Invalid price
- 500: Database error
```

### GET /api/nft/[nftId]
**Get specific NFT details**

```
Response (200):
{
  "id": "uuid",
  "title": "Wisdom About Life",
  "description": "Lessons learned over 50 years",
  "videoClipUrl": "https://storage.supabase.co/...",
  "imageUrl": "https://storage.supabase.co/...",
  "category": "wisdom",
  "price": 50.00,
  "userId": "uuid",
  "blockchainAddress": "0x...",
  "tokenId": "123",
  "totalSales": 5,
  "royaltyEarned": 25.00,
  "isPublished": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}

Errors:
- 404: NFT not found
- 500: Database error
```

### PATCH /api/nft/[nftId]
**Update NFT details**

```
Request:
{
  "title": "Updated Title",
  "price": 75.00,
  "isPublished": true
}

Response (200):
{
  "id": "uuid",
  "title": "Updated Title",
  "price": 75.00,
  "isPublished": true,
  ...
}

Errors:
- 400: Invalid price
- 404: NFT not found
- 500: Database error
```

### DELETE /api/nft/[nftId]
**Delete NFT**

```
Response (200):
{
  "success": true
}

Errors:
- 404: NFT not found
- 500: Database error
```

### POST /api/nft/[nftId]/purchase
**Purchase an NFT**

```
Request:
{
  "buyerId": "uuid",
  "transactionHash": "0x..." (optional)
}

Response (201):
{
  "id": "uuid",
  "nftId": "uuid",
  "buyerId": "uuid",
  "sellerId": "uuid",
  "amount": 50.00,
  "transactionHash": "0x...",
  "isSecondary": false,
  "createdAt": "2024-01-15T10:00:00Z"
}

Errors:
- 400: Missing buyerId
- 400: Cannot purchase own NFT
- 404: NFT not found
- 500: Database error
```

### GET /api/nft/[nftId]/purchase
**Get NFT sales history**

```
Query Parameters:
- limit: 10 (default)
- offset: 0 (default)

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "nftId": "uuid",
      "buyerId": "uuid",
      "sellerId": "uuid",
      "amount": 50.00,
      "transactionHash": "0x...",
      "isSecondary": false,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 5,
  "limit": 10,
  "offset": 0
}

Errors:
- 404: NFT not found
- 500: Database error
```

---

## 6. Fund Routes

### GET /api/fund
**List all funds (with filters)**

```
Query Parameters:
- creatorId: "uuid" (optional)
- status: "active|pending|dormant" (optional)
- limit: 20 (default)
- offset: 0 (default)

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "creatorId": "uuid",
      "name": "Smith Family Legacy Fund",
      "description": "Building generational wealth...",
      "totalValue": 50000.00,
      "monthlyEarnings": 1200.00,
      "status": "active",
      "legalDocumentUrl": "https://...",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 3,
  "limit": 20,
  "offset": 0
}

Errors:
- 500: Database error
```

### POST /api/fund
**Create a new fund**

```
Request:
{
  "creatorId": "uuid",
  "name": "Smith Family Legacy Fund",
  "description": "Building generational wealth...",
  "legalDocumentUrl": "https://..." (optional)
}

Response (201):
{
  "id": "uuid",
  "creatorId": "uuid",
  "name": "Smith Family Legacy Fund",
  "description": "Building generational wealth...",
  "totalValue": 0.00,
  "monthlyEarnings": 0.00,
  "status": "pending",
  "legalDocumentUrl": null,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}

Errors:
- 400: Missing required fields
- 400: User already has a fund
- 500: Database error
```

### GET /api/fund/[fundId]
**Get fund details with beneficiaries and earnings**

```
Response (200):
{
  "id": "uuid",
  "creatorId": "uuid",
  "name": "Smith Family Legacy Fund",
  "description": "Building generational wealth...",
  "totalValue": 50000.00,
  "monthlyEarnings": 1200.00,
  "status": "active",
  "legalDocumentUrl": "https://...",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "beneficiaries": [
    {
      "id": "uuid",
      "name": "Jane Smith",
      "relationship": "daughter",
      "allocationPercentage": 50.00,
      "monthlyPayout": 600.00,
      "walletAddress": "0x...",
      "isVerified": true
    }
  ],
  "recentEarnings": [
    {
      "id": "uuid",
      "source": "nft_sales",
      "amount": 500.00,
      "description": "NFT sales revenue",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}

Errors:
- 404: Fund not found
- 500: Database error
```

### PATCH /api/fund/[fundId]
**Update fund details**

```
Request:
{
  "name": "Updated Fund Name",
  "status": "active",
  "totalValue": 60000.00,
  "monthlyEarnings": 1500.00
}

Response (200):
{
  "id": "uuid",
  "creatorId": "uuid",
  "name": "Updated Fund Name",
  "status": "active",
  "totalValue": 60000.00,
  "monthlyEarnings": 1500.00,
  ...
}

Errors:
- 400: Invalid status
- 400: Invalid financial values
- 404: Fund not found
- 500: Database error
```

### DELETE /api/fund/[fundId]
**Delete fund**

```
Response (200):
{
  "success": true
}

Errors:
- 404: Fund not found
- 500: Database error
```

---

## 7. Beneficiary Routes

### GET /api/fund/[fundId]/beneficiaries
**List all beneficiaries for a fund**

```
Response (200):
{
  "data": [
    {
      "id": "uuid",
      "fundId": "uuid",
      "userId": null,
      "name": "Jane Smith",
      "relationship": "daughter",
      "allocationPercentage": 50.00,
      "monthlyPayout": 600.00,
      "walletAddress": "0x...",
      "isVerified": true
    },
    {
      "id": "uuid",
      "fundId": "uuid",
      "userId": null,
      "name": "John Smith",
      "relationship": "son",
      "allocationPercentage": 50.00,
      "monthlyPayout": 600.00,
      "walletAddress": "0x...",
      "isVerified": false
    }
  ],
  "total": 2
}

Errors:
- 404: Fund not found
- 500: Database error
```

### POST /api/fund/[fundId]/beneficiaries
**Add a beneficiary to fund**

```
Request:
{
  "name": "Jane Smith",
  "relationship": "daughter",
  "allocationPercentage": 50.00,
  "walletAddress": "0x..." (optional)
}

Response (201):
{
  "id": "uuid",
  "fundId": "uuid",
  "userId": null,
  "name": "Jane Smith",
  "relationship": "daughter",
  "allocationPercentage": 50.00,
  "monthlyPayout": 600.00,
  "walletAddress": "0x...",
  "isVerified": false
}

Errors:
- 400: Missing required fields
- 400: Invalid allocation percentage
- 400: Total allocation would exceed 100%
- 404: Fund not found
- 500: Database error
```

### PATCH /api/fund/[fundId]/beneficiaries/[beneficiaryId]
**Update beneficiary**

```
Request:
{
  "allocationPercentage": 60.00,
  "walletAddress": "0x...",
  "isVerified": true
}

Response (200):
{
  "id": "uuid",
  "fundId": "uuid",
  "name": "Jane Smith",
  "relationship": "daughter",
  "allocationPercentage": 60.00,
  "monthlyPayout": 720.00,
  ...
}

Errors:
- 400: Invalid allocation percentage
- 400: Total allocation would exceed 100%
- 404: Beneficiary not found
- 500: Database error
```

### DELETE /api/fund/[fundId]/beneficiaries/[beneficiaryId]
**Remove beneficiary**

```
Response (200):
{
  "success": true
}

Errors:
- 404: Beneficiary not found
- 500: Database error
```

---

## 8. Fund Earnings Routes

### GET /api/fund/[fundId]/earnings
**Get fund earnings history**

```
Query Parameters:
- source: "nft_sales|subscriptions|licensing|other" (optional)
- limit: 20 (default)
- offset: 0 (default)

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "source": "nft_sales",
      "amount": 500.00,
      "description": "NFT sales revenue",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 12,
  "totalEarnings": 6000.00,
  "limit": 20,
  "offset": 0
}

Errors:
- 404: Fund not found
- 500: Database error
```

### POST /api/fund/[fundId]/earnings
**Record new earnings for fund**

```
Request:
{
  "source": "nft_sales",
  "amount": 500.00,
  "description": "NFT sales revenue" (optional)
}

Response (201):
{
  "id": "uuid",
  "source": "nft_sales",
  "amount": 500.00,
  "description": "NFT sales revenue",
  "createdAt": "2024-01-15T10:00:00Z",
  "fundUpdated": {
    "totalValue": 50500.00,
    "monthlyEarnings": 1500.00
  }
}

Errors:
- 400: Missing required fields
- 400: Invalid source
- 400: Invalid amount
- 404: Fund not found
- 500: Database error
```

---

## Error Handling Standards

All endpoints follow consistent error handling:

```
400 Bad Request - Invalid input or validation error
401 Unauthorized - Missing or invalid authentication
403 Forbidden - Insufficient permissions
404 Not Found - Resource doesn't exist
500 Internal Server Error - Server-side error

Error Response Format:
{
  "error": "Descriptive error message"
}
```

---

## Authentication

All protected endpoints require:
```
Authorization: Bearer {jwt_token}
```

The JWT token is obtained from:
- `/api/auth/register` - Returns token after signup
- `/api/auth/login` - Returns token after login

Store token in:
- localStorage (browser)
- HttpOnly cookie (server)

---

## Summary

**Total Routes: 14**
- Authentication: 4 endpoints
- User Management: 2 endpoints
- Videos: 2 endpoints
- Avatars: 1 endpoint
- NFTs: 5 endpoints
- Funds: 7 endpoints

**Operations:**
- ✅ Create (POST)
- ✅ Read (GET)
- ✅ Update (PATCH)
- ✅ Delete (DELETE)
- ✅ Complex Operations (Purchase, Earnings)

**Features:**
- ✅ Full validation
- ✅ Error handling
- ✅ Pagination support
- ✅ Filtering
- ✅ State management
- ✅ Related data aggregation
