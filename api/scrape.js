// api/scrape.js
// Visits each home team's schedule page, finds today's game, grabs the live stats URL
// Called by cron job at 7am Eastern every day
// Results cached in memory (Vercel edge cache) for the day

const fetch = require('node-fetch');
const cheerio = require('cheerio');

// In-memory cache: { "Team Name": { liveStatsUrl, platform, cachedAt } }
const cache = global._diamondLiveStatsCache = global._diamondLiveStatsCache || {};

// School schedule page URLs - Sidearm schools all follow the same pattern
const SCHEDULE_PAGES = {
  // SEC
  "Alabama Crimson Tide":          "https://rolltide.com/sports/baseball/schedule/2026",
  "Arkansas Razorbacks":           "https://arkansasrazorbacks.com/sports/baseball/schedule/2026",
  "Auburn Tigers":                 "https://auburntigers.com/sports/baseball/schedule/2026",
  "Florida Gators":                "https://floridagators.com/sports/baseball/schedule/2026",
  "Georgia Bulldogs":              "https://georgiadogs.com/sports/baseball/schedule/2026",
  "Kentucky Wildcats":             "https://ukathletics.com/sports/baseball/schedule/2026",
  "LSU Tigers":                    "https://lsusports.net/sports/baseball/schedule/2026",
  "Mississippi State Bulldogs":    "https://hailstate.com/sports/baseball/schedule/2026",
  "Missouri Tigers":               "https://mutigers.com/sports/baseball/schedule/2026",
  "Ole Miss Rebels":               "https://olemisssports.com/sports/baseball/schedule/2026",
  "Oklahoma Sooners":              "https://soonersports.com/sports/baseball/schedule/2026",
  "South Carolina Gamecocks":      "https://gamecocksonline.com/sports/baseball/schedule/2026",
  "Tennessee Volunteers":          "https://utsports.com/sports/baseball/schedule/2026",
  "Texas A&M Aggies":              "https://12thman.com/sports/baseball/schedule/2026",
  "Texas Longhorns":               "https://texassports.com/sports/baseball/schedule/2026",
  "Vanderbilt Commodores":         "https://vucommodores.com/sports/baseball/schedule/2026",
  // ACC
  "Boston College Eagles":         "https://bceagles.com/sports/baseball/schedule/2026",
  "Clemson Tigers":                "https://clemsontigers.com/sports/baseball/schedule/2026",
  "Duke Blue Devils":              "https://goduke.com/sports/baseball/schedule/2026",
  "Florida State Seminoles":       "https://seminoles.com/sports/baseball/schedule/2026",
  "Georgia Tech Yellow Jackets":   "https://ramblinwreck.com/sports/baseball/schedule/2026",
  "Louisville Cardinals":          "https://gocards.com/sports/baseball/schedule/2026",
  "Miami Hurricanes":              "https://hurricanesports.com/sports/baseball/schedule/2026",
  "NC State Wolfpack":             "https://gopack.com/sports/baseball/schedule/2026",
  "North Carolina Tar Heels":      "https://goheels.com/sports/baseball/schedule/2026",
  "Notre Dame Fighting Irish":     "https://und.com/sports/baseball/schedule/2026",
  "Pittsburgh Panthers":           "https://pittPanthers.com/sports/baseball/schedule/2026",
  "SMU Mustangs":                  "https://smumustangs.com/sports/baseball/schedule/2026",
  "Stanford Cardinal":             "https://gostanford.com/sports/baseball/schedule/2026",
  "Syracuse Orange":               "https://cuse.com/sports/baseball/schedule/2026",
  "Virginia Cavaliers":            "https://virginiasports.com/sports/baseball/schedule/2026",
  "Virginia Tech Hokies":          "https://hokiesports.com/sports/baseball/schedule/2026",
  "Wake Forest Demon Deacons":     "https://godeacs.com/sports/baseball/schedule/2026",
  // Big 12
  "Arizona Wildcats":              "https://arizonawildcats.com/sports/baseball/schedule/2026",
  "Arizona State Sun Devils":      "https://thesundevils.com/sports/baseball/schedule/2026",
  "BYU Cougars":                   "https://byucougars.com/sports/baseball/schedule/2026",
  "Baylor Bears":                  "https://baylorbears.com/sports/baseball/schedule/2026",
  "Cincinnati Bearcats":           "https://gobearcats.com/sports/baseball/schedule/2026",
  "Houston Cougars":               "https://uhcougars.com/sports/baseball/schedule/2026",
  "Iowa State Cyclones":           "https://cyclones.com/sports/baseball/schedule/2026",
  "Kansas Jayhawks":               "https://kuathletics.com/sports/baseball/schedule/2026",
  "Kansas State Wildcats":         "https://kstatesports.com/sports/baseball/schedule/2026",
  "Oklahoma State Cowboys":        "https://okstate.com/sports/baseball/schedule/2026",
  "TCU Horned Frogs":              "https://gofrogs.com/sports/baseball/schedule/2026",
  "Texas Tech Red Raiders":        "https://texastech.com/sports/baseball/schedule/2026",
  "UCF Knights":                   "https://ucfknights.com/sports/baseball/schedule/2026",
  "Utah Utes":                     "https://utahutes.com/sports/baseball/schedule/2026",
  "West Virginia Mountaineers":    "https://wvusports.com/sports/baseball/schedule/2026",
  // Big Ten
  "Illinois Fighting Illini":      "https://fightingillini.com/sports/baseball/schedule/2026",
  "Indiana Hoosiers":              "https://iuhoosiers.com/sports/baseball/schedule/2026",
  "Iowa Hawkeyes":                 "https://hawkeyesports.com/sports/baseball/schedule/2026",
  "Maryland Terrapins":            "https://umterps.com/sports/baseball/schedule/2026",
  "Michigan Wolverines":           "https://mgoblue.com/sports/baseball/schedule/2026",
  "Michigan State Spartans":       "https://msuspartans.com/sports/baseball/schedule/2026",
  "Minnesota Golden Gophers":      "https://gophersports.com/sports/baseball/schedule/2026",
  "Nebraska Cornhuskers":          "https://huskers.com/sports/baseball/schedule/2026",
  "Northwestern Wildcats":         "https://nusports.com/sports/baseball/schedule/2026",
  "Ohio State Buckeyes":           "https://ohiostatebuckeyes.com/sports/baseball/schedule/2026",
  "Oregon Ducks":                  "https://goducks.com/sports/baseball/schedule/2026",
  "Penn State Nittany Lions":      "https://gopsusports.com/sports/baseball/schedule/2026",
  "Purdue Boilermakers":           "https://purduesports.com/sports/baseball/schedule/2026",
  "Rutgers Scarlet Knights":       "https://scarletknights.com/sports/baseball/schedule/2026",
  "UCLA Bruins":                   "https://uclabruins.com/sports/baseball/schedule/2026",
  "USC Trojans":                   "https://usctrojans.com/sports/baseball/schedule/2026",
  "Washington Huskies":            "https://gohuskies.com/sports/baseball/schedule/2026",
  // Sun Belt
  "App State Mountaineers":        "https://appstatesports.com/sports/baseball/schedule/2026",
  "Arkansas State Red Wolves":     "https://astateredwolves.com/sports/baseball/schedule/2026",
  "Coastal Carolina Chanticleers": "https://goccusports.com/sports/baseball/schedule/2026",
  "Georgia Southern Eagles":       "https://georgiasoutherneagles.com/sports/baseball/schedule/2026",
  "Georgia State Panthers":        "https://georgiastatesports.com/sports/baseball/schedule/2026",
  "James Madison Dukes":           "https://jmusports.com/sports/baseball/schedule/2026",
  "Louisiana Ragin Cajuns":        "https://ragincajuns.com/sports/baseball/schedule/2026",
  "Marshall Thundering Herd":      "https://herdzone.com/sports/baseball/schedule/2026",
  "Old Dominion Monarchs":         "https://odusports.com/sports/baseball/schedule/2026",
  "South Alabama Jaguars":         "https://usajaguars.com/sports/baseball/schedule/2026",
  "Southern Miss Golden Eagles":   "https://southernmiss.com/sports/baseball/schedule/2026",
  "Texas State Bobcats":           "https://txstatebobcats.com/sports/baseball/schedule/2026",
  "Troy Trojans":                  "https://troytrojans.com/sports/baseball/schedule/2026",
  // American
  "Charlotte 49ers":               "https://charlotte49ers.com/sports/baseball/schedule/2026",
  "East Carolina Pirates":         "https://ecupirates.com/sports/baseball/schedule/2026",
  "FAU Owls":                      "https://fausports.com/sports/baseball/schedule/2026",
  "Memphis Tigers":                "https://gotigersgo.com/sports/baseball/schedule/2026",
  "Navy Midshipmen":               "https://navysports.com/sports/baseball/schedule/2026",
  "Rice Owls":                     "https://riceowls.com/sports/baseball/schedule/2026",
  "South Florida Bulls":           "https://gousfbulls.com/sports/baseball/schedule/2026",
  "Tulane Green Wave":             "https://tulanegreenwave.com/sports/baseball/schedule/2026",
  "UAB Blazers":                   "https://uabsports.com/sports/baseball/schedule/2026",
  "UTSA Roadrunners":              "https://utsaroadrunners.com/sports/baseball/schedule/2026",
  "Wichita State Shockers":        "https://goshockers.com/sports/baseball/schedule/2026",
  // Southern Conference
  "Campbell Fighting Camels":      "https://gocamels.com/sports/baseball/schedule/2026",
  "Citadel Bulldogs":              "https://citadelsports.com/sports/baseball/schedule/2026",
  "East Tennessee State Buccaneers":"https://etsubucs.com/sports/baseball/schedule/2026",
  "Furman Paladins":               "https://furmanpaladins.com/sports/baseball/schedule/2026",
  "Mercer Bears":                  "https://mercerbears.com/sports/baseball/schedule/2026",
  "Samford Bulldogs":              "https://samfordsports.com/sports/baseball/schedule/2026",
  "UNC Greensboro Spartans":       "https://uncgspartans.com/sports/baseball/schedule/2026",
  "VMI Keydets":                   "https://vmikeydets.com/sports/baseball/schedule/2026",
  "Western Carolina Catamounts":   "https://catamountsports.com/sports/baseball/schedule/2026",
  "Wofford Terriers":              "https://woffordterriers.com/sports/baseball/schedule/2026",
  // ASUN
  "Eastern Kentucky Colonels":     "https://ekusports.com/sports/baseball/schedule/2026",
  "Kennesaw State Owls":           "https://ksuowls.com/sports/baseball/schedule/2026",
  "Lipscomb Bisons":               "https://lipscombsports.com/sports/baseball/schedule/2026",
  "North Alabama Lions":           "https://roarlions.com/sports/baseball/schedule/2026",
  "Stetson Hatters":               "https://stetsonathletics.com/sports/baseball/schedule/2026",
  "USC Upstate Spartans":          "https://upstatespartans.com/sports/baseball/schedule/2026",
  // Mid-Majors
  "Dallas Baptist Patriots":       "https://dbupat.com/sports/baseball/schedule/2026",
  "Elon Phoenix":                  "https://elonphoenix.com/sports/baseball/schedule/2026",
  "Grand Canyon Antelopes":        "https://gculopes.com/sports/baseball/schedule/2026",
  "High Point Panthers":           "https://highpointpanthers.com/sports/baseball/schedule/2026",
  "Oral Roberts Golden Eagles":    "https://orugoldeneagles.com/sports/baseball/schedule/2026",
  "Sam Houston Bearkats":          "https://gobearkats.com/sports/baseball/schedule/2026",
};

