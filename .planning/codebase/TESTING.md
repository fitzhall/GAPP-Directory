# Testing Patterns

**Analysis Date:** 2026-03-07

## Test Framework

**Runner:**
- No test framework installed
- No test configuration files detected (no `jest.config.*`, `vitest.config.*`, `playwright.config.*`)
- No test files exist anywhere in the codebase
- `package.json` has no test script defined

**Assertion Library:**
- None installed

**Run Commands:**
```bash
npm run lint              # Only available quality check (next lint)
npm run build             # Build-time type checking serves as implicit test
```

## Test File Organization

**Location:**
- No test files exist. No convention established.

**Naming:**
- No convention established.

## Current State: Zero Test Coverage

This codebase has **no automated tests of any kind**:
- No unit tests
- No integration tests
- No end-to-end tests
- No API route tests
- No component tests

The only quality checks are:
1. TypeScript strict mode (`tsconfig.json` has `"strict": true`)
2. ESLint via `next lint` (Next.js defaults only)
3. Next.js build-time checks

## Recommended Test Setup

Based on the codebase patterns (Next.js 14 App Router, TypeScript, Supabase), the recommended setup would be:

**Unit/Integration Testing:**
- **Vitest** - native ESM support, fast, works well with Next.js
- Config file: `vitest.config.ts`
- Install: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`

**E2E Testing:**
- **Playwright** - best for Next.js App Router
- Config file: `playwright.config.ts`
- Install: `npm install -D @playwright/test`

## Recommended Test Structure

Based on existing code patterns, tests should follow this structure:

```
project-root/
├── __tests__/                    # Or co-located with source
│   ├── lib/
│   │   ├── supabase.test.ts      # Data access layer tests
│   │   ├── config.test.ts        # Config helper tests
│   │   └── utils.test.ts         # Utility function tests
│   ├── api/
│   │   ├── callback.test.ts      # Callback API route tests
│   │   ├── providers.test.ts     # Provider API route tests
│   │   └── admin-auth.test.ts    # Admin auth API tests
│   └── components/
│       ├── CallbackForm.test.tsx  # Form submission tests
│       ├── ProviderCard.test.tsx  # Card rendering tests
│       └── MobileNav.test.tsx    # Navigation tests
├── e2e/
│   ├── directory.spec.ts         # Provider search flow
│   ├── callback.spec.ts          # Lead submission flow
│   └── provider-profile.spec.ts  # Provider page rendering
```

## Priority Test Targets

**High Priority (revenue-critical paths):**

1. **`app/api/callback/route.ts`** - Lead capture API
   - Validates required fields
   - Inserts into `callback_requests` table
   - Sends email via Resend
   - Email failure should not fail the request
   - Test: valid submission, missing fields, provider not found, email failure resilience

2. **`lib/supabase.ts`** - Data access layer
   - `getProviders()` with various filter combinations
   - `getProviderBySlug()` found and not-found cases
   - `transformProvider()` snake_case to camelCase mapping
   - `createCallbackRequest()` data insertion
   - Test: filter logic, transformation accuracy, error handling

3. **`app/api/webhooks/whop/route.ts`** - Payment webhook
   - Signature verification
   - Membership activation upgrades provider tier
   - Membership cancellation downgrades provider
   - Missing email handling
   - Test: valid/invalid signatures, upgrade/downgrade flows, edge cases

4. **`app/api/admin/auth/route.ts`** - Admin authentication
   - Multi-user auth via `ADMIN_USERS` JSON
   - Single password fallback via `ADMIN_PASSWORD`
   - Test: valid/invalid credentials, missing config

**Medium Priority (user experience):**

5. **`components/CallbackForm.tsx`** - Lead capture form
   - Form validation (required fields)
   - Submit state transitions (idle -> submitting -> success/error)
   - Success message rendering
   - Test: render, fill, submit, error states

6. **`components/ProviderCard.tsx`** - Provider display
   - Three render states: unclaimed, claimed-not-verified, verified
   - Featured badge display
   - Trust badges (fast response, background check)
   - Counties truncation (3+ shows "+N more")
   - Test: each card state, badge visibility, link targets

7. **`app/directory/page.tsx`** - Directory search/filter
   - County and service filtering
   - Search by name/city
   - Pagination logic
   - Tier-based sorting (premium > verified > claimed > unclaimed)
   - Test: filter combinations, sort order, pagination

**Lower Priority:**

8. **`app/api/cron/availability-ping/route.ts`** - Weekly cron job
9. **`lib/config.ts`** - Helper functions (`getTierName`, `getServiceLabel`)
10. **`components/JsonLd.tsx`** - Schema markup output

## Mocking Approach

**Supabase mocking pattern:**
```typescript
// Mock the Supabase client for unit tests
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      contains: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockProvider, error: null }),
    })),
  })),
}))
```

**Resend mocking pattern:**
```typescript
// Mock Resend for email tests
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: 'mock-email-id' }),
    },
  })),
}))
```

**Environment variables:**
```typescript
// Set in test setup
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
process.env.RESEND_API_KEY = 'test-resend-key'
```

**What to Mock:**
- Supabase client (all database operations)
- Resend email sending
- Environment variables
- `crypto` module for webhook signature tests (or use real crypto with known inputs)
- `fetch` for client-side API calls in component tests

**What NOT to Mock:**
- React rendering (use Testing Library)
- TypeScript types and transformations
- `lib/config.ts` helper functions (pure functions, test directly)
- URL routing logic
- `cn()` utility function

## Test Data Fixtures

**Provider fixture:**
```typescript
const mockProvider = {
  id: 'test-uuid-123',
  name: 'Test Home Care Agency',
  slug: 'test-home-care-agency-1234',
  city: 'Atlanta',
  state: 'GA',
  counties_served: ['Fulton', 'DeKalb', 'Cobb'],
  email: 'test@example.com',
  phone: '(770) 555-0100',
  intake_phone: null,
  website: 'https://testhomecare.com',
  services_offered: ['RN', 'LPN'],
  accepting_new_patients: true,
  tier_level: 1,
  is_active: true,
  is_claimed: true,
  is_verified: true,
  is_featured: false,
  background_checked_staff: true,
  fast_response: true,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-15T00:00:00Z',
}

