-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Legacy Videos table
CREATE TABLE IF NOT EXISTS legacy_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  category VARCHAR(50) CHECK (category IN ('advice', 'story', 'memory', 'lesson')),
  transcription TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Avatars table
CREATE TABLE IF NOT EXISTS avatars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  voice_id VARCHAR(255),
  bio TEXT,
  personality_data JSONB,
  total_conversations INTEGER DEFAULT 0,
  avatar_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Avatar Conversations table
CREATE TABLE IF NOT EXISTS avatar_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  avatar_id UUID NOT NULL REFERENCES avatars(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_data JSONB,
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wisdom NFTs table
CREATE TABLE IF NOT EXISTS wisdom_nfts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_clip_url TEXT NOT NULL,
  image_url TEXT,
  category VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  blockchain_address VARCHAR(255),
  token_id VARCHAR(255),
  total_sales INTEGER DEFAULT 0,
  royalty_earned DECIMAL(15, 2) DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NFT Sales table
CREATE TABLE IF NOT EXISTS nft_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nft_id UUID NOT NULL REFERENCES wisdom_nfts(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  transaction_hash VARCHAR(255),
  is_secondary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ancestor Funds table
CREATE TABLE IF NOT EXISTS ancestor_funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  total_value DECIMAL(15, 2) DEFAULT 0,
  monthly_earnings DECIMAL(15, 2) DEFAULT 0,
  status VARCHAR(50) CHECK (status IN ('active', 'pending', 'dormant')) DEFAULT 'pending',
  legal_document_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(creator_id)
);

-- Beneficiaries table
CREATE TABLE IF NOT EXISTS beneficiaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID NOT NULL REFERENCES ancestor_funds(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  relationship VARCHAR(100),
  allocation_percentage DECIMAL(5, 2) NOT NULL,
  monthly_payout DECIMAL(15, 2) DEFAULT 0,
  wallet_address VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_percentage CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100)
);

-- Fund Earnings table
CREATE TABLE IF NOT EXISTS fund_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID NOT NULL REFERENCES ancestor_funds(id) ON DELETE CASCADE,
  source VARCHAR(50) CHECK (source IN ('nft_sales', 'subscriptions', 'licensing', 'other')),
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Family Members table
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relationship VARCHAR(100),
  access_level VARCHAR(50) CHECK (access_level IN ('view_only', 'converse', 'manage')) DEFAULT 'view_only',
  invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP,
  CONSTRAINT no_self_family CHECK (user_id != member_id),
  UNIQUE(user_id, member_id)
);

-- User Subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(50) CHECK (plan IN ('free', 'pro', 'premium')) DEFAULT 'free',
  status VARCHAR(50) CHECK (status IN ('active', 'cancelled', 'past_due')) DEFAULT 'active',
  stripe_subscription_id VARCHAR(255),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Create indexes for performance
CREATE INDEX idx_legacy_videos_user_id ON legacy_videos(user_id);
CREATE INDEX idx_legacy_videos_category ON legacy_videos(category);
CREATE INDEX idx_avatars_user_id ON avatars(user_id);
CREATE INDEX idx_avatar_conversations_avatar_id ON avatar_conversations(avatar_id);
CREATE INDEX idx_wisdom_nfts_user_id ON wisdom_nfts(user_id);
CREATE INDEX idx_wisdom_nfts_category ON wisdom_nfts(category);
CREATE INDEX idx_nft_sales_nft_id ON nft_sales(nft_id);
CREATE INDEX idx_ancestor_funds_creator_id ON ancestor_funds(creator_id);
CREATE INDEX idx_beneficiaries_fund_id ON beneficiaries(fund_id);
CREATE INDEX idx_fund_earnings_fund_id ON fund_earnings(fund_id);
CREATE INDEX idx_family_members_user_id ON family_members(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legacy_videos_updated_at BEFORE UPDATE ON legacy_videos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_avatars_updated_at BEFORE UPDATE ON avatars
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wisdom_nfts_updated_at BEFORE UPDATE ON wisdom_nfts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ancestor_funds_updated_at BEFORE UPDATE ON ancestor_funds
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
