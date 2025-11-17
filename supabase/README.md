# Supabase Setup

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Save your project URL and anon key

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Database Migration

#### Option A: Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the content of `migrations/001_initial_schema.sql`
4. Paste and run the SQL

#### Option B: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Setup Storage Buckets

In Supabase Dashboard:

1. Go to Storage
2. Create these buckets:
   - `site-thumbnails` (public)
   - `user-uploads` (private)

3. Set bucket policies:

```sql
-- Policy for site-thumbnails (public read)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'site-thumbnails' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-thumbnails'
  AND auth.role() = 'authenticated'
);

-- Policy for user-uploads (private)
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-uploads'
  AND auth.uid() = owner
);

CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-uploads'
  AND auth.uid() = owner
);
```

### 5. Configure Authentication

In Supabase Dashboard → Authentication:

1. **Email Auth**:
   - Enable Email/Password authentication
   - Configure email templates (optional)

2. **OAuth Providers** (optional):
   - Google OAuth
   - GitHub OAuth

3. **Email Settings**:
   - Configure SMTP (or use Supabase defaults)
   - Customize confirmation and reset password emails

### 6. Verify Setup

Run this SQL query to check if everything is set up:

```sql
-- Check tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Check RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';

-- Check functions
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public';
```

## 📊 Database Schema Overview

### Tables

- **profiles**: User profiles with credits and tier info
- **sites**: Generated sites with code and metadata
- **generations**: Analytics for AI generations
- **credit_transactions**: Credit usage history
- **subscriptions**: Stripe subscription data

### Functions

- `handle_new_user()`: Auto-create profile on signup
- `deduct_credit(user_id, amount)`: Deduct credits safely
- `add_credits(user_id, amount)`: Add credits

### RLS Policies

All tables have Row Level Security enabled:
- Users can only access their own data
- Published sites are publicly viewable
- Service role can access all data

## 🔧 Troubleshooting

### Issue: RLS blocking queries

If you get "permission denied" errors:

```sql
-- Temporarily disable RLS for testing (DO NOT DO IN PRODUCTION)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable after testing
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### Issue: Function not working

Check function execution:

```sql
-- Test deduct_credit function
SELECT public.deduct_credit('user-uuid-here', 1);

-- View function definition
\df public.deduct_credit
```

### Issue: Trigger not firing

Check triggers:

```sql
-- List all triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
