# Directory Starter Template

A minimal, working template for quickly spinning up professional directories for different niches.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000

## Features

✅ **Working Out of the Box** - No broken dependencies or missing files
✅ **Generic & Reusable** - Zero hardcoded references to any specific niche
✅ **Essential Components** - Just the parts that save time
✅ **Simple Configuration** - One config file to customize everything

## Project Structure

```
directory-starter-template/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── directory/         # Browse directory
│   │   ├── page.tsx       # Member listings
│   │   └── join/          # Join form
│   └── admin/             # Simple admin dashboard
├── components/
│   └── MemberCard.tsx     # Reusable member card
├── lib/
│   ├── config.ts          # Main configuration
│   └── utils.ts           # Utilities
├── types/
│   └── member.ts          # Generic member type
└── configs/               # Example configurations
    └── fire-safety.ts     # Fire safety example
```

## Customization for New Niche

### 1. Edit `lib/config.ts`

```typescript
export const config = {
  // Change these for your niche
  siteName: 'Your Directory Name',
  tagline: 'Your tagline here',

  memberSingular: 'professional',  // e.g., 'inspector', 'attorney', 'consultant'
  memberPlural: 'professionals',    // e.g., 'inspectors', 'attorneys', 'consultants'

  // Customize tier names and prices
  tiers: [
    { level: 0, name: 'Free', price: 0, color: 'gray' },
    { level: 1, name: 'Basic', price: 99, color: 'blue' },
    // ...
  ],
}
```

### 2. Update Mock Data

Edit the mock data in `app/directory/page.tsx` to match your niche.

### 3. Add Supabase (Optional)

1. Create tables: `members`, `claims`, `reviews`
2. Add environment variables
3. Replace mock data with Supabase queries

## What's Included

### Essential Components
- **MemberCard** - Reusable card component for member listings
- **Search & Filters** - Basic search with state and tier filters
- **Tier System** - 4-tier membership structure
- **Admin Dashboard** - Simple member management

### Pages
- **/** - Landing page
- **/directory** - Browse members
- **/directory/join** - Join form
- **/admin** - Admin dashboard

## What's NOT Included

This is intentionally minimal. Not included:
- Complex authentication
- Payment processing
- Email notifications
- Advanced admin features
- SEO optimization
- Analytics

Add these as needed for each project.

## Example Configurations

See `configs/` folder for examples:
- `fire-safety.ts` - Fire & Life Safety Directory

## Tips for Quick Setup

1. **Start with config** - Most customization happens in `lib/config.ts`
2. **Use mock data first** - Get the UI right before adding database
3. **Keep it simple** - This template is meant to save time, not be perfect
4. **Add features as needed** - Start minimal, add complexity only when required

## Common Customizations

### Add Custom Fields to Members

Edit `types/member.ts`:
```typescript
export interface Member {
  // ... existing fields

  // Add your custom fields
  licenseNumber?: string;
  insuranceExpiry?: string;
  serviceArea?: string[];
}
```

### Change Color Scheme

Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: '#your-color',
    dark: '#your-dark-color',
    light: '#your-light-color',
  },
}
```

### Add New Badge Types

Edit your config:
```typescript
badges: [
  { id: 'verified', label: 'Verified', color: 'green' },
  { id: 'premium', label: 'Premium', color: 'gold' },
  // Add more...
]
```

## Database Schema (When Ready)

```sql
-- Basic schema for Supabase
CREATE TABLE members (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email TEXT,
  tier_level INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE claims (
  id UUID PRIMARY KEY,
  member_id UUID REFERENCES members(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Deployment

1. Push to GitHub
2. Deploy to Vercel
3. Add environment variables
4. Done!

## License

Use freely for internal projects. This is a tool, not a product.