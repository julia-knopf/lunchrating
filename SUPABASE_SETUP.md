# Supabase Database Setup

## Create the Ratings Table

To save lunch ratings to your Supabase database, you need to create a table called `ratings`.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://app.supabase.com/project/qlihavwlcawdkbezflsg
2. Click on **"Table Editor"** in the left sidebar
3. Click **"New table"**
4. Use these settings:
   - **Name**: `ratings`
   - **Description**: Stores lunch ratings from users
   - **Enable Row Level Security (RLS)**: ✅ Yes (but we'll disable it for now)

5. Add the following columns:

| Column Name | Type | Default Value | Extra Settings |
|------------|------|---------------|----------------|
| `id` | uuid | `gen_random_uuid()` | Primary Key, Unique, Not Nullable |
| `created_at` | timestamptz | `now()` | Not Nullable |
| `day` | text | - | Not Nullable |
| `date` | text | - | Not Nullable |
| `vegan` | int2 | 0 | Not Nullable |
| `vegetarian` | int2 | 0 | Not Nullable |
| `meat_fish` | int2 | 0 | Not Nullable |
| `salad` | int2 | 0 | Not Nullable |
| `dessert` | int2 | 0 | Not Nullable |
| `comment` | text | '' | Nullable |

6. Click **"Save"**

### Option 2: Using SQL Editor

1. Go to **"SQL Editor"** in your Supabase dashboard
2. Click **"New query"**
3. Paste this SQL code:

```sql
-- Create the ratings table
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  day TEXT NOT NULL,
  date TEXT NOT NULL,
  vegan SMALLINT DEFAULT 0 NOT NULL,
  vegetarian SMALLINT DEFAULT 0 NOT NULL,
  meat_fish SMALLINT DEFAULT 0 NOT NULL,
  salad SMALLINT DEFAULT 0 NOT NULL,
  dessert SMALLINT DEFAULT 0 NOT NULL,
  comment TEXT DEFAULT ''
);

-- Create an index for faster queries
CREATE INDEX idx_ratings_created_at ON ratings(created_at DESC);

-- Disable RLS for now (allows anyone to read/write)
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations
CREATE POLICY "Allow all operations for everyone"
ON ratings
FOR ALL
USING (true)
WITH CHECK (true);
```

4. Click **"Run"**

### Verify Setup

After creating the table, verify it works:

1. Go to **"Table Editor"** → **"ratings"**
2. You should see the empty table with all columns
3. Your app should now be able to save and load ratings!

## Security Note

⚠️ **Important**: The current setup allows anyone to read and write ratings. For a production app, you should:

1. Enable proper Row Level Security (RLS) policies
2. Add user authentication
3. Restrict who can create/read ratings

For now, this setup is fine for testing and internal use.

## Testing

1. Open your website
2. Submit a rating
3. Refresh the page
4. The rating should still be there! ✅

## Troubleshooting

If ratings aren't saving:

1. Check the browser console for errors (F12 → Console tab)
2. Verify the table name is exactly `ratings` (lowercase)
3. Check that all column names match the schema above
4. Make sure Row Level Security policies allow inserts and selects

