---
phase: 04-internal-linking-retrofit
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/layout.tsx
  - app/gapp-approval-guide/page.tsx
  - app/georgia-pediatric-program/page.tsx
  - app/gapp-home-care/page.tsx
  - app/why-gapp-applications-get-denied/page.tsx
  - app/[county]/page.tsx
autonomous: true
requirements: [LINK-02, LINK-03]

must_haves:
  truths:
    - "Footer Resources column includes links to highest-value new pages"
    - "Existing content pages link back to new pages in their Related Resources sections or body text"
    - "County pages link to new application/services pages in their Getting Approved section"
    - "No orphan pages — every new page is linked from at least 2 existing pages"
  artifacts:
    - path: "app/layout.tsx"
      provides: "Footer with links to new content pages"
      contains: "gapp-services-explained"
    - path: "app/gapp-approval-guide/page.tsx"
      provides: "Related Resources updated with new page links"
      contains: "how-to-apply-for-gapp"
    - path: "app/georgia-pediatric-program/page.tsx"
      provides: "Related Resources updated with new page links"
      contains: "gapp-services-explained"
    - path: "app/[county]/page.tsx"
      provides: "Getting Approved section links to application/services pages"
      contains: "how-to-apply-for-gapp"
---

<objective>
Update existing pages across the site to link to all 7 new content pages created in Phases 1-3, strengthening the internal link graph and eliminating orphan pages.

Purpose: Search engines reward sites with strong internal linking. Every new page should be reachable from at least 2 existing pages. The footer update alone puts links on every page of the site.

Output: Updated footer, updated Related Resources sections on hub pages, updated county page callouts.
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@app/layout.tsx
@app/gapp-approval-guide/page.tsx
@app/georgia-pediatric-program/page.tsx
@app/gapp-home-care/page.tsx
@app/why-gapp-applications-get-denied/page.tsx
@app/[county]/page.tsx

New pages to link TO (created in Phases 1-3):
1. /how-to-become-a-gapp-provider (Phase 1)
2. /gapp-paid-caregiver (Phase 1)
3. /gapp-vs-ccsp (Phase 2)
4. /how-to-apply-for-gapp (Phase 2)
5. /gapp-services-explained (Phase 2)
6. /how-to-switch-gapp-providers (Phase 3)
7. /gapp-respite-care (Phase 3)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update footer Resources column in layout.tsx</name>
  <files>app/layout.tsx</files>
  <action>
Edit `app/layout.tsx`. Find the footer's "Resources" column (around lines 172-182). Currently it has 6 links:
- What is GAPP?
- GAPP Providers Georgia
- GAPP Home Care
- Medically Fragile Care
- GAPP Approval Guide
- Medicaid Waivers

Add 4 new links after "GAPP Approval Guide" (before "Medicaid Waivers"). These are the highest-value new pages for families:

```tsx
<li><Link href="/how-to-apply-for-gapp" className="hover:text-warm transition-colors">How to Apply</Link></li>
<li><Link href="/gapp-services-explained" className="hover:text-warm transition-colors">Services Explained</Link></li>
<li><Link href="/gapp-vs-ccsp" className="hover:text-warm transition-colors">GAPP vs CCSP</Link></li>
<li><Link href="/gapp-respite-care" className="hover:text-warm transition-colors">Respite Care</Link></li>
```

This puts the 4 most family-relevant pages in the footer. The provider-focused pages (/how-to-become-a-gapp-provider) and switching page are accessible via the content pages themselves.

Also add one link to the "For Professionals" column:
```tsx
<li><Link href="/how-to-become-a-gapp-provider" className="hover:text-warm transition-colors">Become a Provider</Link></li>
```

This satisfies LINK-03 (navigation or footer updated with highest-value new pages).
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && grep -c "how-to-apply-for-gapp\|gapp-services-explained\|gapp-vs-ccsp\|gapp-respite-care\|how-to-become-a-gapp-provider" app/layout.tsx</automated>
  </verify>
  <done>
- Footer Resources column has 4 new links (how-to-apply, services-explained, gapp-vs-ccsp, respite-care)
- Footer For Professionals column has 1 new link (become-a-provider)
- All links use existing footer styling pattern
  </done>
</task>

<task type="auto">
  <name>Task 2: Update gapp-approval-guide Related Resources</name>
  <files>app/gapp-approval-guide/page.tsx</files>
  <action>