const mockCallbackRequest = {
  parentName: 'Jane Smith',
  phone: '(404) 555-0123',
  email: 'jane@example.com',
  zipCode: '30301',
  county: 'Fulton',
  serviceNeeded: 'RN',
  urgency: 'asap',
  providerId: 'test-uuid-123',
}
```

## Coverage

**Requirements:** None enforced. No coverage tool configured.

**Recommended target:**
- 80% coverage on `lib/` (data access + utilities)
- 90% coverage on `app/api/` (API route handlers)
- 60% coverage on `components/` (critical components)

## Test Types

**Unit Tests:**
- Target: `lib/config.ts` helpers, `lib/utils.ts`, `transformProvider()` functions
- These are pure functions, no mocking needed

**Integration Tests:**
- Target: API route handlers (`app/api/*/route.ts`)
- Mock Supabase and Resend, test full request/response cycle
- Verify correct status codes, response shapes, error handling

**Component Tests:**
- Target: `CallbackForm.tsx`, `ProviderCard.tsx`
- Use React Testing Library with jsdom
- Test rendering states, user interactions, form submission

**E2E Tests:**
- Target: Full user flows (search -> select provider -> submit callback)
- Use Playwright against local dev server
- Requires Supabase test instance or local Supabase

## Key Testing Gaps

**Critical untested paths:**
- Payment webhook (`app/api/webhooks/whop/route.ts`) - handles real money, tier upgrades
- Admin auth (`app/api/admin/auth/route.ts`) - protects admin dashboard
- Callback API (`app/api/callback/route.ts`) - primary lead capture mechanism
- Data transformation (snake_case -> camelCase) - duplicated in multiple files, prone to drift
- Cron jobs (`app/api/cron/`) - run unmonitored on schedule

**Risk areas without tests:**
- Provider tier sorting logic in `app/directory/page.tsx` (complex business rules)
- Webhook signature verification in `app/api/webhooks/whop/route.ts`
- County visibility rules (non-verified providers limited to 5 counties)

---

*Testing analysis: 2026-03-07*
