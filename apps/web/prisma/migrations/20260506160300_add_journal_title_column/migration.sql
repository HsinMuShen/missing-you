-- Add missing optional title field used by public memories pages
ALTER TABLE "Journal" ADD COLUMN IF NOT EXISTS "title" TEXT;
