// Best-effort Georgia ZIP -> county lookup for lead enrichment.
//
// Purpose: the callback form already requires a ZIP. This derives a county
// so leads stop saving as "Unknown". It is intentionally CONSERVATIVE — it
// only includes ZIPs that map cleanly to a single county. Known multi-county
// ZIPs (e.g. 30338 Dunwoody, 30319 Brookhaven, 30349 College Park) are
// deliberately omitted so we never write a wrong county. Anything not found
// returns null and the caller falls back to "Unknown".
//
// Covers metro Atlanta + Georgia's major population centers, which is the
// large majority of lead volume. Extend as needed.

const ZIP_TO_COUNTY: Record<string, string> = {}

function add(county: string, zips: string[]) {
  for (const z of zips) ZIP_TO_COUNTY[z] = county
}

// ─── Metro Atlanta ───
add('Cobb', ['30008', '30060', '30062', '30064', '30066', '30067', '30068', '30080', '30082', '30101', '30102', '30106', '30126', '30127', '30144', '30152', '30168', '30339'])
add('Cherokee', ['30107', '30114', '30183', '30188', '30189'])
add('Forsyth', ['30028', '30040', '30041'])
add('Gwinnett', ['30017', '30019', '30024', '30039', '30043', '30044', '30045', '30046', '30047', '30071', '30078', '30093', '30096', '30097', '30518', '30519'])
add('DeKalb', ['30002', '30021', '30030', '30032', '30033', '30034', '30035', '30038', '30058', '30079', '30083', '30084', '30087', '30088'])
add('Clayton', ['30236', '30238', '30260', '30273', '30274', '30296', '30297'])
add('Henry', ['30248', '30252', '30253', '30281'])
add('Fayette', ['30214', '30215', '30269', '30290'])
add('Coweta', ['30263', '30265', '30277'])
add('Douglas', ['30122', '30134', '30135', '30187'])
add('Paulding', ['30132', '30141', '30157'])
add('Rockdale', ['30012', '30013', '30094'])
add('Newton', ['30014', '30016', '30054'])
add('Fulton', ['30004', '30005', '30009', '30022', '30075', '30076', '30213', '30268', '30291', '30303', '30305', '30308', '30309', '30310', '30311', '30312', '30314', '30318', '30324', '30326', '30327', '30331', '30342', '30350'])

// ─── Other major population centers ───
add('Hall', ['30501', '30504', '30506', '30507', '30542', '30566'])
add('Muscogee', ['31901', '31903', '31904', '31906', '31907', '31909'])
add('Bibb', ['31201', '31204', '31206', '31210', '31211', '31216', '31217', '31220'])
add('Richmond', ['30901', '30904', '30906', '30907', '30909'])
add('Chatham', ['31401', '31404', '31405', '31406', '31407', '31408', '31410', '31419'])
add('Lowndes', ['31601', '31602', '31605', '31606'])
add('Clarke', ['30601', '30605', '30606', '30607'])
add('Houston', ['31005', '31028', '31069', '31088', '31093'])
add('Dougherty', ['31701', '31705', '31707'])
add('Glynn', ['31520', '31523', '31525'])
add('Whitfield', ['30720', '30721'])
add('Floyd', ['30161', '30165'])
add('Bartow', ['30120', '30121'])
add('Carroll', ['30116', '30117'])
add('Troup', ['30240', '30241'])

/**
 * Returns the Georgia county name for a ZIP, or null if unknown.
 * Accepts ZIP+4 and stray whitespace.
 */
export function countyFromZip(zip: string | undefined | null): string | null {
  if (!zip) return null
  const five = zip.trim().slice(0, 5)
  if (!/^\d{5}$/.test(five)) return null
  return ZIP_TO_COUNTY[five] ?? null
}
