# GAPP Provider Site Builder — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Claude Code skill that generates standalone HTML websites for GAPP providers, pulling data from Supabase and rendering a modern editorial template.

**Architecture:** Two-file skill — SKILL.md defines the workflow (parse input, query Supabase REST API via curl, build HTML sections, write output), and an HTML template with `{{placeholder}}` tokens provides the page structure. No build step, no framework dependency.

**Tech Stack:** Claude Code skill (Markdown), HTML/CSS (inline), Supabase REST API (curl), Google Fonts (Nunito)

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `/Users/fitzhall/.claude/skills/gapp-site-builder/SKILL.md` | Skill definition with workflow instructions |
| Create | `/Users/fitzhall/.claude/skills/gapp-site-builder/templates/provider-site.html` | HTML template with placeholders |

---

## Chunk 1: HTML Template

### Task 1: Create the provider site HTML template

**Files:**
- Create: `/Users/fitzhall/.claude/skills/gapp-site-builder/templates/provider-site.html`

- [ ] **Step 1: Create the template directory**

```bash
mkdir -p /Users/fitzhall/.claude/skills/gapp-site-builder/templates
```

- [ ] **Step 2: Write the HTML template**

Create `/Users/fitzhall/.claude/skills/gapp-site-builder/templates/provider-site.html` with the full template below. This is a self-contained HTML file with inline CSS, Google Fonts, and `{{placeholder}}` tokens for dynamic content.

The template must include:
- `<!DOCTYPE html>` with viewport meta for responsive
- Google Fonts link for Nunito
- All CSS inline in a `<style>` block
- Sticky nav bar with `{{nav_name}}` and phone CTA
- Hero section with `{{accepting_badge}}`, tagline `{{tagline}}`, `{{city}}`, `{{counties_summary}}`, `{{service_pills}}`
- About section with `{{bio}}`
- Stats row with `{{stats_html}}`
- Services section with `{{services_html}}`
- Counties section with `{{counties_html}}`
- How to Get Started with `{{how_to_start_html}}`
- What is GAPP section (static content, only `{{name}}` injected)
- Contact section with `{{phone}}` CTA and `{{contact_extras_html}}`
- Footer with `{{name}}` and `{{city}}`

Color palette:
- Coral: `#FF8A80` (primary accent, CTAs, borders)
- Sky blue: `#87CEEB` (secondary accent, stat cards)
- Peach: `#FFCBA4` (tertiary accent, stat cards)
- Navy: `#2C3E50` (text, headings)
- Background: white with subtle gradient sections (`#FFF5F3` to `#F0F9FF`)

