# Coding Conventions

**Analysis Date:** 2026-03-07

## Naming Patterns

**Files:**
- Pages use Next.js App Router convention: `page.tsx`, `layout.tsx`, `route.ts`
- Components use PascalCase: `ProviderCard.tsx`, `CallbackForm.tsx`, `MobileNav.tsx`
- Library files use camelCase: `supabase.ts`, `config.ts`, `utils.ts`, `data.ts`
- Type definition files use camelCase: `provider.ts`, `member.ts`
- Scripts use kebab-case: `seed-providers.ts`, `update-counties.ts`, `fix-provider-status.ts`
- SEO content pages use kebab-case directories: `gapp-providers-georgia/`, `gapp-approval-guide/`
- Dynamic route segments use brackets: `[county]/`, `[slug]/`, `[token]/`

**Functions:**
- Use camelCase for all functions: `getProviders()`, `createCallbackRequest()`, `toProviderCard()`
- Prefix data-fetching functions with `get`: `getProvider()`, `getProviderBySlug()`, `getActiveCounties()`
- Prefix creation functions with `create`: `createCallbackRequest()`
- Prefix transformation functions with `transform`: `transformProvider()`, `transformProviders()`
- Helper factory functions use `get` prefix: `getSupabase()`, `getResend()`
- Boolean helpers are questions: `verifyCronSecret()`, `verifyWebhookSignature()`

**Variables:**
- Use camelCase for all variables: `providerCards`, `filteredProviders`, `customerEmail`
- Boolean variables use `is` prefix: `isOpen`, `isClaimed`, `isVerified`, `isFeatured`
- State variables follow `[value, setValue]` React pattern: `[loading, setLoading]`, `[status, setStatus]`
- Constants use UPPER_SNAKE_CASE: `ITEMS_PER_PAGE`, `GEORGIA_COUNTIES`, `BATCH_SIZE`, `CSV_PATH`
- Environment variables use non-null assertion: `process.env.NEXT_PUBLIC_SUPABASE_URL!`

**Types/Interfaces:**
- Use PascalCase for all types and interfaces: `Provider`, `CallbackRequest`, `ProviderFilters`
- Interface names describe the entity, no `I` prefix: `Provider` (not `IProvider`)
- Props interfaces use `ComponentNameProps` pattern: `CallbackFormProps`, `ProviderCardProps`
- Union types use PascalCase: `ServiceType`, `ServiceFilter`, `TabType`, `SortType`
- Schema-related interfaces match their purpose: `MedicalBusinessSchemaProps`, `BreadcrumbSchemaProps`

## Code Style

**Formatting:**
- No `.prettierrc` or `.eslintrc` config files detected - relies on `eslint-config-next` defaults
- 2-space indentation throughout all files
- Single quotes for string literals in TypeScript
- No trailing commas (inconsistent - some files have them, some do not)
- Template literals used for string interpolation: `` `${provider.name}` ``
- Semicolons are inconsistent: present in some files (`lib/supabase.ts`), absent in others (`app/layout.tsx`, `components/MobileNav.tsx`)

**Linting:**
- ESLint with `eslint-config-next` (v14.2.5)
- Run via `npm run lint` (uses `next lint`)
- No custom ESLint configuration file - uses Next.js defaults only

**TypeScript:**
- Strict mode enabled in `tsconfig.json`
- Path alias `@/*` maps to project root: `import { config } from '@/lib/config'`
- Target: ES5, Module: ESNext, Module Resolution: bundler
- Non-null assertions (`!`) used liberally on environment variables

## Import Organization

**Order:**
1. Next.js/React framework imports: `import { NextRequest, NextResponse } from 'next/server'`
2. Third-party libraries: `import { createClient } from '@supabase/supabase-js'`
3. Internal modules via path alias: `import { config } from '@/lib/config'`
4. Type-only imports use `import type`: `import type { Provider } from '@/types/provider'`
5. Relative imports for same-directory (rare)

**Path Aliases:**
- `@/*` maps to project root (defined in `tsconfig.json`)
- Use `@/lib/` for utility imports: `@/lib/supabase`, `@/lib/config`, `@/lib/utils`
- Use `@/types/` for type imports: `@/types/provider`, `@/types/member`
- Use `@/components/` for component imports: `@/components/ProviderCard`

**Pattern examples:**
```typescript
// API route imports
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Page imports
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Provider, ServiceType } from '@/types/provider'
import { CallbackForm } from '@/components/CallbackForm'
```

## Error Handling

**API Routes Pattern:**
- Wrap entire handler in `try/catch`
- Validate required fields first, return `{ error: string }` with `status: 400`
- Database errors log with `console.error` and return `{ error: string }` with `status: 500`
- Not-found returns `{ error: string }` with `status: 404`
- Outermost catch returns `{ error: 'Internal server error' }` with `status: 500`

