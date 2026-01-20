import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

// Georgia counties for static pages
const GEORGIA_COUNTIES = [
  'appling', 'atkinson', 'bacon', 'baker', 'baldwin', 'banks', 'barrow', 'bartow', 'ben-hill',
  'berrien', 'bibb', 'bleckley', 'brantley', 'brooks', 'bryan', 'bulloch', 'burke', 'butts',
  'calhoun', 'camden', 'candler', 'carroll', 'catoosa', 'charlton', 'chatham', 'chattahoochee',
  'chattooga', 'cherokee', 'clarke', 'clay', 'clayton', 'clinch', 'cobb', 'coffee', 'colquitt',
  'columbia', 'cook', 'coweta', 'crawford', 'crisp', 'dade', 'dawson', 'decatur', 'dekalb',
  'dodge', 'dooly', 'dougherty', 'douglas', 'early', 'echols', 'effingham', 'elbert', 'emanuel',
  'evans', 'fannin', 'fayette', 'floyd', 'forsyth', 'franklin', 'fulton', 'gilmer', 'glascock',
  'glynn', 'gordon', 'grady', 'greene', 'gwinnett', 'habersham', 'hall', 'hancock', 'haralson',
  'harris', 'hart', 'heard', 'henry', 'houston', 'irwin', 'jackson', 'jasper', 'jeff-davis',
  'jefferson', 'jenkins', 'johnson', 'jones', 'lamar', 'lanier', 'laurens', 'lee', 'liberty',
  'lincoln', 'long', 'lowndes', 'lumpkin', 'macon', 'madison', 'marion', 'mcduffie', 'mcintosh',
  'meriwether', 'miller', 'mitchell', 'monroe', 'montgomery', 'morgan', 'murray', 'muscogee',
  'newton', 'oconee', 'oglethorpe', 'paulding', 'peach', 'pickens', 'pierce', 'pike', 'polk',
  'pulaski', 'putnam', 'quitman', 'rabun', 'randolph', 'richmond', 'rockdale', 'schley',
  'screven', 'seminole', 'spalding', 'stephens', 'stewart', 'sumter', 'talbot', 'taliaferro',
  'tattnall', 'taylor', 'telfair', 'terrell', 'thomas', 'tift', 'toombs', 'towns', 'treutlen',
  'troup', 'turner', 'twiggs', 'union', 'upson', 'walker', 'walton', 'ware', 'warren',
  'washington', 'wayne', 'webster', 'wheeler', 'white', 'whitfield', 'wilcox', 'wilkes',
  'wilkinson', 'worth'
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.georgiagapp.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/screener`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/waivers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/providers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/case-managers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Service pages
    {
      url: `${baseUrl}/services/rn-nursing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/lpn-services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/personal-care`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // SEO Pillar Pages (high priority for target keywords)
    {
      url: `${baseUrl}/gapp-providers-georgia`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/gapp-home-care`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/medically-fragile-children-care`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/gapp-approval-guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gapp-approval-timeline`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gapp-medicaid-requirements`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/why-gapp-applications-get-denied`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/katie-beckett-waiver-georgia`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pediatric-home-nursing-georgia`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
  ]

  // County pages
  const countyPages: MetadataRoute.Sitemap = GEORGIA_COUNTIES.map(county => ({
    url: `${baseUrl}/${county}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Provider pages (only verified ones)
  let providerPages: MetadataRoute.Sitemap = []
  try {
    const { data: providers } = await supabase
      .from('providers')
      .select('slug, updated_at')
      .eq('is_active', true)
      .eq('is_verified', true)

    if (providers) {
      providerPages = providers.map(provider => ({
        url: `${baseUrl}/provider/${provider.slug}`,
        lastModified: new Date(provider.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching providers for sitemap:', error)
  }

  return [...staticPages, ...countyPages, ...providerPages]
}
