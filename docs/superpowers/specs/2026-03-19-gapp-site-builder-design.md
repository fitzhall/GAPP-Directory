# GAPP Provider Site Builder — Design Spec

## Purpose

A Claude Code skill (`/gapp-site-builder`) that generates standalone, modern HTML websites for individual GAPP providers. The generated site is a sales tool — show up to a provider with their website already built, shift the conversation from "would you like a website?" to "here's your website, want to keep it?"

This supports the GAPP Playbook offer ladder: the site is the Bucket 2 (Fix/Build) entry point, naturally opens audit conversations (Bucket 1), and creates recurring maintenance revenue (Bucket 3).

## Invocation

```
/gapp-site-builder [slug or provider name]
```

- Accepts a provider slug (e.g., `caring-hands-llc`) or a fuzzy name (e.g., `Caring Hands`)
- If slug: direct lookup in Supabase `providers` table
- If name: search by `name.ilike.%input%`, confirm match with user if ambiguous (limit 10 results)
- Outputs: `output/provider-sites/{slug}/index.html`

## Data Source

Query Supabase `providers` table using the anon key from `.env.local`.

### Supabase REST API Format

**Slug lookup:**
```bash
curl -s "https://mjuuqjrxzhkvsbrgqfot.supabase.co/rest/v1/providers?slug=eq.{slug}&is_active=eq.true&select=*" \
  -H "apikey: $(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2)" \
  -H "Authorization: Bearer $(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2)"
```

**Name search (fuzzy):**
```bash
curl -s "https://mjuuqjrxzhkvsbrgqfot.supabase.co/rest/v1/providers?name=ilike.*{input}*&is_active=eq.true&select=id,name,slug,city&limit=10" \
  -H "apikey: $(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2)" \
  -H "Authorization: Bearer $(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2)"
```

**Important:** Always filter `is_active=eq.true`. Do NOT filter on `is_verified` — we want to generate sites for any active provider, including unclaimed ones (those are our best outreach targets).

### Response Format

Supabase REST returns JSON arrays. Array fields (`counties_served`, `services_offered`, `languages`) come as JSON arrays (e.g., `["Fulton","Gwinnett","Cobb"]`).

### Fields Used

| Field | Required | Fallback |
|-------|----------|----------|
| `name` | Yes | — |
| `slug` | Yes | — |
| `city` | Yes | — |
| `counties_served` | Yes | JSON array, render all as pills. In hero: show first 3, then "+ N more" if > 3. |
| `services_offered` | Yes | JSON array of "RN"/"LPN"/"PCS". Only show cards for services the provider offers. |
| `phone` / `intake_phone` | Yes (one of) | Use `intake_phone` if present, else `phone` |
| `bio` | No | Generated: "Serving [first 3 counties] with [services joined] in [city], Georgia." |
| `years_in_business` | No | Stat card shows service count instead |
| `how_to_start` | No | Generic GAPP onboarding steps |
| `accepting_new_patients` | No | Badge hidden if false or null |
| `website` | No | Not shown |
| `address` | No | Shown in contact section if present |
| `available_hours` | No | Shown in contact section if present |
| `response_expectation` | No | Not shown |
| `languages` | No | JSON array. Shown in contact section if present and not just `["English"]`. Format: "We speak Spanish and English" |
| `email` | No | Not shown (privacy — phone is the CTA) |

## Output

Single self-contained HTML file: `output/provider-sites/{slug}/index.html`

- Create output directory with `mkdir -p` if it doesn't exist
- All CSS inline (no external stylesheets)
- Google Fonts CDN link for Nunito (only external dependency)
- No JavaScript required (static content)
- Responsive (mobile + desktop)
- Opens in any browser, hostable anywhere

## Visual Design

**Style: Modern Editorial with GAPP Accents (Option B from brainstorming)**

- Clean white base
- GAPP palette as accents: coral `#FF8A80`, sky blue `#87CEEB`, peach `#FFCBA4`
- Navy `#2C3E50` for text
- Nunito font family
- Rounded corners (12-16px), soft shadows
- Generous whitespace

## Page Sections (Top to Bottom)

### 1. Sticky Navigation Bar
- Provider name with coral accent on the last word before any suffix (LLC, Inc, etc.)
  - "Caring Hands **Home Care**, LLC" — accent "Care" not "LLC"
  - If provider name is a single word, accent the whole name
- "Call Now" button (coral background, white text, links to `tel:`)
- Sticks to top on scroll

### 2. Hero Section
- Soft gradient background (`#FFF5F3` to `#F0F9FF`)
- Green dot + "Accepting New Patients" badge (only if `accepting_new_patients` is true, hidden otherwise)
- "GAPP PROVIDER" label (coral, uppercase, small)
- Tagline: generated from primary service — if RN: "Skilled home nursing for your child", if LPN: "Licensed nursing care in your home", if PCS: "Personal care support for your child", if multiple: "Home nursing and personal care for your child"
- City, GA + county summary: show first 3 counties, then "+ N more" if more than 3
- Service pills (white background, bordered) — only the services the provider actually offers

