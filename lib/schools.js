// D1 Baseball School Lookup Table
// Maps ESPN team names to their base athletic website domain
// Sidearm Sports schools: {domain}/sidearmstats/baseball/summary = live stats
// StatBroadcast schools: handled separately

const SCHOOLS = {

  // ─── SEC ──────────────────────────────────────────────────────────────────
  "Alabama Crimson Tide":          { domain: "rolltide.com",           platform: "sidearm" },
  "Arkansas Razorbacks":           { domain: "arkansasrazorbacks.com",  platform: "sidearm" },
  "Auburn Tigers":                 { domain: "auburntigers.com",        platform: "sidearm" },
  "Florida Gators":                { domain: "floridagators.com",       platform: "sidearm" },
  "Georgia Bulldogs":              { domain: "georgiadogs.com",         platform: "sidearm" },
  "Kentucky Wildcats":             { domain: "ukathletics.com",         platform: "sidearm" },
  "LSU Tigers":                    { domain: "lsusports.net",           platform: "sidearm" },
  "Mississippi State Bulldogs":    { domain: "hailstate.com",           platform: "sidearm" },
  "Missouri Tigers":               { domain: "mutigers.com",            platform: "sidearm" },
  "Ole Miss Rebels":               { domain: "olemisssports.com",       platform: "statbroadcast" },
  "Oklahoma Sooners":              { domain: "soonersports.com",        platform: "sidearm" },
  "South Carolina Gamecocks":      { domain: "gamecocksonline.com",     platform: "sidearm" },
  "Tennessee Volunteers":          { domain: "utsports.com",            platform: "sidearm" },
  "Texas A&M Aggies":              { domain: "12thman.com",             platform: "sidearm" },
  "Texas Longhorns":               { domain: "texassports.com",         platform: "sidearm" },
  "Vanderbilt Commodores":         { domain: "vucommodores.com",        platform: "sidearm" },

  // ─── ACC ──────────────────────────────────────────────────────────────────
  "Boston College Eagles":         { domain: "bceagles.com",            platform: "sidearm" },
  "Cal Bears":                     { domain: "calbears.com",            platform: "sidearm" },
  "Clemson Tigers":                { domain: "clemsontigers.com",       platform: "sidearm" },
  "Duke Blue Devils":              { domain: "goduke.com",              platform: "sidearm" },
  "Florida State Seminoles":       { domain: "seminoles.com",           platform: "sidearm" },
  "Georgia Tech Yellow Jackets":   { domain: "ramblinwreck.com",        platform: "sidearm" },
  "Louisville Cardinals":          { domain: "gocards.com",             platform: "sidearm" },
  "Miami Hurricanes":              { domain: "hurricanesports.com",     platform: "sidearm" },
  "NC State Wolfpack":             { domain: "gopack.com",              platform: "sidearm" },
  "North Carolina Tar Heels":      { domain: "goheels.com",             platform: "sidearm" },
  "Notre Dame Fighting Irish":     { domain: "und.com",                 platform: "sidearm" },
  "Pittsburgh Panthers":           { domain: "pittPanthers.com",        platform: "sidearm" },
  "SMU Mustangs":                  { domain: "smumustangs.com",         platform: "sidearm" },
  "Stanford Cardinal":             { domain: "gostanford.com",          platform: "sidearm" },
  "Syracuse Orange":               { domain: "cuse.com",                platform: "sidearm" },
  "Virginia Cavaliers":            { domain: "virginiasports.com",      platform: "sidearm" },
  "Virginia Tech Hokies":          { domain: "hokiesports.com",         platform: "sidearm" },
  "Wake Forest Demon Deacons":     { domain: "godeacs.com",             platform: "sidearm" },

  // ─── Big 12 ───────────────────────────────────────────────────────────────
  "Arizona Wildcats":              { domain: "arizonawildcats.com",     platform: "sidearm" },
  "Arizona State Sun Devils":      { domain: "thesundevils.com",        platform: "sidearm" },
  "BYU Cougars":                   { domain: "byucougars.com",          platform: "sidearm" },
  "Baylor Bears":                  { domain: "baylorbears.com",         platform: "sidearm" },
  "Cincinnati Bearcats":           { domain: "gobearcats.com",          platform: "sidearm" },
  "Houston Cougars":               { domain: "uhcougars.com",           platform: "sidearm" },
  "Iowa State Cyclones":           { domain: "cyclones.com",            platform: "sidearm" },
  "Kansas Jayhawks":               { domain: "kuathletics.com",         platform: "sidearm" },
  "Kansas State Wildcats":         { domain: "kstatesports.com",        platform: "sidearm" },
  "Oklahoma State Cowboys":        { domain: "okstate.com",             platform: "sidearm" },
  "TCU Horned Frogs":              { domain: "gofrogs.com",             platform: "sidearm" },
  "Texas Tech Red Raiders":        { domain: "texastech.com",           platform: "sidearm" },
  "UCF Knights":                   { domain: "ucfknights.com",          platform: "sidearm" },
  "Utah Utes":                     { domain: "utahutes.com",            platform: "sidearm" },
  "West Virginia Mountaineers":    { domain: "wvusports.com",           platform: "sidearm" },

  // ─── Big Ten ──────────────────────────────────────────────────────────────
  "Illinois Fighting Illini":      { domain: "fightingillini.com",      platform: "sidearm" },
  "Indiana Hoosiers":              { domain: "iuhoosiers.com",          platform: "sidearm" },
  "Iowa Hawkeyes":                 { domain: "hawkeyesports.com",       platform: "sidearm" },
  "Maryland Terrapins":            { domain: "umterps.com",             platform: "sidearm" },
  "Michigan Wolverines":           { domain: "mgoblue.com",             platform: "sidearm" },
  "Michigan State Spartans":       { domain: "msuspartans.com",         platform: "sidearm" },
  "Minnesota Golden Gophers":      { domain: "gophersports.com",        platform: "sidearm" },
  "Nebraska Cornhuskers":          { domain: "huskers.com",             platform: "sidearm" },
  "Northwestern Wildcats":         { domain: "nusports.com",            platform: "sidearm" },
  "Ohio State Buckeyes":           { domain: "ohiostatebuckeyes.com",   platform: "sidearm" },
  "Oregon Ducks":                  { domain: "goducks.com",             platform: "sidearm" },
  "Penn State Nittany Lions":      { domain: "gopsusports.com",         platform: "sidearm" },
  "Purdue Boilermakers":           { domain: "purduesports.com",        platform: "sidearm" },
  "Rutgers Scarlet Knights":       { domain: "scarletknights.com",      platform: "sidearm" },
  "UCLA Bruins":                   { domain: "uclabruins.com",          platform: "sidearm" },
  "USC Trojans":                   { domain: "usctrojans.com",          platform: "sidearm" },
  "Washington Huskies":            { domain: "gohuskies.com",           platform: "sidearm" },

  // ─── Sun Belt ─────────────────────────────────────────────────────────────
  "App State Mountaineers":        { domain: "appstatesports.com",      platform: "sidearm" },
  "Arkansas State Red Wolves":     { domain: "astateredwolves.com",     platform: "sidearm" },
  "Coastal Carolina Chanticleers": { domain: "goccusports.com",         platform: "sidearm" },
  "Georgia Southern Eagles":       { domain: "georgiasoutherneagles.com",platform: "sidearm" },
  "Georgia State Panthers":        { domain: "georgiastatesports.com",  platform: "sidearm" },
  "James Madison Dukes":           { domain: "jmusports.com",           platform: "sidearm" },
  "Louisiana Ragin Cajuns":        { domain: "ragincajuns.com",         platform: "sidearm" },
  "Marshall Thundering Herd":      { domain: "herdzone.com",            platform: "sidearm" },
  "Old Dominion Monarchs":         { domain: "odusports.com",           platform: "sidearm" },
  "South Alabama Jaguars":         { domain: "usajaguars.com",          platform: "sidearm" },
  "Southern Miss Golden Eagles":   { domain: "southernmiss.com",        platform: "sidearm" },
  "Texas State Bobcats":           { domain: "txstatebobcats.com",      platform: "sidearm" },
  "Troy Trojans":                  { domain: "troytrojans.com",         platform: "sidearm" },

  // ─── American Athletic ────────────────────────────────────────────────────
  "Charlotte 49ers":               { domain: "charlotte49ers.com",      platform: "sidearm" },
  "East Carolina Pirates":         { domain: "ecupirates.com",          platform: "sidearm" },
  "FAU Owls":                      { domain: "fausports.com",           platform: "sidearm" },
  "Memphis Tigers":                { domain: "gotigersgo.com",          platform: "sidearm" },
  "Navy Midshipmen":               { domain: "navysports.com",          platform: "sidearm" },
  "Rice Owls":                     { domain: "riceowls.com",            platform: "sidearm" },
  "South Florida Bulls":           { domain: "gousfbulls.com",          platform: "sidearm" },
  "Tulane Green Wave":             { domain: "tulanegreenwave.com",     platform: "sidearm" },
  "UAB Blazers":                   { domain: "uabsports.com",           platform: "sidearm" },
  "UTSA Roadrunners":              { domain: "utsaroadrunners.com",     platform: "sidearm" },
  "Wichita State Shockers":        { domain: "goshockers.com",          platform: "sidearm" },

  // ─── Conference USA ───────────────────────────────────────────────────────
  "FIU Panthers":                  { domain: "fiusports.com",           platform: "sidearm" },
  "Jacksonville State Gamecocks":  { domain: "jsugamecocksports.com",   platform: "sidearm" },
  "Liberty Flames":                { domain: "libertyflames.com",       platform: "sidearm" },
  "Louisiana Tech Bulldogs":       { domain: "latechsports.com",        platform: "sidearm" },
  "Middle Tennessee Blue Raiders": { domain: "goblueraiders.com",       platform: "sidearm" },
  "New Mexico State Aggies":       { domain: "nmstatesports.com",       platform: "sidearm" },
  "Sam Houston Bearkats":          { domain: "gobearkats.com",          platform: "sidearm" },
  "UTEP Miners":                   { domain: "utepathletics.com",       platform: "sidearm" },
  "Western Kentucky Hilltoppers":  { domain: "wkusports.com",           platform: "sidearm" },

  // ─── Southern Conference ──────────────────────────────────────────────────
  "Campbell Fighting Camels":      { domain: "gocamels.com",            platform: "sidearm" },
  "Citadel Bulldogs":              { domain: "citadelsports.com",       platform: "sidearm" },
  "East Tennessee State Buccaneers":{ domain: "etsubucs.com",           platform: "sidearm" },
  "Furman Paladins":               { domain: "furmanpaladins.com",      platform: "sidearm" },
  "Mercer Bears":                  { domain: "mercerbears.com",         platform: "sidearm" },
  "Samford Bulldogs":              { domain: "samfordsports.com",       platform: "sidearm" },
  "UNC Greensboro Spartans":       { domain: "uncgspartans.com",        platform: "sidearm" },
  "VMI Keydets":                   { domain: "vmikeydets.com",          platform: "sidearm" },
  "Western Carolina Catamounts":   { domain: "catamountsports.com",     platform: "sidearm" },
  "Wofford Terriers":              { domain: "woffordterriers.com",     platform: "sidearm" },

  // ─── ASUN ─────────────────────────────────────────────────────────────────
  "Eastern Kentucky Colonels":     { domain: "ekusports.com",           platform: "sidearm" },
  "Kennesaw State Owls":           { domain: "ksuowls.com",             platform: "sidearm" },
  "Lipscomb Bisons":               { domain: "lipscombsports.com",      platform: "sidearm" },
  "North Alabama Lions":           { domain: "roarlions.com",           platform: "sidearm" },
  "Northern Kentucky Norse":       { domain: "nkunorse.com",            platform: "sidearm" },
  "Stetson Hatters":               { domain: "stetsonathletics.com",    platform: "sidearm" },
  "USC Upstate Spartans":          { domain: "upstatespartans.com",     platform: "sidearm" },

  // ─── Big West ─────────────────────────────────────────────────────────────
  "Cal Poly Mustangs":             { domain: "gopoly.com",              platform: "sidearm" },
  "Cal State Fullerton Titans":    { domain: "fullertontitans.com",     platform: "sidearm" },
  "Cal State Northridge Matadors": { domain: "gomatadors.com",          platform: "sidearm" },
  "Hawaii Rainbow Warriors":       { domain: "hawaiiathletics.com",     platform: "sidearm" },
  "Long Beach State Dirtbags":     { domain: "longbeachstate.com",      platform: "sidearm" },
  "UC Davis Aggies":               { domain: "ucdavisaggies.com",       platform: "sidearm" },
  "UC Irvine Anteaters":           { domain: "ucirvinesports.com",      platform: "sidearm" },
  "UC Riverside Highlanders":      { domain: "ucrathletics.com",        platform: "sidearm" },
  "UC Santa Barbara Gauchos":      { domain: "ucsbgauchos.com",         platform: "sidearm" },

  // ─── Mountain West ────────────────────────────────────────────────────────
  "Air Force Falcons":             { domain: "goairforcefalcons.com",   platform: "sidearm" },
  "Fresno State Bulldogs":         { domain: "gobulldogs.com",          platform: "sidearm" },
  "Nevada Wolf Pack":              { domain: "nevadawolfpack.com",      platform: "sidearm" },
  "San Diego State Aztecs":        { domain: "goaztecs.com",            platform: "sidearm" },
  "San Jose State Spartans":       { domain: "sjsuspartans.com",        platform: "sidearm" },
  "UNLV Rebels":                   { domain: "unlvrebels.com",          platform: "sidearm" },

  // ─── Top Mid-Majors ───────────────────────────────────────────────────────
  "Dallas Baptist Patriots":       { domain: "dbupat.com",              platform: "sidearm" },
  "Elon Phoenix":                  { domain: "elonphoenix.com",         platform: "sidearm" },
  "Grand Canyon Antelopes":        { domain: "gculopes.com",            platform: "sidearm" },
  "High Point Panthers":           { domain: "highpointpanthers.com",   platform: "sidearm" },
  "Oral Roberts Golden Eagles":    { domain: "orugoldeneagles.com",     platform: "sidearm" },
  "Stephen F. Austin Lumberjacks": { domain: "sfajacks.com",            platform: "sidearm" },
  "UT Arlington Mavericks":        { domain: "utamavs.com",             platform: "sidearm" },
  "Wright State Raiders":          { domain: "wsuraiders.com",          platform: "sidearm" },
};

