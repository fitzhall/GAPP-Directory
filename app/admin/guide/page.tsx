'use client'

import { useState, useRef, useCallback } from 'react'

// ─── Section Data ──────────────────────────────────────────────────────────────

interface GuideItem {
  title: string
  content: string[]
}

interface GuideSection {
  id: string
  title: string
  subtitle: string
  iconPath: string
  items: GuideItem[]
}

const sections: GuideSection[] = [
  {
    id: 'day-to-day',
    title: 'Day-to-Day Operations',
    subtitle: 'Everyday tasks for managing providers, leads, and listings',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    items: [
      {
        title: 'Verifying Providers',
        content: [
          'Go to Admin > Providers tab, then click the "Claimed" tab to see providers awaiting verification.',
          'Review the provider\'s information: name, email, phone, and services offered. Make sure the details look legitimate and complete.',
          'Click the green "Verify" button next to the provider. This sends them a verification email and immediately makes their listing visible on the public site.',
          'Once verified, the provider moves to the "Verified" tab. Their profile page becomes accessible to families searching the directory.',
        ],
      },
      {
        title: 'Managing Leads',
        content: [
          'Go to Admin > Leads tab to see all callback requests from families.',
          'New callback requests appear with a blue "New" status badge. Each lead shows the family\'s name, phone number, email, service needed (RN, LPN, or PCS), and urgency level (ASAP, This Month, or Researching).',
          'As you reach out to families, update the status: New \u2192 Contacted \u2192 Converted (if they connected with a provider) or Closed (if no longer needed).',
          'Use the urgency level to prioritize outreach. ASAP leads should be contacted within 24 hours. The lead also shows which provider the family requested, so you can follow up with both sides.',
        ],
      },
      {
        title: 'Toggling Accepting Status',
        content: [
          'On the Providers page, each provider row has an "Accepting" toggle button.',
          'Click the toggle to switch a provider between accepting and not accepting new patients. The change takes effect immediately on the public directory.',
          'Providers who are not accepting new patients still appear in search results but display a "Not Accepting" indicator, letting families know to check back later.',
        ],
      },
      {
        title: 'Editing Provider Details',
        content: [
          'On the Providers page, click any provider\'s name to expand their detail panel.',
          'You can edit the provider\'s name, city, phone number, services offered (RN, LPN, PCS), and counties served.',
          'After making changes, click "Save Changes" at the bottom of the expanded panel. Changes are reflected immediately on the provider\'s public profile page.',
        ],
      },
      {
        title: 'Featuring and Unfeaturing Providers',
        content: [
          'On the Providers page, verified providers have a star icon next to their name.',
          'Click the star to toggle Featured status on or off. Featured providers (Tier 1) appear first in all search results and directory listings, and their cards are visually highlighted.',
          'Featuring a provider sets their tier_level to 1. Coordinate payment ($99/mo) separately. See the Revenue section below for details on the tier system.',
        ],
      },
    ],
  },
  {
    id: 'onboarding',
    title: 'Provider Onboarding',
    subtitle: 'How providers enter the directory and get verified',
    iconPath: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    items: [
      {
        title: 'How Providers Enter the Directory',
        content: [
          'Providers can enter the directory in two ways:',
          '1. Seeded Data: The directory was initially populated with 327 providers from a CSV file. These providers start as unclaimed and unverified.',
          '2. Listing Requests: New providers can submit a request at /request-listing on the public site. These submissions appear in Admin > Requests for your review.',
        ],
      },
      {
        title: 'The Claim Flow',
        content: [
          'Each provider has a unique claim link in the format: georgiagapp.com/claim/provider-slug',
          'When a provider visits their claim link, they fill out a form with their contact information: name, email, phone, and website.',
          'Submitting the claim form marks the provider as "Claimed" in the system, but they are NOT yet verified or visible on the public site.',
          'After a provider claims their listing, you must go to Admin > Providers > "Claimed" tab and verify them to make their listing live.',
        ],
      },
      {
        title: 'Generating and Sending Claim Links',
        content: [
          'On the Providers page, unclaimed providers display a "Copy Claim Link" button.',
          'Click the button to copy the claim URL to your clipboard. Then send the link to the provider via email, phone, or any communication channel.',
          'The claim link is unique to each provider and can be used only once. After claiming, the link redirects to a confirmation page.',
        ],
      },
      {
        title: 'Provider Status Definitions',
        content: [
          'Unclaimed: The provider exists in the database but hasn\'t claimed their listing yet. They are not visible on the public site.',
          'Claimed: The provider filled out the claim form with their contact info. They appear in the "Claimed" tab but are still not visible to the public.',
          'Verified: An admin has confirmed the provider. Their listing is live on the site and visible to families in search results.',
          'Featured: A verified provider with a paid premium listing ($99/mo). They appear first in search results with a highlighted card.',
        ],
      },
      {
        title: 'Handling Listing Requests',
        content: [
          'Go to Admin > Requests tab to see pending submissions from new providers.',
          'Review each request: check the provider\'s name, services, and service area to ensure they qualify as a GAPP provider.',
          'Click "Approve" to create the provider record in the database. The new provider will still need to claim their listing and be verified before appearing on the public site.',
          'Click "Reject" if the request doesn\'t qualify. You can add a note explaining the reason for rejection.',
        ],
      },
    ],
  },
  {
    id: 'revenue',
    title: 'Revenue & Business Operations',
    subtitle: 'Tier system, upgrades, and provider maintenance',
    iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    items: [
      {
        title: 'Tier System Overview',
        content: [
          'The directory has two tiers for providers:',
          'Verified (Tier 0, Free): A basic listing visible in the directory. The provider appears in search results sorted alphabetically after any Featured providers. Includes a standard provider card and profile page.',
          'Featured (Tier 1, $99/mo): A premium listing with priority placement. Featured providers always appear first in search results and directory pages. Their card is visually highlighted to stand out from free listings.',
        ],
      },
      {
        title: 'Upgrading a Provider to Featured',
        content: [
          'Find the verified provider on the Admin > Providers page.',
          'Click the star/feature icon next to the provider\'s name. This sets their tier_level to 1, giving them Featured status and priority placement immediately.',
          'Payment is handled separately from the directory system. Coordinate with the provider to set up recurring billing through Stripe, invoice, or your preferred payment method.',
          'It is recommended to confirm payment before enabling Featured status. If payment lapses, you can downgrade them back to the free Verified tier.',
        ],
      },
      {
        title: 'Downgrading a Provider',
        content: [
          'To remove Featured status, click the star/feature icon again on the Providers page. This reverts the provider to Tier 0 (Verified).',
          'You can also use the "Downgrade" option which lets you record a reason (e.g., payment lapsed, provider request). The reason is saved for your records.',
          'Downgrading does not remove the provider from the directory. They remain visible as a standard Verified listing.',
        ],
      },
      {
        title: 'Verification Pings and Provider Maintenance',
        content: [
          'The system periodically sends check-in pings to verified providers to confirm they are still active and accepting patients.',
          'Providers who miss a check-in are automatically flagged and appear in the "Attention" tab on the Providers page.',
          'From the Attention tab, you have two options:',
          'Re-verify: Confirm the provider is still active (perhaps after contacting them directly). This clears the flag and keeps them in the public directory.',
          'Soft-suspend: Set the missed_checkin_at flag, which removes the provider from public listings until they respond to a check-in. This is reversible and does not delete any data.',
        ],
      },
    ],
  },
]