### 3. About Section
- Left accent border (coral, 3px)
- Bio text or generated fallback
- Parent-friendly tone, no AI vocabulary

### 4. Stats Row
- Three colored stat cards in a row:
  - Years in business (coral background tint) — if no `years_in_business`, show services count with label "Services Offered"
  - Counties served count (sky blue tint)
  - Services offered count (peach tint) — if years_in_business was missing and this slot was used above, show languages count or omit this card
- Bold number, small label underneath

### 5. Services Section
- Heading: "Our Services"
- One card per service the provider offers (only their services, not all three):
  - **RN:** "Skilled nursing care from a Registered Nurse — medication management, medical procedures, and clinical oversight for children with complex health needs."
  - **LPN:** "Licensed Practical Nursing support — routine medical care, vital signs monitoring, and day-to-day health management for your child."
  - **PCS:** "Personal Care Services — help with daily activities like bathing, dressing, feeding, and mobility for children who need hands-on support."

### 6. Counties Served
- Heading: "Areas We Serve"
- Clean grid/pill layout of ALL counties from `counties_served` array
- Subtext: "[City], Georgia and surrounding areas"

### 7. How to Get Started
- Heading: "How to Get Started"
- Provider's `how_to_start` text if available
- If not available, generic steps:
  1. "Call us to discuss your child's needs"
  2. "We'll verify your GAPP approval and insurance"
  3. "We match your family with the right caregiver"
  4. "Care begins in your home on your schedule"

### 8. What is GAPP?
- Heading: "What is the GAPP Program?"
- Brief explainer (4-5 sentences):
  - GAPP = Georgia Pediatric Program, a Medicaid waiver
  - Provides home-based nursing and personal care for children with medical needs
  - Allows families to keep their child at home instead of a facility
  - Mention that the provider on this page is an approved GAPP provider
- Not a legal explainer — written for parents in plain language

### 9. Contact Section
- Heading: "Get in Touch"
- Large phone CTA button (coral gradient, full width)
- Address if `address` is present
- Hours/availability if `available_hours` is present
- Languages if `languages` array has entries beyond just "English" — format: "We speak [language1] and [language2]"
- No email shown (phone is the conversion action)

### 10. Footer
- Minimal: provider name + city
- Small text: "GAPP-approved provider in Georgia"
- No links to GeorgiaGAPP.com (this is their site, not ours)

## Content Rules

- Anti-AI vocabulary rules apply to all generated text (no "comprehensive", "seamless", "leverage", etc.)
- No groups of three adjectives (per feedback memory)
- Parent-to-parent tone: "your child", "your family"
- Direct language: "is" not "serves as", "has" not "boasts"
- Sentence-case headings only
- Generated fallback text should be minimal and factual, not promotional

## Skill File Structure

```
/Users/fitzhall/.claude/skills/gapp-site-builder/
├── SKILL.md              # Skill definition with workflow
└── templates/
    └── provider-site.html  # HTML template with {{placeholder}} tokens (created during implementation)
```

Both files are created as part of implementation.

### SKILL.md Workflow

1. Read `.env.local` from the GAPP project directory to get the Supabase anon key
2. Parse input — check if it looks like a slug (lowercase, hyphens) or a name
3. Query Supabase REST API via curl (see format above)
4. If name search returns multiple: list matches (name + city), ask user to pick
5. If name search returns one: confirm with user before proceeding
6. If no match: error with suggestion to check spelling
7. Extract provider data from JSON response (parse with `python3 -c` or `jq`)
8. Build HTML sections:
   - Generate tagline from services
   - Generate nav name with accent on last meaningful word
   - Render service cards (only for offered services)
   - Render county pills from `counties_served` array
   - Handle all fallbacks per Fields Used table
   - Build conditional contact details (address, hours, languages)
9. Read HTML template from skill's `templates/provider-site.html`
10. Replace all `{{placeholders}}` with generated content
11. `mkdir -p output/provider-sites/{slug}` and write `index.html`
12. Report: "Site generated for [name] at output/provider-sites/{slug}/index.html"

### Template Approach

The HTML template uses simple `{{placeholder}}` tokens that get replaced:

- `{{name}}`, `{{city}}`, `{{phone}}`
- `{{tagline}}` — generated from services
- `{{bio}}` — provider bio or fallback
- `{{services_html}}` — rendered service cards (only offered services)
- `{{counties_html}}` — rendered county pills (all counties from array)
- `{{counties_summary}}` — "Fulton, Gwinnett, Cobb + 5 more" for hero
- `{{how_to_start_html}}` — steps list
- `{{stats_html}}` — stat cards with dynamic values
- `{{contact_extras_html}}` — address + hours + languages (conditional, may be empty)
- `{{accepting_badge}}` — HTML for badge if accepting, empty string if not
- `{{nav_name}}` — name with last meaningful word in coral `<span>`

## Not In Scope

- Deployment / hosting (manual for now)
- Multi-page sites (single page only)
- JavaScript interactivity (pure static HTML)
- Provider portal integration
- Batch generation (one at a time via skill invocation)
- Custom branding per provider (single template, GAPP-branded)