// ESPN sometimes uses shorter/different names - map them to our keys
const ESPN_NAME_MAP = {
  "Coastal Carolina":    "Coastal Carolina Chanticleers",
  "Ole Miss":            "Ole Miss Rebels",
  "LSU":                 "LSU Tigers",
  "TCU":                 "TCU Horned Frogs",
  "UCF":                 "UCF Knights",
  "FAU":                 "FAU Owls",
  "FIU":                 "FIU Panthers",
  "UTSA":                "UTSA Roadrunners",
  "UTEP":                "UTEP Miners",
  "UAB":                 "UAB Blazers",
  "ECU":                 "East Carolina Pirates",
  "App State":           "App State Mountaineers",
  "Southern Miss":       "Southern Miss Golden Eagles",
  "Georgia Southern":    "Georgia Southern Eagles",
  "Georgia State":       "Georgia State Panthers",
  "James Madison":       "James Madison Dukes",
  "South Alabama":       "South Alabama Jaguars",
  "Louisiana":           "Louisiana Ragin Cajuns",
  "Sam Houston":         "Sam Houston Bearkats",
  "Middle Tennessee":    "Middle Tennessee Blue Raiders",
  "Western Kentucky":    "Western Kentucky Hilltoppers",
  "Louisiana Tech":      "Louisiana Tech Bulldogs",
  "New Mexico State":    "New Mexico State Aggies",
  "Kennesaw State":      "Kennesaw State Owls",
  "North Alabama":       "North Alabama Lions",
  "Northern Kentucky":   "Northern Kentucky Norse",
  "Cal Poly":            "Cal Poly Mustangs",
  "Cal State Fullerton": "Cal State Fullerton Titans",
  "CSUN":                "Cal State Northridge Matadors",
  "Long Beach State":    "Long Beach State Dirtbags",
  "UC Davis":            "UC Davis Aggies",
  "UC Irvine":           "UC Irvine Anteaters",
  "UC Riverside":        "UC Riverside Highlanders",
  "UC Santa Barbara":    "UC Santa Barbara Gauchos",
  "Air Force":           "Air Force Falcons",
  "Fresno State":        "Fresno State Bulldogs",
  "Nevada":              "Nevada Wolf Pack",
  "UNLV":                "UNLV Rebels",
  "San Jose State":      "San Jose State Spartans",
  "Texas A&M":           "Texas A&M Aggies",
  "USC":                 "USC Trojans",
  "BYU":                 "BYU Cougars",
  "SMU":                 "SMU Mustangs",
  "ETSU":                "East Tennessee State Buccaneers",
  "UNC Greensboro":      "UNC Greensboro Spartans",
  "Western Carolina":    "Western Carolina Catamounts",
  "Grand Canyon":        "Grand Canyon Antelopes",
  "Dallas Baptist":      "Dallas Baptist Patriots",
  "Oral Roberts":        "Oral Roberts Golden Eagles",
  "Stephen F. Austin":   "Stephen F. Austin Lumberjacks",
  "UT Arlington":        "UT Arlington Mavericks",
  "Wright State":        "Wright State Raiders",
  "High Point":          "High Point Panthers",
  "Elon":                "Elon Phoenix",
};

function getSchool(teamName) {
  if (!teamName) return null;
  if (SCHOOLS[teamName]) return SCHOOLS[teamName];
  const mapped = ESPN_NAME_MAP[teamName];
  if (mapped && SCHOOLS[mapped]) return SCHOOLS[mapped];
  // Fuzzy: try to find a key that starts with the team name
  for (const [key, val] of Object.entries(SCHOOLS)) {
    if (key.toLowerCase().startsWith(teamName.toLowerCase())) return val;
    if (teamName.toLowerCase().startsWith(key.split(' ').slice(0,2).join(' ').toLowerCase())) return val;
  }
  return null;
}

function getSidearmLiveUrl(teamName) {
  const school = getSchool(teamName);
  if (!school || school.platform !== 'sidearm') return null;
  return `https://${school.domain}/sidearmstats/baseball/summary`;
}

module.exports = { SCHOOLS, getSchool, getSidearmLiveUrl };
