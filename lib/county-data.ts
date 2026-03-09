// County data — single source of truth for all 159 Georgia counties
// Used by app/[county]/page.tsx and app/sitemap.ts

export const GEORGIA_COUNTIES = [
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

export function formatCountyName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export type CountyContext = {
  region: string
  cities: string[]
  description: string
}

// County metadata for unique content per county page
export const COUNTY_CONTEXT: Record<string, CountyContext> = {
  // ─── Metro Atlanta (10 counties) ───
  'fulton': {
    region: 'Metro Atlanta',
    cities: ['Atlanta', 'Sandy Springs', 'Roswell', 'Johns Creek', 'Alpharetta'],
    description: 'Fulton County DFCS in Atlanta handles GAPP intake for the state\'s most populous county. More GAPP providers list Fulton than any other Georgia county, so families here can usually find an agency accepting new patients without a long wait.'
  },
  'gwinnett': {
    region: 'Metro Atlanta',
    cities: ['Lawrenceville', 'Duluth', 'Suwanee', 'Snellville', 'Buford'],
    description: 'The Gwinnett County DFCS office is in Lawrenceville. With over 950,000 residents and a large immigrant population, several GAPP agencies here offer services in Spanish, Korean, and Vietnamese alongside English.'
  },
  'cobb': {
    region: 'Metro Atlanta',
    cities: ['Marietta', 'Smyrna', 'Kennesaw', 'Acworth', 'Powder Springs'],
    description: 'Cobb County DFCS operates out of Marietta. Most GAPP providers in Cobb are clustered along the I-75 corridor between Marietta and Kennesaw, and many also cover Paulding and Douglas counties.'
  },
  'dekalb': {
    region: 'Metro Atlanta',
    cities: ['Decatur', 'Dunwoody', 'Brookhaven', 'Tucker', 'Stonecrest'],
    description: 'DeKalb County DFCS is in Decatur. The county\'s east-west spread means families in Stonecrest may find different provider options than those near Dunwoody. Several agencies here serve multilingual households.'
  },
  'clayton': {
    region: 'Metro Atlanta',
    cities: ['Jonesboro', 'Morrow', 'Forest Park', 'Riverdale', 'College Park'],
    description: 'Clayton County DFCS is in Jonesboro. Providers here typically also serve Henry and Fayette counties. Families near the airport in College Park and Forest Park can reach most south metro agencies within 20 minutes.'
  },
  'cherokee': {
    region: 'North Metro Atlanta',
    cities: ['Woodstock', 'Canton', 'Holly Springs', 'Ball Ground'],
    description: 'Cherokee County DFCS is in Canton. The county has grown past 280,000 residents, and GAPP provider options have expanded with it. Families in the southern end near Woodstock also have easy access to Cobb County providers.'
  },
  'forsyth': {
    region: 'North Metro Atlanta',
    cities: ['Cumming'],
    description: 'Forsyth County DFCS is in Cumming. One of Georgia\'s fastest-growing counties by percentage, Forsyth has fewer GAPP providers than its population might suggest. Families here often use agencies that also serve Hall or Gwinnett.'
  },
  'henry': {
    region: 'South Metro Atlanta',
    cities: ['McDonough', 'Stockbridge', 'Hampton', 'Locust Grove'],
    description: 'Henry County DFCS is in McDonough. Located along the I-75 corridor south of Atlanta, Henry sits between the metro providers in Clayton and the more rural options in Butts and Spalding counties.'
  },
  'douglas': {
    region: 'West Metro Atlanta',
    cities: ['Douglasville', 'Austell', 'Villa Rica'],
    description: 'Douglas County DFCS is in Douglasville. Most families here use GAPP providers that also cover Cobb and Paulding. The I-20 corridor makes it practical to reach agencies based anywhere in west metro Atlanta.'
  },
  'rockdale': {
    region: 'East Metro Atlanta',
    cities: ['Conyers'],
    description: 'Rockdale County DFCS is in Conyers. As one of Georgia\'s smallest counties by area, Rockdale has limited local GAPP providers. Families typically use agencies based in DeKalb or Newton that serve the I-20 east corridor.'
  },

  // ─── Major Regional Centers (20 counties) ───
  'chatham': {
    region: 'Coastal Georgia',
    cities: ['Savannah', 'Pooler', 'Garden City', 'Tybee Island'],
    description: 'Chatham County DFCS is in Savannah. As coastal Georgia\'s largest county with 290,000 residents, Chatham is the base for most GAPP providers serving the Savannah metro area and surrounding coastal counties like Effingham and Bryan.'
  },
  'richmond': {
    region: 'Central Savannah River Area',
    cities: ['Augusta', 'Martinez', 'Evans'],
    description: 'Richmond County DFCS is in Augusta. The Augusta University Medical Center draws families from across eastern Georgia and western South Carolina. GAPP providers here typically cover the full CSRA region including Columbia and Burke counties.'
  },
  'muscogee': {
    region: 'West Central Georgia',
    cities: ['Columbus'],
    description: 'Muscogee County DFCS is in Columbus. As the third-largest city in Georgia, Columbus is the only real hub for GAPP services in the western part of the state. Fort Moore (formerly Fort Benning) brings military families who also use GAPP.'
  },
  'bibb': {
    region: 'Middle Georgia',
    cities: ['Macon'],
    description: 'Bibb County DFCS is in Macon. Sitting roughly in the center of the state, Macon-based GAPP providers often cover a wide radius including Houston, Jones, Monroe, and Crawford counties.'
  },
  'dougherty': {
    region: 'Southwest Georgia',
    cities: ['Albany'],
    description: 'Dougherty County DFCS is in Albany. GAPP provider coverage in southwest Georgia is thinner than in metro areas. Families in Albany may have fewer local options and sometimes need to look at providers based in Macon or Valdosta.'
  },
  'lowndes': {
    region: 'South Georgia',
    cities: ['Valdosta'],
    description: 'Lowndes County DFCS is in Valdosta, about 15 miles from the Florida line. GAPP providers here serve the south Georgia region, and families in neighboring Lanier, Brooks, and Echols counties typically rely on Valdosta-based agencies.'
  },
  'hall': {
    region: 'Northeast Georgia',
    cities: ['Gainesville', 'Flowery Branch', 'Oakwood'],
    description: 'Hall County DFCS is in Gainesville. Northeast Georgia Medical Center anchors healthcare in the region. GAPP providers based here often cover a wide area including Forsyth, Jackson, Banks, and Habersham counties.'
  },
  'clarke': {
    region: 'Northeast Georgia',
    cities: ['Athens'],
    description: 'Clarke County DFCS is in Athens. Home to UGA and a large student population, Clarke has a smaller pediatric population than its overall size suggests. Families here use GAPP providers that also serve Oconee, Madison, and Jackson counties.'
  },
  'whitfield': {
    region: 'Northwest Georgia',
    cities: ['Dalton'],
    description: 'Whitfield County DFCS is in Dalton. Known as the carpet capital of the world, Dalton has a large Hispanic population. GAPP providers here serve the northwest Georgia corridor from Chattooga to Murray counties.'
  },
  'floyd': {
    region: 'Northwest Georgia',
    cities: ['Rome'],
    description: 'Floyd County DFCS is in Rome. Atrium Health Floyd hospital is the main healthcare facility for northwest Georgia. GAPP providers based in Rome typically also serve Polk, Chattooga, and Gordon counties.'
  },
  'houston': {
    region: 'Middle Georgia',
    cities: ['Warner Robins', 'Perry', 'Centerville'],
    description: 'Houston County DFCS is in Warner Robins. Robins Air Force Base brings a steady military population, and GAPP providers here serve both military and civilian families. Most also cover neighboring Bibb and Peach counties.'
  },
  'columbia': {
    region: 'Central Savannah River Area',
    cities: ['Evans', 'Martinez', 'Grovetown'],
    description: 'Columbia County DFCS is in Appling. One of Georgia\'s fastest-growing counties, Columbia sits next to Augusta but has fewer locally-based GAPP providers. Most families use agencies headquartered in Richmond County.'
  },
  'glynn': {
    region: 'Coastal Georgia',
    cities: ['Brunswick', 'St. Simons Island', 'Jekyll Island'],
    description: 'Glynn County DFCS is in Brunswick. GAPP provider options on the coast south of Savannah are limited. Families in the Golden Isles area may need to consider providers based in Chatham County or the Waycross area.'
  },
  'liberty': {
    region: 'Coastal Georgia',
    cities: ['Hinesville', 'Midway'],
    description: 'Liberty County DFCS is in Hinesville. Fort Stewart is the dominant employer, and military families make up a significant portion of GAPP users here. Providers typically also serve Bryan and Long counties.'
  },
  'troup': {
    region: 'West Georgia',
    cities: ['LaGrange'],
    description: 'Troup County DFCS is in LaGrange. Located between Atlanta and Columbus on I-85, families here can access providers from either metro area. Local options are limited, so checking Coweta and Muscogee counties is worth it.'
  },
  'bartow': {
    region: 'Northwest Metro Atlanta',
    cities: ['Cartersville', 'Adairsville', 'Emerson'],
    description: 'Bartow County DFCS is in Cartersville. Sitting on the I-75 corridor between metro Atlanta and northwest Georgia, Bartow families can reach both Cobb County metro providers and Rome-based agencies serving the region.'
  },
  'paulding': {
    region: 'West Metro Atlanta',
    cities: ['Dallas', 'Hiram'],
    description: 'Paulding County DFCS is in Dallas. One of the fastest-growing counties in Georgia, Paulding has relatively few locally-based GAPP providers for its population. Most families use agencies that also serve Cobb and Douglas.'
  },
  'newton': {
    region: 'East Metro Atlanta',
    cities: ['Covington', 'Oxford'],
    description: 'Newton County DFCS is in Covington. Located along I-20 east of Atlanta, Newton sits between the metro providers in DeKalb/Rockdale and more rural coverage in Morgan and Walton counties.'
  },
  'fayette': {
    region: 'South Metro Atlanta',
    cities: ['Peachtree City', 'Fayetteville', 'Tyrone'],
    description: 'Fayette County DFCS is in Fayetteville. With a median household income among the highest in Georgia, Fayette has good GAPP provider access through agencies that serve the south metro corridor from Clayton to Coweta.'
  },
  'coweta': {
    region: 'South Metro Atlanta',
    cities: ['Newnan', 'Senoia', 'Sharpsburg'],
    description: 'Coweta County DFCS is in Newnan. Located along I-85 south of Atlanta, Coweta families can reach both south metro and LaGrange-area GAPP providers. Newnan\'s growing population has brought more healthcare services to the area.'
  },

  // ─── Metro-Adjacent & Secondary Centers (15 counties) ───
  'walton': {
    region: 'East Metro Atlanta',
    cities: ['Monroe', 'Loganville', 'Social Circle'],
    description: 'Walton County DFCS is in Monroe. Straddling the line between metro Atlanta suburbs and rural Georgia, Walton families in Loganville have easy access to Gwinnett-based providers while those farther east may need to look toward Athens.'
  },
  'barrow': {
    region: 'Northeast Metro Atlanta',
    cities: ['Winder', 'Statham', 'Auburn'],
    description: 'Barrow County DFCS is in Winder. Positioned between Gwinnett\'s metro providers and the Athens area, Barrow families can access agencies from either direction. The county\'s population has more than doubled since 2000.'
  },
  'jackson': {
    region: 'Northeast Georgia',
    cities: ['Jefferson', 'Commerce', 'Braselton'],
    description: 'Jackson County DFCS is in Jefferson. The Braselton area in southern Jackson County is growing fast with new hospital facilities. GAPP providers from both Hall County and the Athens area serve Jackson families.'
  },
  'carroll': {
    region: 'West Georgia',
    cities: ['Carrollton', 'Villa Rica', 'Temple'],
    description: 'Carroll County DFCS is in Carrollton. Home to the University of West Georgia, Carroll is the largest county between Atlanta and the Alabama border. GAPP providers here also serve Haralson and Heard counties.'
  },
  'spalding': {
    region: 'South Metro Atlanta',
    cities: ['Griffin'],
    description: 'Spalding County DFCS is in Griffin. Located about 40 miles south of Atlanta, Griffin-area families typically use GAPP providers based in the south metro area. Clayton and Henry county agencies often include Spalding in their service area.'
  },
  'gordon': {
    region: 'Northwest Georgia',
    cities: ['Calhoun', 'Fairmount', 'Ranger'],
    description: 'Gordon County DFCS is in Calhoun. On the I-75 corridor between Cartersville and Dalton, Gordon families can access GAPP providers from either the Bartow or Whitfield County hubs.'
  },
  'catoosa': {
    region: 'Northwest Georgia',
    cities: ['Ringgold', 'Fort Oglethorpe'],
    description: 'Catoosa County DFCS is in Ringgold, near the Tennessee border. Families here are closer to Chattanooga than Atlanta, but GAPP services are Georgia-specific. Providers from the Dalton area typically serve Catoosa.'
  },
  'walker': {
    region: 'Northwest Georgia',
    cities: ['LaFayette', 'Chickamauga', 'Rossville'],
    description: 'Walker County DFCS is in LaFayette. In the far northwest corner of Georgia, Walker County has limited local GAPP providers. Families often rely on agencies based in Whitfield or Catoosa counties.'
  },
  'effingham': {
    region: 'Coastal Georgia',
    cities: ['Springfield', 'Rincon', 'Guyton'],
    description: 'Effingham County DFCS is in Springfield. One of the fastest-growing counties near Savannah, Effingham families mostly use GAPP providers based in Chatham County. Rincon is about 25 miles from downtown Savannah.'
  },
  'bryan': {
    region: 'Coastal Georgia',
    cities: ['Pembroke', 'Richmond Hill'],
    description: 'Bryan County DFCS is in Pembroke. Richmond Hill is a fast-growing Savannah suburb, but most GAPP providers serving Bryan families are based in Chatham County. The county has limited locally-headquartered agencies.'
  },
  'dawson': {
    region: 'North Georgia Mountains',
    cities: ['Dawsonville'],
    description: 'Dawson County DFCS is in Dawsonville. A small mountain county north of metro Atlanta, Dawson has very few local GAPP providers. Families typically use agencies based in Forsyth or Hall counties about 20-30 minutes south.'
  },
  'pickens': {
    region: 'North Georgia Mountains',
    cities: ['Jasper', 'Talking Rock'],
    description: 'Pickens County DFCS is in Jasper. Located in the north Georgia foothills, Pickens has limited GAPP provider coverage. Most families here use agencies based in Cherokee County or the Gainesville area.'
  },
  'oconee': {
    region: 'Northeast Georgia',
    cities: ['Watkinsville', 'Bishop', 'Bogart'],
    description: 'Oconee County DFCS is in Watkinsville, next to Athens. Despite being one of Georgia\'s wealthiest counties per capita, Oconee has few locally-based GAPP providers. Athens-area agencies handle most of the demand.'
  },
  'lee': {
    region: 'Southwest Georgia',
    cities: ['Leesburg', 'Smithville'],
    description: 'Lee County DFCS is in Leesburg, just south of Albany. GAPP coverage in this part of southwest Georgia is thin. Families here rely on the few providers based in Dougherty County.'
  },
  'sumter': {
    region: 'Southwest Georgia',
    cities: ['Americus', 'Plains'],
    description: 'Sumter County DFCS is in Americus. Home to former President Carter\'s hometown of Plains, Sumter has very limited GAPP provider options. Families may need to look at agencies based in Albany or Macon.'
  },
  'thomas': {
    region: 'South Georgia',
    cities: ['Thomasville', 'Meigs', 'Ochlocknee'],
    description: 'Thomas County DFCS is in Thomasville, near the Florida border. Archbold Memorial Hospital anchors healthcare in the area. GAPP provider options are limited, and families sometimes look to Valdosta-based agencies.'
  },
  'ware': {
    region: 'Southeast Georgia',
    cities: ['Waycross'],
    description: 'Ware County DFCS is in Waycross. As the hub for the Okefenokee region, Waycross-based GAPP providers serve a wide but sparsely populated area. Families in surrounding counties like Pierce, Clinch, and Charlton depend on Waycross agencies.'
  },
  'laurens': {
    region: 'Central Georgia',
    cities: ['Dublin'],
    description: 'Laurens County DFCS is in Dublin. Fairview Park Hospital serves the area, but GAPP provider options are limited. Dublin sits between Macon and Vidalia, and families may need to use providers from either direction.'
  },
  'tift': {
    region: 'South Central Georgia',
    cities: ['Tifton'],
    description: 'Tift County DFCS is in Tifton. Located at the intersection of I-75 and US-82, Tifton is the commercial center for south central Georgia. GAPP providers here serve the surrounding rural counties including Cook, Berrien, and Irwin.'
  },
  'colquitt': {
    region: 'South Georgia',
    cities: ['Moultrie', 'Norman Park'],
    description: 'Colquitt County DFCS is in Moultrie. GAPP provider options in this part of south Georgia are sparse. Families here may need to consider agencies based in Tifton, Valdosta, or Albany depending on location.'
  },

  // ─── Remaining Counties (alphabetical) ───
  'appling': {
    region: 'Southeast Georgia',
    cities: ['Baxley'],
    description: 'Appling County DFCS is in Baxley. A rural county east of Vidalia, Appling has limited local GAPP providers. Families often rely on agencies based in the Waycross or Vidalia areas.'
  },
  'atkinson': {
    region: 'South Georgia',
    cities: ['Pearson'],
    description: 'Atkinson County DFCS is in Pearson. With fewer than 9,000 residents, Atkinson has very few local GAPP options. Families here typically use providers from neighboring Coffee or Ware counties.'
  },
  'bacon': {
    region: 'Southeast Georgia',
    cities: ['Alma'],
    description: 'Bacon County DFCS is in Alma. Located between Waycross and Jesup, Bacon County families use GAPP providers that serve the wider southeast Georgia area.'
  },
  'baker': {
    region: 'Southwest Georgia',
    cities: ['Newton'],
    description: 'Baker County DFCS is in Newton. One of Georgia\'s least populated counties with about 3,000 residents, Baker has no locally-based GAPP providers. Families use agencies from Dougherty County (Albany).'
  },
  'baldwin': {
    region: 'Central Georgia',
    cities: ['Milledgeville'],
    description: 'Baldwin County DFCS is in Milledgeville, Georgia\'s former state capital. Home to Georgia College, the county sits between Macon and Augusta. GAPP providers from Bibb County typically serve this area.'
  },
  'banks': {
    region: 'Northeast Georgia',
    cities: ['Homer'],
    description: 'Banks County DFCS is in Homer. A small county between Gainesville and Commerce, Banks has limited GAPP provider options. Families here use agencies that also serve Hall and Jackson counties.'
  },
  'ben-hill': {
    region: 'South Central Georgia',
    cities: ['Fitzgerald'],
    description: 'Ben Hill County DFCS is in Fitzgerald. Originally settled by Union veterans after the Civil War, Fitzgerald sits along US-129 between Tifton and McRae. GAPP coverage is thin, and families may need providers from Tift or Coffee counties.'
  },
  'berrien': {
    region: 'South Georgia',
    cities: ['Nashville'],
    description: 'Berrien County DFCS is in Nashville. Located south of Tifton on I-75, Berrien families typically use GAPP providers based in Tift or Lowndes counties.'
  },
  'bleckley': {
    region: 'Central Georgia',
    cities: ['Cochran'],
    description: 'Bleckley County DFCS is in Cochran. A small county south of Macon, Bleckley has few local GAPP providers. Middle Georgia State University is here, but families rely on Bibb County agencies for pediatric home care.'
  },
  'brantley': {
    region: 'Southeast Georgia',
    cities: ['Nahunta'],
    description: 'Brantley County DFCS is in Nahunta. Located between Waycross and Brunswick, Brantley has limited GAPP options. Families here use providers from Ware or Glynn counties.'
  },
  'brooks': {
    region: 'South Georgia',
    cities: ['Quitman'],
    description: 'Brooks County DFCS is in Quitman, near the Florida border. GAPP provider coverage is limited this far south. Families typically depend on agencies based in Valdosta (Lowndes County) or Thomasville (Thomas County).'
  },
  'bulloch': {
    region: 'Southeast Georgia',
    cities: ['Statesboro'],
    description: 'Bulloch County DFCS is in Statesboro. Home to Georgia Southern University, Statesboro is the largest city between Savannah and Macon. GAPP providers here serve families across several neighboring rural counties.'
  },
  'burke': {
    region: 'East Georgia',
    cities: ['Waynesboro'],
    description: 'Burke County DFCS is in Waynesboro. Georgia\'s largest county by land area, Burke stretches from the Savannah River south toward Swainsboro. Most GAPP providers serving this area are based in Augusta.'
  },
  'butts': {
    region: 'Central Georgia',
    cities: ['Jackson'],
    description: 'Butts County DFCS is in Jackson. Located along I-75 between Atlanta and Macon, Butts is a small county where families use GAPP providers from Henry County to the north or Monroe County to the south.'
  },
  'calhoun': {
    region: 'Southwest Georgia',
    cities: ['Morgan'],
    description: 'Calhoun County DFCS is in Morgan. With about 6,000 residents, Calhoun has very limited GAPP coverage. Families here depend on providers from Dougherty County (Albany) or Early County.'
  },
  'camden': {
    region: 'Coastal Georgia',
    cities: ['Woodbine', 'St. Marys', 'Kingsland'],
    description: 'Camden County DFCS is in Woodbine. Home to Naval Submarine Base Kings Bay, Camden is Georgia\'s southernmost coastal county. Military families here use GAPP providers, though local options are limited compared to the Savannah or Jacksonville areas.'
  },
  'candler': {
    region: 'Southeast Georgia',
    cities: ['Metter'],
    description: 'Candler County DFCS is in Metter, along I-16 between Savannah and Dublin. With only about 11,000 residents, Candler has very few GAPP providers. Families use agencies from Bulloch or Emanuel counties.'
  },
  'charlton': {
    region: 'Southeast Georgia',
    cities: ['Folkston'],
    description: 'Charlton County DFCS is in Folkston, the gateway to the Okefenokee Swamp. One of Georgia\'s most remote counties, Charlton has almost no local GAPP providers. Families rely on agencies from Ware County (Waycross) or Camden County.'
  },
  'chattahoochee': {
    region: 'West Georgia',
    cities: ['Cusseta'],
    description: 'Chattahoochee County DFCS is in Cusseta. Largely occupied by Fort Moore (formerly Fort Benning), this county has fewer than 11,000 residents. Military families use GAPP providers based in Columbus (Muscogee County).'
  },
  'chattooga': {
    region: 'Northwest Georgia',
    cities: ['Summerville'],
    description: 'Chattooga County DFCS is in Summerville. In Georgia\'s northwest corner near Lookout Mountain, Chattooga has limited GAPP options. Families here typically use providers from Floyd County (Rome) or Whitfield County (Dalton).'
  },
  'clay': {
    region: 'Southwest Georgia',
    cities: ['Fort Gaines'],
    description: 'Clay County DFCS is in Fort Gaines, on the Chattahoochee River. With fewer than 3,000 residents, Clay is one of Georgia\'s smallest counties. No locally-based GAPP providers exist here — families use Albany or Columbus-area agencies.'
  },
  'clinch': {
    region: 'South Georgia',
    cities: ['Homerville'],
    description: 'Clinch County DFCS is in Homerville. A rural county near the Okefenokee Swamp, Clinch has very few GAPP providers. Families here look to Valdosta (Lowndes) or Waycross (Ware) for services.'
  },
  'coffee': {
    region: 'South Georgia',
    cities: ['Douglas'],
    description: 'Coffee County DFCS is in Douglas. The largest town between Waycross and Tifton, Douglas is a regional hub for south central Georgia. GAPP providers here serve families from several surrounding counties.'
  },
  'cook': {
    region: 'South Georgia',
    cities: ['Adel'],
    description: 'Cook County DFCS is in Adel, on I-75 between Tifton and Valdosta. A small county with about 17,000 residents, Cook families typically use GAPP providers based in Tift or Lowndes counties.'
  },
  'crawford': {
    region: 'Central Georgia',
    cities: ['Roberta'],
    description: 'Crawford County DFCS is in Roberta. A rural county west of Macon, Crawford has few GAPP options locally. Families use providers based in Bibb County (Macon) or Peach County (Fort Valley).'
  },
  'crisp': {
    region: 'South Central Georgia',
    cities: ['Cordele'],
    description: 'Crisp County DFCS is in Cordele, where I-75 crosses the Georgia Veterans Memorial Highway. Known as the watermelon capital of the world, Cordele-area families use GAPP providers from the Albany or Macon regions.'
  },
  'dade': {
    region: 'Northwest Georgia',
    cities: ['Trenton'],
    description: 'Dade County DFCS is in Trenton. In Georgia\'s far northwest corner on Lookout Mountain, Dade is closer to Chattanooga than any Georgia city. GAPP providers from the Dalton area or Catoosa County serve these families.'
  },
  'decatur': {
    region: 'Southwest Georgia',
    cities: ['Bainbridge'],
    description: 'Decatur County DFCS is in Bainbridge, on Lake Seminole near the Florida border. GAPP provider options are very limited this far southwest. Families may need to use agencies based in Albany or Thomasville.'
  },
  'dodge': {
    region: 'Central Georgia',
    cities: ['Eastman'],
    description: 'Dodge County DFCS is in Eastman, along US-341 south of Macon. GAPP coverage is limited in this part of central Georgia. Families here use providers from Laurens County (Dublin) or Bibb County (Macon).'
  },
  'dooly': {
    region: 'Central Georgia',
    cities: ['Vienna'],
    description: 'Dooly County DFCS is in Vienna. A small farming county between Cordele and Perry, Dooly has very few GAPP providers. Families look to Houston County (Warner Robins) or Crisp County (Cordele) for services.'
  },
  'early': {
    region: 'Southwest Georgia',
    cities: ['Blakely'],
    description: 'Early County DFCS is in Blakely. Known for its peanut farms, Early is a rural county south of Columbus with limited GAPP provider coverage. Families depend on agencies from Albany or Columbus.'
  },
  'echols': {
    region: 'South Georgia',
    cities: ['Statenville'],
    description: 'Echols County DFCS is in Statenville. Georgia\'s least populated county with about 4,000 residents, Echols has no locally-based GAPP providers. Families here rely entirely on Valdosta-area agencies in Lowndes County.'
  },
  'elbert': {
    region: 'Northeast Georgia',
    cities: ['Elberton'],
    description: 'Elbert County DFCS is in Elberton, known as the granite capital of the world. Located in the northeast Georgia foothills near the South Carolina border, families here use GAPP providers from the Athens or Augusta areas.'
  },
  'emanuel': {
    region: 'Central Georgia',
    cities: ['Swainsboro'],
    description: 'Emanuel County DFCS is in Swainsboro. East Georgia State College is here, but GAPP provider options are limited. Families use agencies that also serve Bulloch, Burke, or Laurens counties.'
  },
  'evans': {
    region: 'Southeast Georgia',
    cities: ['Claxton'],
    description: 'Evans County DFCS is in Claxton, known for its rattlesnake roundup. A small county between Statesboro and Vidalia, Evans has few local GAPP providers. Families use agencies from Bulloch or Tattnall counties.'
  },
  'fannin': {
    region: 'North Georgia Mountains',
    cities: ['Blue Ridge', 'McCaysville'],
    description: 'Fannin County DFCS is in Blue Ridge. A mountain county popular with tourists, Fannin has very few GAPP providers locally. Families here typically use agencies from the Gainesville area (Hall County), about an hour south.'
  },
  'franklin': {
    region: 'Northeast Georgia',
    cities: ['Carnesville', 'Lavonia'],
    description: 'Franklin County DFCS is in Carnesville. Located along I-85 near the South Carolina border, Franklin is a small county where families use GAPP providers from the Athens or Gainesville areas.'
  },
  'gilmer': {
    region: 'North Georgia Mountains',
    cities: ['Ellijay', 'East Ellijay'],
    description: 'Gilmer County DFCS is in Ellijay, Georgia\'s apple capital. A mountain county with growing tourism, Gilmer has limited GAPP coverage. Families here look to providers in Cherokee or Hall counties.'
  },
  'glascock': {
    region: 'East Central Georgia',
    cities: ['Gibson'],
    description: 'Glascock County DFCS is in Gibson. Georgia\'s second-smallest county by population (about 3,000 residents), Glascock has no locally-based GAPP providers. Families use agencies from Richmond County (Augusta) or Jefferson County.'
  },
  'grady': {
    region: 'Southwest Georgia',
    cities: ['Cairo'],
    description: 'Grady County DFCS is in Cairo, near the Florida border. GAPP provider options in the far southwest are limited. Families here typically use agencies based in Thomasville (Thomas County) or Tallahassee-area Georgia providers.'
  },
  'greene': {
    region: 'East Central Georgia',
    cities: ['Greensboro', 'Union Point'],
    description: 'Greene County DFCS is in Greensboro. Home to Lake Oconee, Greene sits between Athens and Augusta. GAPP providers from either city may serve this area, but local options are few.'
  },
  'habersham': {
    region: 'Northeast Georgia Mountains',
    cities: ['Clarkesville', 'Cornelia', 'Demorest'],
    description: 'Habersham County DFCS is in Clarkesville. In the northeast Georgia mountains, Habersham has limited GAPP coverage. Families here use providers from Hall County (Gainesville), about 30 minutes south on US-441.'
  },
  'hancock': {
    region: 'Central Georgia',
    cities: ['Sparta'],
    description: 'Hancock County DFCS is in Sparta. A rural county between Milledgeville and Augusta with about 8,500 residents, Hancock has almost no local GAPP providers. Families depend on Bibb or Richmond County agencies.'
  },
  'haralson': {
    region: 'West Georgia',
    cities: ['Buchanan', 'Bremen', 'Tallapoosa'],
    description: 'Haralson County DFCS is in Buchanan. On the Alabama border west of Atlanta, Haralson has limited GAPP options. Families use providers from Douglas, Carroll, or Polk counties.'
  },
  'harris': {
    region: 'West Georgia',
    cities: ['Hamilton'],
    description: 'Harris County DFCS is in Hamilton. An affluent county north of Columbus, Harris has few locally-based GAPP providers. Families here use Columbus-area (Muscogee County) agencies.'
  },
  'hart': {
    region: 'Northeast Georgia',
    cities: ['Hartwell'],
    description: 'Hart County DFCS is in Hartwell, on Lake Hartwell near the South Carolina border. GAPP provider options are limited in the northeast corner. Families use agencies from the Athens or Anderson, SC areas.'
  },
  'heard': {
    region: 'West Georgia',
    cities: ['Franklin'],
    description: 'Heard County DFCS is in Franklin. A small rural county between Carrollton and LaGrange, Heard has very few GAPP providers. Families look to Carroll or Troup county agencies.'
  },
  'irwin': {
    region: 'South Central Georgia',
    cities: ['Ocilla'],
    description: 'Irwin County DFCS is in Ocilla. A rural county between Fitzgerald and Tifton, Irwin has very limited GAPP options. Families use providers based in Tift County (Tifton) or Ben Hill County (Fitzgerald).'
  },
  'jasper': {
    region: 'Central Georgia',
    cities: ['Monticello'],
    description: 'Jasper County DFCS is in Monticello. Between Atlanta and Macon along I-75 and US-11, Jasper has few local GAPP providers. Families here use agencies from Henry or Bibb counties depending on direction.'
  },
  'jeff-davis': {
    region: 'Southeast Georgia',
    cities: ['Hazlehurst'],
    description: 'Jeff Davis County DFCS is in Hazlehurst. Located along US-341 in the Altamaha River area, Jeff Davis has limited GAPP coverage. Families use providers from Coffee County (Douglas) or Appling County (Baxley).'
  },
  'jefferson': {
    region: 'East Georgia',
    cities: ['Louisville'],
    description: 'Jefferson County DFCS is in Louisville, Georgia\'s first permanent state capital. A rural county between Augusta and Swainsboro, Jefferson has few GAPP providers. Augusta-based agencies typically serve this area.'
  },
  'jenkins': {
    region: 'East Georgia',
    cities: ['Millen'],
    description: 'Jenkins County DFCS is in Millen. A small county along US-25 between Augusta and Statesboro, Jenkins has very limited GAPP options. Families use providers from Bulloch or Burke counties.'
  },
  'johnson': {
    region: 'Central Georgia',
    cities: ['Wrightsville'],
    description: 'Johnson County DFCS is in Wrightsville. A small rural county in central Georgia, Johnson has very few GAPP providers. Families here depend on agencies from Laurens County (Dublin) or Emanuel County (Swainsboro).'
  },
  'jones': {
    region: 'Central Georgia',
    cities: ['Gray'],
    description: 'Jones County DFCS is in Gray, just north of Macon. Despite its proximity to Bibb County, Jones has few locally-based GAPP providers. Most families use Macon-area agencies.'
  },
  'lamar': {
    region: 'Central Georgia',
    cities: ['Barnesville'],
    description: 'Lamar County DFCS is in Barnesville. Located between Atlanta and Macon on US-41, Lamar has limited GAPP coverage. Families use providers from the south metro Atlanta area or Bibb County.'
  },
  'lanier': {
    region: 'South Georgia',
    cities: ['Lakeland'],
    description: 'Lanier County DFCS is in Lakeland. One of Georgia\'s smallest counties by population, Lanier sits just west of Valdosta. Families here rely on Lowndes County (Valdosta) agencies for GAPP services.'
  },
  'lincoln': {
    region: 'East Georgia',
    cities: ['Lincolnton'],
    description: 'Lincoln County DFCS is in Lincolnton, on Clarks Hill Lake. A small county between Augusta and Athens, Lincoln has very few GAPP providers. Families depend on Richmond or Columbia County agencies.'
  },
  'long': {
    region: 'Coastal Georgia',
    cities: ['Ludowici'],
    description: 'Long County DFCS is in Ludowici. Adjacent to Fort Stewart in Liberty County, Long has very limited GAPP coverage. Military and civilian families both use providers based in Hinesville or Savannah.'
  },
  'lumpkin': {
    region: 'North Georgia Mountains',
    cities: ['Dahlonega'],
    description: 'Lumpkin County DFCS is in Dahlonega, site of the first US gold rush and home to the University of North Georgia. Mountain county families here use GAPP providers from Hall County (Gainesville).'
  },
  'macon': {
    region: 'Southwest Georgia',
    cities: ['Oglethorpe', 'Montezuma'],
    description: 'Macon County DFCS is in Oglethorpe (not to be confused with the city of Macon in Bibb County). A rural county between Americus and Perry, Macon County has very few GAPP providers. Families look to Sumter or Houston County agencies.'
  },
  'madison': {
    region: 'Northeast Georgia',
    cities: ['Danielsville'],
    description: 'Madison County DFCS is in Danielsville. A rural county north of Athens, Madison has few GAPP providers. Families here use agencies that serve the Clarke County (Athens) or Jackson County areas.'
  },
  'marion': {
    region: 'West Georgia',
    cities: ['Buena Vista'],
    description: 'Marion County DFCS is in Buena Vista. A small county between Columbus and Americus, Marion has almost no local GAPP providers. Families depend on Muscogee County (Columbus) agencies.'
  },
  'mcduffie': {
    region: 'East Georgia',
    cities: ['Thomson'],
    description: 'McDuffie County DFCS is in Thomson. Located along I-20 between Augusta and Atlanta, Thomson-area families have access to Augusta-based GAPP providers. The county is about 35 miles west of Augusta.'
  },
  'mcintosh': {
    region: 'Coastal Georgia',
    cities: ['Darien'],
    description: 'McIntosh County DFCS is in Darien, one of Georgia\'s oldest settlements. A small coastal county between Savannah and Brunswick, McIntosh has very few local GAPP providers. Families use agencies from Glynn or Chatham counties.'
  },
  'meriwether': {
    region: 'West Georgia',
    cities: ['Greenville', 'Warm Springs'],
    description: 'Meriwether County DFCS is in Greenville. Home to FDR\'s Little White House in Warm Springs, Meriwether is a rural county between Atlanta and Columbus. GAPP providers from Coweta or Troup counties typically serve this area.'
  },
  'miller': {
    region: 'Southwest Georgia',
    cities: ['Colquitt'],
    description: 'Miller County DFCS is in Colquitt (the city, not to be confused with Colquitt County). Near the Alabama and Florida borders, Miller has very limited GAPP coverage. Families use providers from Dougherty County (Albany).'
  },
  'mitchell': {
    region: 'Southwest Georgia',
    cities: ['Camilla'],
    description: 'Mitchell County DFCS is in Camilla. A farming county between Albany and Thomasville, Mitchell has limited GAPP options. Families here use agencies based in Albany (Dougherty County).'
  },
  'monroe': {
    region: 'Central Georgia',
    cities: ['Forsyth'],
    description: 'Monroe County DFCS is in Forsyth (the city, not Forsyth County). Located along I-75 between Atlanta and Macon, Monroe is a small county where families use GAPP providers from Bibb County (Macon) or the south metro area.'
  },
  'montgomery': {
    region: 'Southeast Georgia',
    cities: ['Mount Vernon'],
    description: 'Montgomery County DFCS is in Mount Vernon. A rural county along the Oconee River, Montgomery has very few GAPP providers. Families use agencies from Laurens County (Dublin) or Toombs County (Vidalia).'
  },
  'morgan': {
    region: 'Central Georgia',
    cities: ['Madison'],
    description: 'Morgan County DFCS is in Madison, known for its antebellum architecture that survived Sherman\'s March. Between Atlanta and Athens, Morgan has limited GAPP options. Families use providers from Clarke, Newton, or Walton counties.'
  },
  'murray': {
    region: 'Northwest Georgia',
    cities: ['Chatsworth'],
    description: 'Murray County DFCS is in Chatsworth. In the northwest Georgia mountains near the Appalachian Trail, Murray has few GAPP providers. Families here use agencies from Whitfield County (Dalton).'
  },
  'oglethorpe': {
    region: 'Northeast Georgia',
    cities: ['Lexington', 'Crawford'],
    description: 'Oglethorpe County DFCS is in Lexington. A rural county east of Athens, Oglethorpe has very few GAPP providers. Families depend on Clarke County (Athens) agencies.'
  },
  'peach': {
    region: 'Central Georgia',
    cities: ['Fort Valley', 'Byron'],
    description: 'Peach County DFCS is in Fort Valley, home to Fort Valley State University. Located just south of Warner Robins, Peach families have access to GAPP providers based in Houston or Bibb counties.'
  },
  'pierce': {
    region: 'Southeast Georgia',
    cities: ['Blackshear'],
    description: 'Pierce County DFCS is in Blackshear. Between Waycross and Jesup, Pierce has limited GAPP options. Families use providers from Ware County (Waycross) or Wayne County (Jesup).'
  },
  'pike': {
    region: 'Central Georgia',
    cities: ['Zebulon'],
    description: 'Pike County DFCS is in Zebulon. A small county between Griffin and Barnesville, Pike has very few local GAPP providers. Families use agencies from Spalding County (Griffin) or Lamar County (Barnesville).'
  },
  'polk': {
    region: 'Northwest Georgia',
    cities: ['Cedartown', 'Rockmart'],
    description: 'Polk County DFCS is in Cedartown. Located between Cartersville and the Alabama border, Polk has limited GAPP coverage. Families use providers from Floyd County (Rome) or Bartow County (Cartersville).'
  },
  'pulaski': {
    region: 'Central Georgia',
    cities: ['Hawkinsville'],
    description: 'Pulaski County DFCS is in Hawkinsville. A small county south of Macon along the Ocmulgee River, Pulaski has very few GAPP providers. Families look to Houston County (Warner Robins) for services.'
  },
  'putnam': {
    region: 'Central Georgia',
    cities: ['Eatonton'],
    description: 'Putnam County DFCS is in Eatonton, birthplace of author Joel Chandler Harris. On Lake Oconee between Milledgeville and Madison, Putnam has limited GAPP options. Families use Bibb or Baldwin County agencies.'
  },
  'quitman': {
    region: 'Southwest Georgia',
    cities: ['Georgetown'],
    description: 'Quitman County DFCS is in Georgetown. Georgia\'s least populated county with about 2,300 residents, Quitman has no locally-based GAPP providers. Families must use agencies from Columbus or Albany.'
  },
  'rabun': {
    region: 'Northeast Georgia Mountains',
    cities: ['Clayton'],
    description: 'Rabun County DFCS is in Clayton. Georgia\'s northeasternmost county, bordering both Carolinas, Rabun is a mountain tourism area with very few GAPP providers. Families travel to the Gainesville area for services.'
  },
  'randolph': {
    region: 'Southwest Georgia',
    cities: ['Cuthbert'],
    description: 'Randolph County DFCS is in Cuthbert. A rural county between Columbus and Albany, Randolph has limited GAPP coverage. Families here use providers from Muscogee or Dougherty counties.'
  },
  'schley': {
    region: 'Southwest Georgia',
    cities: ['Ellaville'],
    description: 'Schley County DFCS is in Ellaville. One of Georgia\'s smallest counties, Schley sits between Americus and Columbus. GAPP providers from Sumter County (Americus) or Muscogee County typically serve families here.'
  },
  'screven': {
    region: 'East Georgia',
    cities: ['Sylvania'],
    description: 'Screven County DFCS is in Sylvania. Located along US-301 between Statesboro and Augusta, Screven has limited GAPP options. Families use providers from Bulloch County (Statesboro) or the Augusta area.'
  },
  'seminole': {
    region: 'Southwest Georgia',
    cities: ['Donalsonville'],
    description: 'Seminole County DFCS is in Donalsonville, at the confluence of the Chattahoochee and Flint Rivers near Lake Seminole. In Georgia\'s far southwest corner, Seminole has almost no local GAPP providers. Albany-area agencies are the closest option.'
  },
  'stephens': {
    region: 'Northeast Georgia',
    cities: ['Toccoa'],
    description: 'Stephens County DFCS is in Toccoa, near Toccoa Falls and Currahee Mountain. A small county in the northeast Georgia foothills, Stephens has limited GAPP coverage. Families use providers from Hall or Habersham counties.'
  },
  'stewart': {
    region: 'Southwest Georgia',
    cities: ['Lumpkin'],
    description: 'Stewart County DFCS is in Lumpkin (the city, not Lumpkin County). Home to Providence Canyon State Park, Stewart has fewer than 6,000 residents and no local GAPP providers. Families depend on Columbus-area agencies.'
  },
  'talbot': {
    region: 'West Georgia',
    cities: ['Talbotton'],
    description: 'Talbot County DFCS is in Talbotton. A rural county between Columbus and Macon, Talbot has very few GAPP providers. Families here use agencies from Muscogee County (Columbus).'
  },
  'taliaferro': {
    region: 'East Central Georgia',
    cities: ['Crawfordville'],
    description: 'Taliaferro County DFCS is in Crawfordville. One of Georgia\'s least populated counties with about 1,600 residents, Taliaferro has no locally-based GAPP providers. Families use agencies from Greene, Hancock, or Richmond counties.'
  },
  'tattnall': {
    region: 'Southeast Georgia',
    cities: ['Reidsville'],
    description: 'Tattnall County DFCS is in Reidsville. Located between Vidalia and the coast, Tattnall has limited GAPP coverage. Families here use providers from Bulloch County (Statesboro) or Toombs County (Vidalia).'
  },
  'taylor': {
    region: 'Central Georgia',
    cities: ['Butler'],
    description: 'Taylor County DFCS is in Butler. A small county between Columbus and Macon, Taylor has very few GAPP providers. Families look to Bibb County (Macon) or Muscogee County (Columbus) for services.'
  },
  'telfair': {
    region: 'Central Georgia',
    cities: ['McRae-Helena'],
    description: 'Telfair County DFCS is in McRae-Helena. Located at the junction of US-341 and US-280, Telfair has limited GAPP options. Families here use providers from Laurens County (Dublin) or Dodge County (Eastman).'
  },
  'terrell': {
    region: 'Southwest Georgia',
    cities: ['Dawson'],
    description: 'Terrell County DFCS is in Dawson (the city, not Dawson County). A farming county just east of Albany, Terrell has few GAPP providers. Families depend on Dougherty County (Albany) agencies.'
  },
  'toombs': {
    region: 'Southeast Georgia',
    cities: ['Vidalia', 'Lyons'],
    description: 'Toombs County DFCS is in Vidalia, famous for its sweet onions. Located along I-16 in southeast Georgia, Vidalia-area GAPP providers serve families from several surrounding counties including Montgomery and Tattnall.'
  },
  'towns': {
    region: 'North Georgia Mountains',
    cities: ['Hiawassee', 'Young Harris'],
    description: 'Towns County DFCS is in Hiawassee. A mountain county on Lake Chatuge near the North Carolina border, Towns has very few GAPP providers. Families travel to the Gainesville area or use providers from Union County.'
  },
  'treutlen': {
    region: 'Central Georgia',
    cities: ['Soperton'],
    description: 'Treutlen County DFCS is in Soperton. A small county between Dublin and Vidalia, Treutlen has very limited GAPP coverage. Families use providers from Laurens County (Dublin) or Toombs County (Vidalia).'
  },
  'turner': {
    region: 'South Georgia',
    cities: ['Ashburn'],
    description: 'Turner County DFCS is in Ashburn, along I-75 between Cordele and Tifton. With about 8,000 residents, Turner has very few local GAPP providers. Families use agencies from Tift County (Tifton).'
  },
  'twiggs': {
    region: 'Central Georgia',
    cities: ['Jeffersonville'],
    description: 'Twiggs County DFCS is in Jeffersonville. A rural county east of Macon, Twiggs has very few GAPP providers. Families depend on Bibb County (Macon) agencies for pediatric home care services.'
  },
  'union': {
    region: 'North Georgia Mountains',
    cities: ['Blairsville'],
    description: 'Union County DFCS is in Blairsville. A mountain county near the Tennessee and North Carolina borders, Union has limited GAPP coverage. Families here use providers from Hall County (Gainesville) or travel south for services.'
  },
  'upson': {
    region: 'Central Georgia',
    cities: ['Thomaston'],
    description: 'Upson County DFCS is in Thomaston. A small county between Griffin and Columbus, Upson has limited GAPP options. Families use providers from Spalding County (Griffin) or Bibb County (Macon).'
  },
  'warren': {
    region: 'East Central Georgia',
    cities: ['Warrenton'],
    description: 'Warren County DFCS is in Warrenton. A small county between Augusta and Milledgeville, Warren has very few GAPP providers. Families here depend on agencies from Richmond County (Augusta).'
  },
  'washington': {
    region: 'Central Georgia',
    cities: ['Sandersville', 'Tennille'],
    description: 'Washington County DFCS is in Sandersville, the kaolin capital of the world. Located between Macon and Augusta, Washington has limited GAPP options. Families use providers from either city.'
  },
  'wayne': {
    region: 'Southeast Georgia',
    cities: ['Jesup'],
    description: 'Wayne County DFCS is in Jesup. A crossroads county where US-301 and US-84 meet, Wayne has some GAPP providers serving the area between Savannah and Waycross. Jesup is about an hour from both cities.'
  },
  'webster': {
    region: 'Southwest Georgia',
    cities: ['Preston'],
    description: 'Webster County DFCS is in Preston. One of Georgia\'s smallest counties with about 2,600 residents, Webster has no locally-based GAPP providers. Families use agencies from Sumter County (Americus) or Dougherty County (Albany).'
  },
  'wheeler': {
    region: 'Central Georgia',
    cities: ['Alamo'],
    description: 'Wheeler County DFCS is in Alamo. A small rural county between Dublin and Vidalia, Wheeler has very few GAPP providers. Families use agencies from Laurens County (Dublin) or Toombs County (Vidalia).'
  },
  'white': {
    region: 'Northeast Georgia Mountains',
    cities: ['Cleveland'],
    description: 'White County DFCS is in Cleveland. Home to BabyLand General Hospital (Cabbage Patch Kids), White is a mountain county with limited GAPP coverage. Families use providers from Hall County (Gainesville).'
  },
  'wilcox': {
    region: 'South Central Georgia',
    cities: ['Abbeville'],
    description: 'Wilcox County DFCS is in Abbeville. A rural county between Cordele and Fitzgerald, Wilcox has very limited GAPP options. Families look to providers in Ben Hill County (Fitzgerald) or Crisp County (Cordele).'
  },
  'wilkes': {
    region: 'East Georgia',
    cities: ['Washington'],
    description: 'Wilkes County DFCS is in Washington, one of Georgia\'s historic cities. Located between Athens and Augusta, Wilkes has limited GAPP coverage. Families use providers from Clarke or Richmond counties.'
  },
  'wilkinson': {
    region: 'Central Georgia',
    cities: ['Irwinton'],
    description: 'Wilkinson County DFCS is in Irwinton. A small county east of Macon known for kaolin mining, Wilkinson has very few GAPP providers. Families here use agencies from Bibb County (Macon).'
  },
  'worth': {
    region: 'South Georgia',
    cities: ['Sylvester'],
    description: 'Worth County DFCS is in Sylvester. Located south of Albany along US-82, Worth has limited GAPP options. Families use providers from Dougherty County (Albany) or Tift County (Tifton).'
  },
}

// Georgia county regions for "nearby counties" internal linking
export const COUNTY_REGIONS: Record<string, string[]> = {
  // Metro Atlanta
  'fulton': ['dekalb', 'cobb', 'gwinnett', 'clayton', 'douglas'],
  'dekalb': ['fulton', 'gwinnett', 'rockdale', 'henry', 'clayton'],
  'cobb': ['fulton', 'paulding', 'douglas', 'cherokee', 'bartow'],
  'gwinnett': ['fulton', 'dekalb', 'barrow', 'walton', 'forsyth'],
  'clayton': ['fulton', 'henry', 'fayette', 'spalding', 'dekalb'],
  'cherokee': ['cobb', 'forsyth', 'bartow', 'pickens', 'dawson'],
  'forsyth': ['cherokee', 'gwinnett', 'hall', 'dawson', 'fulton'],
  'henry': ['clayton', 'dekalb', 'rockdale', 'newton', 'butts'],
  'douglas': ['cobb', 'fulton', 'paulding', 'carroll', 'haralson'],
  'paulding': ['cobb', 'douglas', 'bartow', 'polk', 'haralson'],
  'rockdale': ['dekalb', 'newton', 'henry', 'walton', 'gwinnett'],
  'newton': ['rockdale', 'walton', 'morgan', 'jasper', 'henry'],
  'fayette': ['clayton', 'coweta', 'spalding', 'fulton', 'henry'],
  'coweta': ['fayette', 'carroll', 'meriwether', 'troup', 'heard'],
  // Metro-Adjacent
  'walton': ['gwinnett', 'barrow', 'newton', 'rockdale', 'oconee'],
  'barrow': ['gwinnett', 'jackson', 'walton', 'oconee', 'clarke'],
  'jackson': ['hall', 'barrow', 'madison', 'clarke', 'banks'],
  'carroll': ['douglas', 'haralson', 'heard', 'coweta', 'paulding'],
  'spalding': ['clayton', 'fayette', 'henry', 'pike', 'butts'],
  'dawson': ['forsyth', 'cherokee', 'pickens', 'lumpkin', 'hall'],
  'pickens': ['cherokee', 'dawson', 'gilmer', 'gordon', 'bartow'],
  // North Georgia
  'hall': ['forsyth', 'jackson', 'banks', 'habersham', 'lumpkin'],
  'bartow': ['cobb', 'cherokee', 'paulding', 'polk', 'gordon'],
  'gordon': ['bartow', 'murray', 'whitfield', 'floyd', 'chattooga'],
  'whitfield': ['gordon', 'murray', 'catoosa', 'walker', 'chattooga'],
  'floyd': ['gordon', 'bartow', 'polk', 'chattooga', 'cherokee'],
  'walker': ['whitfield', 'catoosa', 'dade', 'chattooga', 'murray'],
  'catoosa': ['whitfield', 'walker', 'dade', 'murray', 'gordon'],
  // Northeast Georgia
  'clarke': ['oconee', 'madison', 'jackson', 'oglethorpe', 'barrow'],
  'oconee': ['clarke', 'morgan', 'walton', 'oglethorpe', 'greene'],
  // East Georgia
  'richmond': ['columbia', 'burke', 'jefferson', 'mcduffie', 'lincoln'],
  'columbia': ['richmond', 'lincoln', 'mcduffie', 'burke', 'warren'],
  'burke': ['richmond', 'jefferson', 'screven', 'jenkins', 'emanuel'],
  // Southeast/Coastal Georgia
  'chatham': ['effingham', 'bryan', 'liberty', 'bulloch'],
  'effingham': ['chatham', 'bulloch', 'screven', 'bryan', 'jenkins'],
  'bryan': ['chatham', 'liberty', 'bulloch', 'long', 'effingham'],
  'liberty': ['bryan', 'long', 'mcintosh', 'tattnall', 'chatham'],
  'glynn': ['mcintosh', 'wayne', 'brantley', 'camden', 'charlton'],
  'camden': ['glynn', 'charlton', 'brantley', 'ware', 'wayne'],
  'ware': ['pierce', 'clinch', 'charlton', 'wayne', 'brantley'],
  // Southwest Georgia
  'dougherty': ['lee', 'terrell', 'worth', 'mitchell', 'baker'],
  'muscogee': ['harris', 'chattahoochee', 'marion', 'talbot', 'meriwether'],
  'lee': ['dougherty', 'terrell', 'sumter', 'worth', 'crisp'],
  'thomas': ['grady', 'brooks', 'colquitt', 'mitchell', 'decatur'],
  'lowndes': ['brooks', 'lanier', 'echols', 'cook', 'berrien'],
  'sumter': ['lee', 'macon', 'schley', 'webster', 'crisp'],
  // Central Georgia
  'bibb': ['houston', 'jones', 'twiggs', 'crawford', 'peach'],
  'houston': ['bibb', 'peach', 'pulaski', 'dooly', 'crisp'],
  'jones': ['bibb', 'baldwin', 'twiggs', 'jasper', 'putnam'],
  'laurens': ['dodge', 'telfair', 'treutlen', 'johnson', 'emanuel'],
  // South Central Georgia
  'tift': ['cook', 'berrien', 'irwin', 'colquitt', 'worth'],
  'colquitt': ['tift', 'cook', 'thomas', 'mitchell', 'worth'],
  // Remaining counties (alphabetical)
  'appling': ['jeff-davis', 'tattnall', 'wayne', 'bacon', 'toombs'],
  'atkinson': ['coffee', 'clinch', 'ware', 'lanier', 'berrien'],
  'bacon': ['appling', 'pierce', 'wayne', 'jeff-davis', 'brantley'],
  'baker': ['dougherty', 'mitchell', 'miller', 'calhoun', 'early'],
  'baldwin': ['jones', 'hancock', 'putnam', 'wilkinson', 'washington'],
  'banks': ['hall', 'jackson', 'franklin', 'habersham', 'stephens'],
  'ben-hill': ['irwin', 'tift', 'coffee', 'wilcox', 'turner'],
  'berrien': ['cook', 'tift', 'lowndes', 'lanier', 'atkinson'],
  'bleckley': ['pulaski', 'dodge', 'laurens', 'twiggs', 'houston'],
  'brantley': ['ware', 'pierce', 'glynn', 'camden', 'charlton'],
  'brooks': ['lowndes', 'thomas', 'colquitt', 'cook', 'echols'],
  'bulloch': ['effingham', 'chatham', 'candler', 'emanuel', 'jenkins'],
  'butts': ['henry', 'spalding', 'jasper', 'lamar', 'monroe'],
  'calhoun': ['dougherty', 'baker', 'early', 'randolph', 'clay'],
  'candler': ['bulloch', 'emanuel', 'tattnall', 'evans', 'toombs'],
  'charlton': ['ware', 'clinch', 'camden', 'brantley'],
  'chattahoochee': ['muscogee', 'marion', 'harris', 'talbot', 'stewart'],
  'chattooga': ['floyd', 'walker', 'gordon', 'whitfield', 'polk'],
  'clay': ['randolph', 'calhoun', 'early', 'quitman', 'terrell'],
  'clinch': ['ware', 'echols', 'lowndes', 'lanier', 'atkinson'],
  'coffee': ['jeff-davis', 'ben-hill', 'atkinson', 'irwin', 'bacon'],
  'cook': ['tift', 'berrien', 'lowndes', 'colquitt', 'lanier'],
  'crawford': ['bibb', 'peach', 'taylor', 'monroe', 'macon'],
  'crisp': ['dooly', 'wilcox', 'turner', 'worth', 'lee'],
  'dade': ['walker', 'catoosa', 'chattooga'],
  'decatur': ['grady', 'miller', 'seminole', 'early', 'mitchell'],
  'dodge': ['laurens', 'telfair', 'bleckley', 'pulaski', 'wheeler'],
  'dooly': ['houston', 'crisp', 'pulaski', 'wilcox', 'sumter'],
  'early': ['calhoun', 'baker', 'miller', 'clay', 'randolph'],
  'echols': ['lowndes', 'clinch', 'lanier'],
  'elbert': ['hart', 'madison', 'oglethorpe', 'wilkes', 'lincoln'],
  'emanuel': ['bulloch', 'candler', 'johnson', 'laurens', 'jenkins'],
  'evans': ['candler', 'bulloch', 'tattnall', 'toombs'],
  'fannin': ['gilmer', 'union', 'towns', 'murray'],
  'franklin': ['hart', 'banks', 'stephens', 'madison', 'elbert'],
  'gilmer': ['fannin', 'pickens', 'murray', 'dawson', 'lumpkin'],
  'glascock': ['jefferson', 'warren', 'washington', 'johnson', 'burke'],
  'grady': ['thomas', 'decatur', 'mitchell', 'brooks', 'colquitt'],
  'greene': ['oconee', 'morgan', 'taliaferro', 'hancock', 'oglethorpe'],
  'habersham': ['white', 'rabun', 'stephens', 'banks', 'hall'],
  'hancock': ['baldwin', 'washington', 'warren', 'glascock', 'greene'],
  'haralson': ['polk', 'carroll', 'paulding', 'douglas', 'heard'],
  'harris': ['muscogee', 'talbot', 'meriwether', 'troup', 'chattahoochee'],
  'hart': ['elbert', 'franklin', 'stephens', 'madison'],
  'heard': ['troup', 'coweta', 'carroll', 'meriwether', 'haralson'],
  'irwin': ['ben-hill', 'tift', 'coffee', 'wilcox', 'turner'],
  'jasper': ['jones', 'butts', 'newton', 'putnam', 'monroe'],
  'jeff-davis': ['appling', 'coffee', 'bacon', 'toombs', 'wheeler'],
  'jefferson': ['burke', 'richmond', 'glascock', 'washington', 'jenkins'],
  'jenkins': ['screven', 'burke', 'emanuel', 'bulloch', 'effingham'],
  'johnson': ['laurens', 'emanuel', 'treutlen', 'washington', 'wheeler'],
  'lamar': ['pike', 'spalding', 'upson', 'monroe', 'butts'],
  'lanier': ['lowndes', 'berrien', 'cook', 'echols', 'clinch'],
  'lincoln': ['columbia', 'mcduffie', 'wilkes', 'elbert', 'richmond'],
  'long': ['liberty', 'tattnall', 'wayne', 'mcintosh', 'bryan'],
  'lumpkin': ['dawson', 'hall', 'white', 'union', 'fannin'],
  'macon': ['sumter', 'schley', 'dooly', 'houston', 'crawford'],
  'madison': ['jackson', 'clarke', 'oglethorpe', 'elbert', 'franklin'],
  'marion': ['muscogee', 'chattahoochee', 'talbot', 'schley', 'webster'],
  'mcduffie': ['columbia', 'richmond', 'warren', 'lincoln', 'wilkes'],
  'mcintosh': ['glynn', 'liberty', 'long', 'wayne'],
  'meriwether': ['troup', 'coweta', 'pike', 'upson', 'harris'],
  'miller': ['seminole', 'early', 'baker', 'decatur', 'calhoun'],
  'mitchell': ['dougherty', 'colquitt', 'baker', 'thomas', 'worth'],
  'monroe': ['bibb', 'jones', 'butts', 'lamar', 'crawford'],
  'montgomery': ['toombs', 'wheeler', 'treutlen', 'laurens', 'dodge'],
  'morgan': ['oconee', 'greene', 'putnam', 'jasper', 'newton'],
  'murray': ['whitfield', 'gilmer', 'fannin', 'gordon'],
  'oglethorpe': ['clarke', 'madison', 'greene', 'wilkes', 'elbert'],
  'peach': ['houston', 'bibb', 'crawford', 'macon', 'pulaski'],
  'pierce': ['ware', 'brantley', 'wayne', 'bacon', 'appling'],
  'pike': ['lamar', 'spalding', 'meriwether', 'upson', 'monroe'],
  'polk': ['floyd', 'bartow', 'haralson', 'paulding', 'chattooga'],
  'pulaski': ['houston', 'bleckley', 'dodge', 'dooly', 'wilcox'],
  'putnam': ['jones', 'baldwin', 'morgan', 'jasper', 'hancock'],
  'quitman': ['clay', 'randolph', 'stewart', 'chattahoochee'],
  'rabun': ['habersham', 'towns', 'white'],
  'randolph': ['terrell', 'clay', 'calhoun', 'stewart', 'quitman'],
  'schley': ['sumter', 'macon', 'marion', 'webster', 'taylor'],
  'screven': ['jenkins', 'burke', 'effingham', 'bulloch', 'emanuel'],
  'seminole': ['decatur', 'miller', 'early'],
  'stephens': ['habersham', 'franklin', 'banks', 'hart', 'rabun'],
  'stewart': ['webster', 'quitman', 'randolph', 'chattahoochee', 'marion'],
  'talbot': ['muscogee', 'harris', 'meriwether', 'upson', 'taylor'],
  'taliaferro': ['greene', 'hancock', 'warren', 'wilkes', 'oglethorpe'],
  'tattnall': ['toombs', 'appling', 'long', 'evans', 'candler'],
  'taylor': ['crawford', 'bibb', 'talbot', 'schley', 'macon'],
  'telfair': ['dodge', 'laurens', 'wheeler', 'ben-hill', 'coffee'],
  'terrell': ['dougherty', 'lee', 'randolph', 'sumter', 'webster'],
  'toombs': ['vidalia', 'tattnall', 'montgomery', 'appling', 'jeff-davis'],
  'towns': ['union', 'rabun', 'habersham', 'white'],
  'treutlen': ['laurens', 'emanuel', 'johnson', 'montgomery', 'wheeler'],
  'turner': ['tift', 'ben-hill', 'irwin', 'worth', 'crisp'],
  'twiggs': ['bibb', 'jones', 'wilkinson', 'bleckley', 'laurens'],
  'union': ['towns', 'fannin', 'lumpkin', 'white'],
  'upson': ['pike', 'lamar', 'spalding', 'meriwether', 'talbot'],
  'warren': ['mcduffie', 'hancock', 'glascock', 'taliaferro', 'columbia'],
  'washington': ['baldwin', 'johnson', 'laurens', 'hancock', 'wilkinson'],
  'wayne': ['glynn', 'long', 'appling', 'pierce', 'brantley'],
  'webster': ['sumter', 'stewart', 'schley', 'marion', 'terrell'],
  'wheeler': ['dodge', 'telfair', 'montgomery', 'treutlen', 'laurens'],
  'white': ['habersham', 'lumpkin', 'union', 'towns', 'hall'],
  'wilcox': ['ben-hill', 'crisp', 'dodge', 'pulaski', 'irwin'],
  'wilkes': ['lincoln', 'oglethorpe', 'elbert', 'taliaferro', 'greene'],
  'wilkinson': ['twiggs', 'jones', 'baldwin', 'laurens', 'bleckley'],
  'worth': ['dougherty', 'tift', 'colquitt', 'lee', 'turner'],
}

export function getNearbyCounties(countySlug: string): string[] {
  if (COUNTY_REGIONS[countySlug]) {
    return COUNTY_REGIONS[countySlug].slice(0, 5)
  }
  // Fallback: return some popular metro counties
  const fallbackCounties = ['fulton', 'cobb', 'gwinnett', 'dekalb', 'clayton']
  return fallbackCounties.filter(c => c !== countySlug).slice(0, 4)
}