Edit `app/gapp-approval-guide/page.tsx`. Find the "Related Resources" section (around lines 469-504). Currently it has 4 link cards:
- /gapp-approval-timeline
- /gapp-medicaid-requirements
- /why-gapp-applications-get-denied
- /waivers

Replace the grid with 6 cards (change to `sm:grid-cols-3` or keep `sm:grid-cols-2` with 6 items). Add these 2 new cards:

```tsx
<Link
  href="/how-to-apply-for-gapp"
  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
>
  <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">How to apply for GAPP</h3>
  <p className="text-sm text-gray-600">Documents needed, step-by-step process, and realistic timeline.</p>
</Link>
<Link
  href="/gapp-services-explained"
  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
>
  <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP services explained</h3>
  <p className="text-sm text-gray-600">What RN, LPN, and PCS nurses actually do in your home.</p>
</Link>
```

Keep the grid at `sm:grid-cols-2` — 6 cards looks fine in a 2-column grid.
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && grep -c "how-to-apply-for-gapp\|gapp-services-explained" app/gapp-approval-guide/page.tsx</automated>
  </verify>
  <done>
- Related Resources section has 6 cards (4 existing + 2 new)
- New cards link to /how-to-apply-for-gapp and /gapp-services-explained
- Cards use same styling as existing ones
  </done>
</task>

<task type="auto">
  <name>Task 3: Update georgia-pediatric-program Related Resources</name>
  <files>app/georgia-pediatric-program/page.tsx</files>
  <action>
Edit `app/georgia-pediatric-program/page.tsx`. Find the "Related Resources" section (around lines 452-471). Currently it has 3 link cards:
- /gapp-providers-georgia
- /gapp-approval-guide
- /katie-beckett-waiver-georgia

Add 3 new cards to make it 6 total. Change the grid to accommodate (either `sm:grid-cols-2` or `sm:grid-cols-3` depending on existing pattern):

```tsx
<Link href="/gapp-services-explained" className="[existing card classes]">
  <h3 className="[existing heading classes]">GAPP services explained</h3>
  <p className="[existing description classes]">What RN, LPN, and PCS nurses actually do day-to-day.</p>
</Link>
<Link href="/how-to-apply-for-gapp" className="[existing card classes]">
  <h3 className="[existing heading classes]">How to apply for GAPP</h3>
  <p className="[existing description classes]">Documents, steps, and realistic timeline.</p>
</Link>
<Link href="/gapp-vs-ccsp" className="[existing card classes]">
  <h3 className="[existing heading classes]">GAPP vs CCSP</h3>
  <p className="[existing description classes]">Which waiver program fits your child.</p>
</Link>
```

Match the exact classes used by existing cards in that section.
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && grep -c "gapp-services-explained\|how-to-apply-for-gapp\|gapp-vs-ccsp" app/georgia-pediatric-program/page.tsx</automated>
  </verify>
  <done>
- Related Resources section expanded from 3 to 6 cards
- New cards link to /gapp-services-explained, /how-to-apply-for-gapp, /gapp-vs-ccsp
- Cards match existing styling
  </done>
</task>

<task type="auto">
  <name>Task 4: Update gapp-home-care Related Resources</name>
  <files>app/gapp-home-care/page.tsx</files>
  <action>
Edit `app/gapp-home-care/page.tsx`. Find the "Related Resources" section (around lines 439-458). Currently has 3 cards:
- /gapp-providers-georgia
- /gapp-approval-guide
- /medically-fragile-children-care

Add 3 new cards:

```tsx
<Link href="/gapp-services-explained" className="[match existing classes]">
  <h3>GAPP services explained</h3>
  <p>What RN, LPN, and PCS cover in your home.</p>
</Link>
<Link href="/gapp-respite-care" className="[match existing classes]">
  <h3>GAPP respite care</h3>
  <p>How to get backup nursing hours when you need a break.</p>
</Link>
<Link href="/how-to-switch-gapp-providers" className="[match existing classes]">
  <h3>Switch GAPP providers</h3>
  <p>How to change agencies without losing services.</p>
</Link>
```

Match existing card classes exactly.
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && grep -c "gapp-services-explained\|gapp-respite-care\|how-to-switch-gapp-providers" app/gapp-home-care/page.tsx</automated>
  </verify>
  <done>
- Related Resources section expanded from 3 to 6 cards
- New cards link to /gapp-services-explained, /gapp-respite-care, /how-to-switch-gapp-providers
- These are the most relevant links for a home care context page
  </done>