Layout rules:
- Max width: 800px centered
- Nav: sticky, white background, subtle bottom shadow on scroll
- Hero: generous padding (48px+), gradient background
- Sections: 32px+ vertical padding, clear heading hierarchy
- Cards: white background, 12-16px rounded corners, subtle shadow
- CTA button: full width, coral gradient, 16px padding, bold
- Footer: light gray background, minimal
- Mobile: single column, 16px horizontal padding
- Desktop: centered content, larger type sizes

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{name}} | GAPP Provider in {{city}}, Georgia</title>
  <meta name="description" content="{{name}} is a GAPP-approved home care provider in {{city}}, Georgia. {{tagline}}.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Nunito', -apple-system, sans-serif;
      color: #2C3E50;
      background: #fff;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    /* Nav */
    .nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid #f0f0f0;
      padding: 14px 20px;
      display: flex; align-items: center; justify-content: space-between;
      max-width: 100%;
    }
    .nav-name {
      font-size: 17px; font-weight: 800; color: #2C3E50;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      max-width: 60%;
    }
    .nav-name .accent { color: #FF8A80; }
    .nav-cta {
      background: #FF8A80; color: #fff;
      padding: 8px 20px; border-radius: 8px;
      text-decoration: none; font-weight: 700; font-size: 14px;
      white-space: nowrap;
      transition: background 0.2s;
    }
    .nav-cta:hover { background: #ff6b6b; }

    /* Hero */
    .hero {
      background: linear-gradient(170deg, #FFF5F3 0%, #F0F9FF 100%);
      padding: 48px 20px 40px;
    }
    .hero-inner { max-width: 800px; margin: 0 auto; }
    .accepting-badge {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 13px; font-weight: 700; color: #16a34a;
      margin-bottom: 12px;
    }
    .accepting-dot {
      width: 8px; height: 8px; background: #22c55e;
      border-radius: 50%; display: inline-block;
    }
    .hero-label {
      color: #FF8A80; font-size: 12px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 1.5px;
      margin-bottom: 8px;
    }
    .hero-tagline {
      font-size: 28px; font-weight: 800; line-height: 1.2;
      color: #2C3E50; margin-bottom: 8px;
      letter-spacing: -0.3px;
    }
    .hero-location {
      font-size: 15px; color: #666; margin-bottom: 20px;
    }
    .service-pills { display: flex; flex-wrap: wrap; gap: 8px; }
    .service-pill {
      background: #fff; border: 1px solid #e5e7eb;
      padding: 7px 16px; border-radius: 8px;
      font-size: 13px; font-weight: 600; color: #2C3E50;
    }

    /* Sections */
    .section {
      max-width: 800px; margin: 0 auto;
      padding: 40px 20px;
    }
    .section-title {
      font-size: 22px; font-weight: 800; color: #2C3E50;
      margin-bottom: 16px;
    }

    /* About */
    .about-text {
      border-left: 3px solid #FF8A80;
      padding-left: 20px;
      font-size: 16px; color: #444; line-height: 1.8;
    }

    /* Stats */
    .stats-row {
      display: flex; gap: 12px;
      max-width: 800px; margin: 0 auto;
      padding: 0 20px 20px;
    }
    .stat-card {
      flex: 1; text-align: center;
      padding: 20px 12px; border-radius: 14px;
    }
    .stat-card.coral { background: #FFF5F3; }
    .stat-card.sky { background: #F0F9FF; }
    .stat-card.peach { background: #FFF8F0; }
    .stat-number {
      font-size: 32px; font-weight: 800;
    }
    .stat-card.coral .stat-number { color: #FF8A80; }
    .stat-card.sky .stat-number { color: #87CEEB; }
    .stat-card.peach .stat-number { color: #FFCBA4; }
    .stat-label {
      font-size: 11px; color: #888;
      text-transform: uppercase; letter-spacing: 0.5px;
      margin-top: 4px;
    }

    /* Services */
    .service-cards { display: flex; flex-direction: column; gap: 16px; }
    .service-card {
      background: #fff; border: 1px solid #eee;
      border-radius: 14px; padding: 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .service-card h3 {
      font-size: 17px; font-weight: 700; color: #2C3E50;
      margin-bottom: 8px;
    }
    .service-card p {
      font-size: 15px; color: #555; line-height: 1.7;
    }

    /* Counties */
    .counties-grid {
      display: flex; flex-wrap: wrap; gap: 8px;
      margin-bottom: 12px;
    }
    .county-pill {
      background: #f8f9fa; border: 1px solid #e9ecef;
      padding: 6px 14px; border-radius: 8px;
      font-size: 13px; color: #444; font-weight: 600;
    }
    .counties-sub {
      font-size: 14px; color: #888;
    }

    /* How to start */
    .steps-list {
      list-style: none; counter-reset: steps;
    }
    .steps-list li {
      counter-increment: steps;
      padding: 16px 16px 16px 56px;
      position: relative;
      font-size: 15px; color: #444;
      border-bottom: 1px solid #f0f0f0;
    }
    .steps-list li:last-child { border-bottom: none; }
    .steps-list li::before {
      content: counter(steps);
      position: absolute; left: 16px; top: 16px;
      width: 28px; height: 28px;
      background: #FFF5F3; color: #FF8A80;
      border-radius: 50%; font-weight: 800; font-size: 14px;
      display: flex; align-items: center; justify-content: center;
    }

    /* GAPP explainer */
    .gapp-section {
      background: #F8FAFB;
    }
    .gapp-text {
      font-size: 15px; color: #555; line-height: 1.8;
    }

    /* Contact */
    .contact-section { background: #FFF5F3; }
    .phone-cta {
      display: block; width: 100%;
      background: linear-gradient(135deg, #FF8A80, #ff6b6b);
      color: #fff; text-align: center;
      padding: 18px; border-radius: 14px;
      font-size: 18px; font-weight: 800;
      text-decoration: none;
      box-shadow: 0 4px 16px rgba(255,138,128,0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .phone-cta:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(255,138,128,0.4);
    }
    .contact-extras {
      margin-top: 20px; font-size: 15px; color: #555;
    }
    .contact-extras p { margin-bottom: 8px; }
    .contact-extras strong { color: #2C3E50; }

    /* Footer */
    .footer {
      background: #f8f9fa; padding: 24px 20px;
      text-align: center;
    }
    .footer-name {
      font-size: 15px; font-weight: 700; color: #2C3E50;
    }
    .footer-sub {
      font-size: 12px; color: #999; margin-top: 4px;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .hero-tagline { font-size: 22px; }
      .stats-row { flex-direction: column; }
      .stat-number { font-size: 28px; }
      .section { padding: 32px 16px; }
      .nav-name { font-size: 14px; }
    }
    @media (min-width: 641px) {
      .hero { padding: 64px 20px 56px; }
      .hero-tagline { font-size: 34px; }
      .nav { padding: 14px 32px; }
    }
  </style>
</head>
<body>

  <!-- Nav -->
  <nav class="nav">
    <div class="nav-name">{{nav_name}}</div>
    <a href="tel:{{phone_raw}}" class="nav-cta">Call Now</a>
  </nav>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-inner">
      {{accepting_badge}}
      <div class="hero-label">GAPP Provider</div>
      <h1 class="hero-tagline">{{tagline}}</h1>
      <p class="hero-location">{{city}}, Georgia &middot; {{counties_summary}}</p>
      <div class="service-pills">
        {{service_pills}}
      </div>
    </div>
  </section>

  <!-- About -->
  <section class="section">
    <h2 class="section-title">About us</h2>
    <p class="about-text">{{bio}}</p>
  </section>

  <!-- Stats -->
  <div class="stats-row">
    {{stats_html}}
  </div>

  <!-- Services -->
  <section class="section">
    <h2 class="section-title">Our services</h2>
    <div class="service-cards">
      {{services_html}}
    </div>
  </section>

  <!-- Counties -->
  <section class="section">
    <h2 class="section-title">Areas we serve</h2>
    <div class="counties-grid">
      {{counties_html}}
    </div>
    <p class="counties-sub">{{city}}, Georgia and surrounding areas</p>
  </section>

  <!-- How to Get Started -->
  <section class="section">
    <h2 class="section-title">How to get started</h2>
    {{how_to_start_html}}
  </section>

  <!-- What is GAPP -->
  <section class="section gapp-section">
    <h2 class="section-title">What is the GAPP program?</h2>
    <p class="gapp-text">
      The Georgia Pediatric Program (GAPP) is a Medicaid waiver that provides home-based nursing and personal care for children with significant medical needs. Instead of a hospital or facility, your child receives care at home — from trained nurses and caregivers who come to you. GAPP covers services like skilled nursing (RN and LPN) and personal care support, based on your child's individual care plan. {{name}} is an approved GAPP provider ready to help your family.
    </p>
  </section>

  <!-- Contact -->
  <section class="section contact-section">
    <h2 class="section-title">Get in touch</h2>
    <a href="tel:{{phone_raw}}" class="phone-cta">Call us: {{phone}}</a>
    {{contact_extras_html}}
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-name">{{name}}</div>
    <div class="footer-sub">GAPP-approved provider in {{city}}, Georgia</div>
  </footer>

</body>
</html>
```

- [ ] **Step 3: Verify the template renders**

Open the template in a browser to verify the CSS is correct (placeholders will show as literal text, that's fine — just checking layout/styling):

```bash
open /Users/fitzhall/.claude/skills/gapp-site-builder/templates/provider-site.html
```

Expected: Page loads with the GAPP editorial layout visible — sticky nav, gradient hero, card sections, coral CTA button, responsive on resize.

- [ ] **Step 4: Commit**

```bash
cd /Users/fitzhall/.claude/skills && git add gapp-site-builder/templates/provider-site.html && git commit -m "feat: add GAPP provider site HTML template"
```

If not a git repo, skip this step.

---

## Chunk 2: Skill Definition

### Task 2: Create the SKILL.md

**Files:**
- Create: `/Users/fitzhall/.claude/skills/gapp-site-builder/SKILL.md`

- [ ] **Step 1: Write the SKILL.md**

Create `/Users/fitzhall/.claude/skills/gapp-site-builder/SKILL.md` with the full skill definition:

```markdown
---
name: gapp-site-builder
description: "Generate a standalone HTML website for a GAPP provider. Pulls provider data from Supabase and renders a modern editorial template. Use when the user says 'build site for [provider]', 'generate provider site', 'gapp site builder', or '/gapp-site-builder [name or slug]'."
argument-hint: "[provider slug or name]"
---

# GAPP Provider Site Builder

Generate a standalone, modern HTML website for any GAPP provider. Pulls data from Supabase, renders an editorial template with GAPP branding, and outputs a portable HTML file.

**Output:** `output/provider-sites/{slug}/index.html` (relative to GAPP project directory)

**Project directory:** `/Users/fitzhall/projects/Directory Frameworks/directory-starter-template`

## Workflow

### Step 1: Read the Supabase anon key

Read the anon key from the project's `.env.local`:

```bash
ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template/.env.local" | cut -d= -f2)
```

### Step 2: Look up the provider

Determine if the input is a slug (lowercase, contains hyphens, no spaces) or a name.

**If slug:**
```bash
curl -s "https://mjuuqjrxzhkvsbrgqfot.supabase.co/rest/v1/providers?slug=eq.INPUT&is_active=eq.true&select=*" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY"
```

**If name (contains spaces or uppercase):**
```bash
curl -s "https://mjuuqjrxzhkvsbrgqfot.supabase.co/rest/v1/providers?name=ilike.*INPUT*&is_active=eq.true&select=id,name,slug,city&limit=10" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY"
```

- If name search returns **multiple results**: list them (name + city) and ask the user to pick
- If name search returns **one result**: confirm with user, then fetch full record by slug
- If **no results**: tell user no match found, suggest checking spelling

### Step 3: Parse the provider data

The response is a JSON array. Parse the first element. Key fields:

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Provider business name |
| `slug` | string | URL-safe identifier |
| `city` | string | City name |
| `phone` | string | Primary phone |
| `intake_phone` | string or null | Prefer this over `phone` if present |
| `counties_served` | string[] | JSON array of county names |
| `services_offered` | string[] | JSON array: "RN", "LPN", "PCS" |
| `bio` | string or null | Provider description |
| `years_in_business` | number or null | Years operating |
| `how_to_start` | string or null | Getting started instructions |
| `accepting_new_patients` | boolean | Show badge if true |
| `address` | string or null | Physical address |
| `available_hours` | string or null | Operating hours |
| `languages` | string[] or null | Languages spoken |

### Step 4: Build template replacements

Generate each placeholder value:

**`{{nav_name}}`** — Provider name with the last meaningful word wrapped in `<span class="accent">`. Skip suffixes like LLC, Inc, Corp, Agency. Example: `Caring Hands <span class="accent">Home Care</span>, LLC`

**`{{phone}}`** — Display format of phone (as-is from database). Use `intake_phone` if present, else `phone`.

**`{{phone_raw}}`** — Phone with non-digits stripped for `tel:` link: digits only.

**`{{accepting_badge}}`** — If `accepting_new_patients` is true:
```html
<div class="accepting-badge">
  <span class="accepting-dot"></span>
  Accepting new patients
</div>
```
If false or null: empty string.

**`{{tagline}}`** — Based on services offered:
- RN only: "Skilled home nursing for your child"
- LPN only: "Licensed nursing care in your home"
- PCS only: "Personal care support for your child"
- RN + LPN: "Professional nursing care in your home"
- RN + PCS or LPN + PCS: "Home nursing and personal care for your child"
- All three: "Home nursing and personal care for your child"

**`{{city}}`** — Provider city, as-is.

**`{{counties_summary}}`** — First 3 counties joined with ", " then "+ N more" if more than 3. Example: "Serving Fulton, Gwinnett, Cobb + 5 more"

**`{{service_pills}}`** — One `<span class="service-pill">` per offered service:
- "RN" → "RN Nursing"
- "LPN" → "LPN Nursing"
- "PCS" → "Personal Care"

**`{{bio}}`** — Provider's `bio` field. If null/empty, generate: "Serving [first 3 counties] with [service labels joined] in [city], Georgia."

**`{{stats_html}}`** — Three stat cards. If `years_in_business` exists:
```html
<div class="stat-card coral">
  <div class="stat-number">YEARS</div>
  <div class="stat-label">Years experience</div>
</div>
<div class="stat-card sky">
  <div class="stat-number">COUNT</div>
  <div class="stat-label">Counties served</div>
</div>
<div class="stat-card peach">
  <div class="stat-number">COUNT</div>
  <div class="stat-label">Services offered</div>
</div>
```
If no `years_in_business`, replace the first card with services count and only show two cards (counties + services).

**`{{services_html}}`** — One service card per offered service (only services the provider has):
```html
<div class="service-card">
  <h3>SERVICE_NAME</h3>
  <p>SERVICE_DESCRIPTION</p>
</div>
```
Service descriptions:
- **RN:** "Skilled nursing care from a Registered Nurse — medication management, medical procedures, and clinical oversight for children with complex health needs."
- **LPN:** "Licensed Practical Nursing support — routine medical care, vital signs monitoring, and day-to-day health management for your child."
- **PCS:** "Personal Care Services — help with daily activities like bathing, dressing, feeding, and mobility for children who need hands-on support."

**`{{counties_html}}`** — One pill per county from `counties_served`:
```html
<span class="county-pill">COUNTY_NAME</span>
```

**`{{how_to_start_html}}`** — If provider has `how_to_start`, render as paragraph. If null, render the default steps:
```html
<ol class="steps-list">
  <li>Call us to discuss your child's needs</li>
  <li>We'll verify your GAPP approval and insurance</li>
  <li>We match your family with the right caregiver</li>
  <li>Care begins in your home on your schedule</li>
</ol>
```

**`{{contact_extras_html}}`** — Conditional extras after the phone CTA. Build from available fields:
```html
<div class="contact-extras">
  <!-- Only include lines where data exists -->
  <p><strong>Address:</strong> ADDRESS</p>
  <p><strong>Hours:</strong> AVAILABLE_HOURS</p>
  <p>We speak LANGUAGE1 and LANGUAGE2</p>
</div>
```
If no extras, empty string. Only show languages if the array has entries beyond just "English".

**`{{name}}`** — Provider name, as-is.

### Step 5: Render the template

1. Read the template file: `/Users/fitzhall/.claude/skills/gapp-site-builder/templates/provider-site.html`
2. Replace all `{{placeholder}}` tokens with the generated values
3. Create output directory: `mkdir -p "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template/output/provider-sites/SLUG"`
4. Write the rendered HTML to `output/provider-sites/SLUG/index.html`

### Step 6: Report

Tell the user:
```
Site generated for [PROVIDER NAME]
→ output/provider-sites/[SLUG]/index.html

Open it: open "output/provider-sites/[SLUG]/index.html"
```

## Content rules

- No AI vocabulary: avoid "comprehensive", "seamless", "leverage", "robust", "innovative", "utilize", "foster", "ensure", "holistic", "cutting-edge"
- No groups of three adjectives in a row
- Parent-friendly tone: "your child", "your family"
- Direct language: "is" not "serves as"
- Sentence-case headings only
- Generated fallback text should be factual, not promotional
```

- [ ] **Step 2: Verify the skill is discoverable**

Check that Claude Code can see the skill:

```bash
ls -la /Users/fitzhall/.claude/skills/gapp-site-builder/SKILL.md
```

Expected: File exists with content.

- [ ] **Step 3: Commit**

```bash
cd /Users/fitzhall/.claude/skills && git add gapp-site-builder/SKILL.md && git commit -m "feat: add GAPP provider site builder skill definition"
```

If not a git repo, skip this step.

---

## Chunk 3: End-to-End Test

### Task 3: Test the skill with a real provider

**Files:**
- None (manual test)

- [ ] **Step 1: Pick a test provider**

Query Supabase for a provider with good data coverage (has bio, years, multiple services, multiple counties):

```bash
ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template/.env.local" | cut -d= -f2)
curl -s "https://mjuuqjrxzhkvsbrgqfot.supabase.co/rest/v1/providers?is_active=eq.true&bio=not.is.null&select=name,slug,city,services_offered,counties_served&limit=5" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY"
```

Pick the first provider with at least 2 services and multiple counties.

- [ ] **Step 2: Invoke the skill**

```
/gapp-site-builder [chosen-slug]
```

Expected: Skill runs through all steps, outputs HTML file.

- [ ] **Step 3: Open and verify the output**

```bash
open "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template/output/provider-sites/[SLUG]/index.html"
```

Verify in browser:
- Nav bar shows provider name with coral accent, Call Now button works
- Hero has correct tagline, city, county summary, service pills
- About section shows bio (or fallback)
- Stats row shows correct numbers
- Services section shows only offered services with descriptions
- Counties shows all counties as pills
- How to Get Started shows provider text or default steps
- GAPP explainer mentions provider name
- Contact section has working phone link
- Footer shows provider name + city
- Mobile responsive (resize browser window)

- [ ] **Step 4: Test with a provider that has minimal data**

Find a provider with no bio, no years, no how_to_start:

```bash
curl -s "https://mjuuqjrxzhkvsbrgqfot.supabase.co/rest/v1/providers?is_active=eq.true&bio=is.null&select=name,slug,city&limit=3" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY"
```

Run `/gapp-site-builder [slug]` and verify fallbacks render correctly.

- [ ] **Step 5: Test fuzzy name search**

Run `/gapp-site-builder Caring Hands` (or similar partial name). Verify it finds matches and asks for confirmation.