// Get today's date string in multiple formats for matching
function getTodayStrings() {
  const now = new Date();
  const eastern = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const month = eastern.getMonth() + 1;
  const day = eastern.getDate();
  const year = eastern.getFullYear();
  return [
    `${month}/${day}/${year}`,           // 2/21/2026
    `${month}/${day}`,                    // 2/21
    `Feb. ${day}`,                        // Feb. 21
    `Feb ${day}`,                         // Feb 21
    `February ${day}`,                    // February 21
    `0${month}/${day < 10 ? '0'+day : day}/${year}`, // 02/21/2026
  ];
}

// Scrape a school's schedule page and find today's live stats link
async function scrapeSchoolSchedule(teamName, scheduleUrl) {
  try {
    const res = await fetch(scheduleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 8000,
    });

    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    const todayStrings = getTodayStrings();

    // Strategy 1: Find any link containing "Live Stats", "live stats", "Stats" near today's date
    let liveStatsUrl = null;

    // Look for schedule rows/items that contain today's date
    $('[class*="schedule"], [class*="game"], [class*="event"], li, tr').each((i, el) => {
      const text = $(el).text();
      const isToday = todayStrings.some(d => text.includes(d));
      if (!isToday) return;

      // Found today's game row - look for live stats link
      $(el).find('a').each((j, link) => {
        const href = $(link).attr('href') || '';
        const linkText = $(link).text().toLowerCase();
        if (
          linkText.includes('live stats') ||
          linkText.includes('live stat') ||
          linkText.includes('stats') ||
          href.includes('statbroadcast') ||
          href.includes('sidearmstats') ||
          href.includes('liveStats') ||
          href.includes('livestats')
        ) {
          liveStatsUrl = href.startsWith('http') ? href : new URL(href, scheduleUrl).href;
          return false; // break
        }
      });

      if (liveStatsUrl) return false; // break outer loop
    });

    // Strategy 2: If no date match, look for any live stats link on the page
    // that points to statbroadcast or sidearmstats (likely today's game)
    if (!liveStatsUrl) {
      $('a').each((i, link) => {
        const href = $(link).attr('href') || '';
        const linkText = $(link).text().toLowerCase();
        if (
          (linkText.includes('live stats') || linkText.includes('live stat')) &&
          (href.includes('statbroadcast') || href.includes('sidearmstats') || href.includes('liveStats'))
        ) {
          liveStatsUrl = href.startsWith('http') ? href : new URL(href, scheduleUrl).href;
          return false;
        }
      });
    }

    if (!liveStatsUrl) return null;

    // Determine platform
    const platform = liveStatsUrl.includes('statbroadcast') ? 'statbroadcast' : 'sidearm';

    return { liveStatsUrl, platform };
  } catch (err) {
    console.error(`Scrape failed for ${teamName}:`, err.message);
    return null;
  }
}