```typescript
// Standard API route pattern (from app/api/callback/route.ts)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.requiredField) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    // ... business logic
    const { data, error } = await supabase.from('table').insert({...}).select().single()
    if (error) {
      console.error('Error description:', error)
      return NextResponse.json({ error: 'User-friendly message' }, { status: 500 })
    }
    return NextResponse.json({ success: true, id: data.id })
  } catch (error) {
    console.error('API name error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

**Email sending is fire-and-forget:**
- Email errors are caught separately and logged but do NOT fail the request
- The pattern: save data first, then attempt email, swallow email errors

```typescript
// Email error pattern (from app/api/callback/route.ts)
try {
  await resend.emails.send({...})
} catch (emailError) {
  console.error('Error sending email notification:', emailError)
  // Request still succeeds - lead is saved
}
```

**Client-side error handling:**
- Forms use status state: `'idle' | 'submitting' | 'success' | 'error'`
- Errors display in colored banners (`bg-red-50 border-red-200`)
- Generic user-facing messages: `'Something went wrong. Please try calling directly.'`

**Server component error handling:**
- Use `notFound()` from `next/navigation` when data not found
- Supabase errors: check `error` from destructured result, return `null` for not-found

## Logging

**Framework:** `console` (no logging library)

**Patterns:**
- `console.error('Context description:', error)` for all errors
- `console.log('Action description:', data)` for webhook/cron job progress
- No structured logging or log levels beyond error/log
- No request logging middleware

## Comments

**When to Comment:**
- Section dividers in data layer files using comment blocks:
```typescript
// ============================================
// PROVIDER QUERIES
// ============================================
```
- Inline comments for non-obvious business logic: `// Non-verified only appear for their first 5 counties`
- JSDoc-style comments on exported functions in `lib/supabase.ts`: `/** Get all active providers with optional filters */`
- TODO-style comments for future work: `// Maybe later`, `// Not for MVP`
- Comments explaining state transitions in admin code

**JSDoc/TSDoc:**
- Used sparingly, only in `lib/supabase.ts` for data access functions
- Simple `/** description */` format, no `@param` or `@returns` tags
- Script files have top-of-file doc comments with usage instructions

## Function Design

**Size:**
- Page components are large (100-500+ lines) with inline JSX
- API route handlers are single functions handling the full request lifecycle
- Utility functions are small and focused (5-20 lines)

**Parameters:**
- Components receive typed props interfaces: `{ provider }: ProviderCardProps`
- Data functions take optional filter objects: `getProviders(filters?: ProviderFilters)`
- API route handlers always take `(request: NextRequest)` and return `NextResponse`

**Return Values:**
- Data functions return typed values or `null`: `Promise<Provider | null>`
- API routes return `NextResponse.json(...)` with consistent shape
- Success: `{ success: true, ...data }`
- Error: `{ error: string }`

## Module Design

**Exports:**
- Named exports for components: `export function ProviderCard()`
- Named exports for utilities: `export function cn()`, `export const config = {...}`
- Default exports only for Next.js pages: `export default function DirectoryPage()`
- No barrel files (`index.ts`) used anywhere

**Barrel Files:** Not used. Import directly from the specific file.

## Database Access Patterns

**Supabase Client Creation:**
- `lib/supabase.ts` exports a singleton client with anon key for general use
- API routes create clients lazily via `getSupabase()` factory using service role key
- Scripts create clients directly with `dotenv` config

```typescript
// API route pattern - lazy initialization to avoid build-time errors
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

**Data Transformation:**
- Database uses snake_case columns; TypeScript uses camelCase properties
- `transformProvider()` and `transformProviders()` in `lib/supabase.ts` handle mapping
- Some pages do inline transformation (duplicated pattern in `app/directory/page.tsx` and `app/provider/[slug]/page.tsx`)

**Query Pattern:**
```typescript
const { data, error } = await supabase
  .from('providers')
  .select('*')
  .eq('is_active', true)
  .order('is_featured', { ascending: false })
  .order('tier_level', { ascending: false })
  .order('name')
```

## Component Patterns

**Server vs Client Components:**
- Pages are Server Components by default (no `'use client'` directive)
- Client Components are explicitly marked with `'use client'` at top of file
- Client Components: `CallbackForm.tsx`, `MobileNav.tsx`, `MiniScreener.tsx`, `PaginatedProviderList.tsx`, `CountiesSection.tsx`, `app/directory/page.tsx`, `app/admin/page.tsx`
- Server Components: `app/provider/[slug]/page.tsx`, SEO content pages, `JsonLd.tsx`

**State Management:**
- Local `useState` only - no global state management library
- No Context providers
- Form state uses single object state: `const [formState, setFormState] = useState({...})`
- Update with spread: `setFormState(prev => ({ ...prev, fieldName: value }))`

**Styling:**
- Tailwind CSS classes inline in JSX
- Use `cn()` utility from `lib/utils.ts` for conditional classes (uses `clsx` + `tailwind-merge`)
- Brand colors via Tailwind theme: `text-primary`, `bg-accent`, `text-navy`, `bg-warm`
- Responsive: mobile-first with `sm:`, `md:`, `lg:` breakpoints
- Common container: `max-w-6xl mx-auto px-4 sm:px-6`
- Rounded corners: `rounded-lg` for inputs, `rounded-xl` for cards, `rounded-2xl` for main content

**SVG Icons:**
- Inline SVG elements - no icon library
- Consistent sizing classes: `w-4 h-4`, `w-5 h-5`, `w-6 h-6`
- Use `fill="none"` with `stroke="currentColor"` for outlined icons
- Use `fill="currentColor"` for filled icons

## SEO Patterns

**Metadata:**
- Static metadata exported as `export const metadata: Metadata` in layouts
- Dynamic metadata via `export async function generateMetadata()` in dynamic pages
- Always include `title`, `description`, `openGraph`, `twitter`, `alternates.canonical`
- Title template: `'%s | GeorgiaGAPP.com'`

**Structured Data:**
- JSON-LD via `components/JsonLd.tsx` components
- Render as `<script type="application/ld+json">` in page body
- Schema types: Organization, MedicalBusiness, BreadcrumbList, FAQPage, WebPage, Article

---

*Convention analysis: 2026-03-07*
