-- ============================================
-- Lost & Found Platform - Database Schema
-- Version: 1.0 (AI-Ready)
-- PostgreSQL 17+ with pgvector extension
-- ============================================

-- Enable pgvector extension for AI similarity search (V2)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- TABLE: users
-- Purpose: Store user accounts (no passwords for demo)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: items
-- Purpose: Store lost and found items
-- AI-Ready: Includes embedding, moderation, and prediction columns
-- ============================================
CREATE TABLE items (
    -- Primary Fields
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('LOST', 'FOUND', 'REUNITED')),
    location VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    image_url VARCHAR(500),
    contact_info VARCHAR(255),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_flagged BOOLEAN DEFAULT FALSE,

    -- AI-Ready Columns (NULL in V1, populated in V2)
    ai_category_prediction VARCHAR(50),              -- Auto-predicted category
    ai_moderation_score FLOAT,                       -- Content safety score (0-1)
    embedding VECTOR(384),                            -- Semantic embedding for similarity search

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: item_matches
-- Purpose: Store similarity matches between lost and found items (V2)
-- ============================================
CREATE TABLE item_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lost_item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    found_item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    similarity_score FLOAT NOT NULL,                  -- Cosine similarity (0-1)
    notified BOOLEAN DEFAULT FALSE,                   -- Has user been notified?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Prevent duplicate matches
    UNIQUE(lost_item_id, found_item_id)
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- Items: Reporter lookup (dashboard queries)
CREATE INDEX idx_items_reporter ON items(reporter_id);

-- Items: Status filtering (lost vs found pages)
CREATE INDEX idx_items_status ON items(status);

-- Items: Category filtering
CREATE INDEX idx_items_category ON items(category);

-- Items: Sorting by date (newest/oldest)
CREATE INDEX idx_items_created ON items(created_at DESC);

-- Items: Flagged items (admin dashboard)
CREATE INDEX idx_items_flagged ON items(is_flagged) WHERE is_flagged = TRUE;

-- ItemMatches: Find matches for a lost item
CREATE INDEX idx_matches_lost_item ON item_matches(lost_item_id);

-- ItemMatches: Find matches for a found item
CREATE INDEX idx_matches_found_item ON item_matches(found_item_id);

-- ============================================
-- TRIGGERS: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS for Documentation
-- ============================================
COMMENT ON TABLE users IS 'User accounts (no passwords for demo mode)';
COMMENT ON TABLE items IS 'Lost and found items with AI-ready columns';
COMMENT ON TABLE item_matches IS 'Similarity matches between lost/found items (V2 feature)';

COMMENT ON COLUMN items.embedding IS 'Sentence embedding vector for semantic search (populated in V2)';
COMMENT ON COLUMN items.ai_category_prediction IS 'ML-predicted category (populated in V2)';
COMMENT ON COLUMN items.ai_moderation_score IS 'Content moderation score 0-1 (populated in V2)';
