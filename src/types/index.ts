// User & Auth Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

// Legacy Types
export interface LegacyVideo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration: number;
  category: 'advice' | 'story' | 'memory' | 'lesson';
  transcription?: string;
  created_at: string;
}

export interface Avatar {
  id: string;
  user_id: string;
  name: string;
  voice_id: string;
  bio?: string;
  personality_data?: Record<string, any>;
  total_conversations: number;
  created_at: string;
  updated_at: string;
}

export interface AvatarConversation {
  id: string;
  avatar_id: string;
  messages: ConversationMessage[];
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// NFT Types
export interface WisdomNFT {
  id: string;
  user_id: string;
  title: string;
  description: string;
  video_clip_url: string;
  image_url: string;
  category: string;
  price: number;
  blockchain_address?: string;
  token_id?: string;
  total_sales: number;
  royalty_earned: number;
  created_at: string;
}

export interface NFTSale {
  id: string;
  nft_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  transaction_hash?: string;
  is_secondary: boolean;
  created_at: string;
}

// Ancestor Fund Types
export interface AncestorFund {
  id: string;
  creator_id: string;
  name: string;
  description?: string;
  total_value: number;
  monthly_earnings: number;
  status: 'active' | 'pending' | 'dormant';
  created_at: string;
  updated_at: string;
}

export interface Beneficiary {
  id: string;
  fund_id: string;
  user_id: string;
  name: string;
  relationship: string;
  allocation_percentage: number;
  monthly_payout: number;
  wallet_address?: string;
  created_at: string;
}

export interface FundEarning {
  id: string;
  fund_id: string;
  source: 'nft_sales' | 'subscriptions' | 'licensing' | 'other';
  amount: number;
  description: string;
  created_at: string;
}

// Family Types
export interface FamilyMember {
  id: string;
  user_id: string;
  member_id: string;
  relationship: string;
  access_level: 'view_only' | 'converse' | 'manage';
  invited_at: string;
  accepted_at?: string;
}

// Subscription Types
export interface UserSubscription {
  id: string;
  user_id: string;
  plan: 'free' | 'pro' | 'premium';
  status: 'active' | 'cancelled' | 'past_due';
  stripe_subscription_id?: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  features: string[];
  video_limit: number;
  avatar_conversations_monthly: number;
}

// Analytics Types
export interface UserMetrics {
  user_id: string;
  videos_recorded: number;
  avatar_conversations: number;
  nft_created: number;
  nft_sold: number;
  total_earnings: number;
  last_activity: string;
}