// ─── Quick Reference Data ──────────────────────────────────────────────────────

const quickLinks = [
  {
    label: 'Providers Tab',
    description: 'Manage, verify, and feature providers',
    href: '/admin',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    label: 'Leads Tab',
    description: 'View and manage family callback requests',
    href: '/admin/leads',
    iconPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    label: 'Requests Tab',
    description: 'Review new listing applications',
    href: '/admin/requests',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
]

// ─── Chevron Icon ──────────────────────────────────────────────────────────────

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
        expanded ? 'rotate-180' : ''
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// ─── Section Icon ──────────────────────────────────────────────────────────────

function SectionIcon({ path }: { path: string }) {
  return (
    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
      <svg
        className="w-5 h-5 text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminGuidePage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const toggleSection = useCallback((id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }, [])

  const scrollToSection = useCallback((id: string) => {
    // Expand the section
    setExpandedSections((prev) => ({
      ...prev,
      [id]: true,
    }))
    // Scroll after a short delay to allow expansion
    setTimeout(() => {
      sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Guide</h1>
          <p className="text-sm text-gray-600 mt-1">
            Everything you need to operate the GAPP Provider Directory
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Quick Reference Box */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Quick Reference
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4.5 h-4.5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.iconPath} />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{link.label}</p>
                  <p className="text-xs text-gray-500">{link.description}</p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Table of Contents
            </h2>
          </div>
          <div className="px-5 py-3">
            <ol className="space-y-2">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className="text-sm text-gray-700 hover:text-primary transition-colors text-left"
                  >
                    <span className="text-gray-400 font-mono mr-2">{index + 1}.</span>
                    {section.title}
                    <span className="text-gray-400 ml-2">&#8212;</span>
                    <span className="text-xs text-gray-400 ml-2">{section.subtitle}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Accordion Sections */}
        {sections.map((section) => {
          const isExpanded = expandedSections[section.id] ?? false

          return (
            <div
              key={section.id}
              ref={(el) => { sectionRefs.current[section.id] = el }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden scroll-mt-20"
            >
              {/* Section Header (clickable) */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-4 px-5 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <SectionIcon path={section.iconPath} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{section.subtitle}</p>
                </div>
                <ChevronIcon expanded={isExpanded} />
              </button>

              {/* Collapsible Content */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="border-t border-gray-100 px-5 py-2">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`py-5 ${
                        itemIndex < section.items.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <div className="space-y-2">
                        {item.content.map((paragraph, pIndex) => {
                          // Detect numbered list items (start with "1." or "2." etc.)
                          const isNumberedItem = /^\d+\.\s/.test(paragraph)
                          return (
                            <p
                              key={pIndex}
                              className={`text-sm text-gray-600 leading-relaxed ${
                                isNumberedItem ? 'pl-4' : ''
                              }`}
                            >
                              {paragraph}
                            </p>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}

        {/* Status Flow Summary */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Provider Status Flow
            </h2>
          </div>
          <div className="px-5 py-5">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="px-3 py-1.5 bg-gray-100 text-gray-600 font-medium rounded-full">
                Unclaimed
              </span>
              <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="px-3 py-1.5 bg-amber-100 text-amber-700 font-medium rounded-full">
                Claimed
              </span>
              <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="px-3 py-1.5 bg-green-100 text-green-700 font-medium rounded-full">
                Verified
              </span>
              <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="px-3 py-1.5 bg-primary/10 text-primary-dark font-medium rounded-full">
                Featured ($99/mo)
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Providers progress through these statuses. Only Verified and Featured providers are visible to families on the public site.
            </p>
          </div>
        </div>

        {/* Lead Status Flow */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Lead Status Flow
            </h2>
          </div>
          <div className="px-5 py-5">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 font-medium rounded-full">
                New
              </span>
              <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="px-3 py-1.5 bg-purple-100 text-purple-700 font-medium rounded-full">
                Contacted
              </span>
              <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <div className="flex flex-col gap-2">
                <span className="px-3 py-1.5 bg-green-100 text-green-700 font-medium rounded-full">
                  Converted
                </span>
                <span className="px-3 py-1.5 bg-gray-100 text-gray-500 font-medium rounded-full">
                  Closed
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Callback requests from families flow through these statuses. Prioritize ASAP urgency leads first.
            </p>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="pb-8" />
      </div>
    </div>
  )
}