</task>

<task type="auto">
  <name>Task 5: Update why-gapp-applications-get-denied with inline links</name>
  <files>app/why-gapp-applications-get-denied/page.tsx</files>
  <action>
Edit `app/why-gapp-applications-get-denied/page.tsx`. This page discusses denial reasons and fixes. Add inline links to relevant new pages where they fit naturally:

1. Find the section about incomplete documentation or physician orders. Add an inline link to `/how-to-apply-for-gapp` with text like "See our step-by-step application guide" or weave in "check our application guide for the full document checklist."

2. If there's a Related Resources section, add a card for `/how-to-apply-for-gapp`. If not, add a brief "Next steps" or "Related guides" section before the CTA with links to:
   - /how-to-apply-for-gapp
   - /gapp-services-explained

Keep edits minimal — just add links where they fit naturally. Don't rewrite existing content.
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && grep -c "how-to-apply-for-gapp\|gapp-services-explained" app/why-gapp-applications-get-denied/page.tsx</automated>
  </verify>
  <done>
- Denial guide links to /how-to-apply-for-gapp (inline or in a resources section)
- Link feels natural in context, not forced
  </done>
</task>

<task type="auto">
  <name>Task 6: Update county page template with new resource links</name>
  <files>app/[county]/page.tsx</files>
  <action>
Edit `app/[county]/page.tsx`. Find the "Getting Approved for GAPP" callout section (around lines 652-686). Currently it has:
- Link to /gapp-approval-guide
- Link to /screener

This callout box appears on all 159 county pages. Add one more link to `/how-to-apply-for-gapp` as a third CTA option or as inline text. The minimal approach:

In the description text of the callout, add a sentence like: "Read our [application guide](/how-to-apply-for-gapp) for the full document checklist and timeline."

Or add a third button/link below the existing two:
```tsx
<Link
  href="/how-to-apply-for-gapp"
  className="text-sm text-primary hover:underline font-medium"
>
  See the full application guide →
</Link>
```

Also consider adding a link to `/gapp-services-explained` in the services section of the county page if one exists, or in the callout box description. Keep changes minimal — this template affects 159 pages.
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && grep -c "how-to-apply-for-gapp\|gapp-services-explained" "app/[county]/page.tsx"</automated>
  </verify>
  <done>
- County page template links to /how-to-apply-for-gapp in the Getting Approved section
- Change propagates to all 159 county pages automatically
- Edit is minimal and fits naturally in context
  </done>
</task>

</tasks>

<verification>
After all six tasks complete, verify the full phase:

1. **Build check:** `npm run build` completes without errors
2. **Footer links:** grep layout.tsx for all 5 new footer links
3. **Hub page links:** grep each updated page for new internal links
4. **Orphan check:** For each of the 7 new pages, verify it's linked from at least 2 existing pages (footer counts as one):
   - /how-to-become-a-gapp-provider → footer (For Professionals)
   - /gapp-paid-caregiver → (linked from gapp-services-explained FAQ already)
   - /gapp-vs-ccsp → footer + georgia-pediatric-program
   - /how-to-apply-for-gapp → footer + approval-guide + georgia-pediatric-program + county pages + denial guide
   - /gapp-services-explained → footer + approval-guide + georgia-pediatric-program + gapp-home-care
   - /how-to-switch-gapp-providers → gapp-home-care + (linked from respite-care already)
   - /gapp-respite-care → footer + gapp-home-care + (linked from switch-providers already)
5. **No broken patterns:** Verify no existing links were accidentally removed
</verification>

<success_criteria>
1. Footer Resources column includes 4 new links (how-to-apply, services-explained, gapp-vs-ccsp, respite-care)
2. Footer For Professionals column includes "Become a Provider" link
3. gapp-approval-guide Related Resources expanded with how-to-apply-for-gapp and gapp-services-explained
4. georgia-pediatric-program Related Resources expanded with 3 new pages
5. gapp-home-care Related Resources expanded with services-explained, respite-care, switch-providers
6. why-gapp-applications-get-denied links to how-to-apply-for-gapp
7. County page template links to how-to-apply-for-gapp in Getting Approved section
8. Every new page (7 total) is linked from at least 2 existing pages
9. `npm run build` succeeds with no errors
</success_criteria>

<output>
After completion, create `.planning/phases/4/04-01-SUMMARY.md`
</output>