// Scrape all schools for today's games
async function scrapeAll(homeTeams) {
  const results = {};
  const today = new Date().toDateString();

  // Only scrape schools that are playing today
  const toScrape = homeTeams.filter(name => SCHEDULE_PAGES[name]);

  // Scrape in batches of 10 to avoid overwhelming servers
  for (let i = 0; i < toScrape.length; i += 10) {
    const batch = toScrape.slice(i, i + 10);
    const batchResults = await Promise.all(
      batch.map(async name => {
        // Check cache first
        if (cache[name] && cache[name].date === today) {
          return { name, result: cache[name] };
        }
        const result = await scrapeSchoolSchedule(name, SCHEDULE_PAGES[name]);
        if (result) {
          cache[name] = { ...result, date: today };
        }
        return { name, result };
      })
    );
    batchResults.forEach(({ name, result }) => {
      if (result) results[name] = result;
    });
  }

  return results;
}

// Get cached result for a single team
function getCached(teamName) {
  const today = new Date().toDateString();
  const cached = cache[teamName];
  if (cached && cached.date === today) return cached;
  return null;
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    // Get list of home teams to scrape from query param
    const teams = req.query.teams ? req.query.teams.split(',') : Object.keys(SCHEDULE_PAGES);
    const results = await scrapeAll(teams);

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      scraped: Object.keys(results).length,
      results,
    });
  } catch (err) {
    console.error('Scrape API error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports.scrapeAll = scrapeAll;
module.exports.getCached = getCached;
module.exports.SCHEDULE_PAGES = SCHEDULE_PAGES;
