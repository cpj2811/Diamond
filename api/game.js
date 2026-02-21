// api/game.js
// Fetches full box score and scoring plays from StatBroadcast
// Falls back to ESPN summary if no StatBroadcast ID available

const fetch = require('node-fetch');

async function fetchStatBroadcast(sbId) {
  // StatBroadcast exposes a JSON feed at this endpoint
  const urls = [
    `https://stats.statbroadcast.com/broadcast/json/?id=${sbId}`,
    `https://www.statbroadcast.com/events/xml.php?id=${sbId}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; DiamondBaseball/1.0)',
          'Referer': `https://stats.statbroadcast.com/broadcast/?id=${sbId}`,
        },
        timeout: 8000,
      });
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 50) return { url, text };
      }
    } catch (e) {
      continue;
    }
  }
  return null;
}

function parseStatBroadcastResponse(raw) {
  if (!raw) return null;
  const { url, text } = raw;

  // Try JSON first
  if (url.includes('json')) {
    try {
      const data = JSON.parse(text);
      return parseStatBroadcastJSON(data);
    } catch {}
  }

  // Fall back to XML parsing
  return parseStatBroadcastXML(text);
}

function parseStatBroadcastJSON(data) {
  if (!data) return null;
  try {
    // StatBroadcast JSON structure varies by version
    // Common fields: game, teams, plays, innings
    const game = data.game || data;
    const teams = game.teams || game.team || [];
    const plays = game.plays || game.scoringPlays || [];

    const awayTeam = Array.isArray(teams) ? teams.find(t => t.id === 'V' || t.homeAway === 'away' || t.side === 'away') : teams.away;
    const homeTeam = Array.isArray(teams) ? teams.find(t => t.id === 'H' || t.homeAway === 'home' || t.side === 'home') : teams.home;

    // Batting lineups
    const parseBatters = (team) => {
      if (!team) return [];
      const batters = team.batters || team.batting || team.players || [];
      return batters.map(b => ({
        name: b.name || b.playerName || '',
        pos: b.pos || b.position || '',
        ab: b.ab || b.atBats || '0',
        r: b.r || b.runs || '0',
        h: b.h || b.hits || '0',
        rbi: b.rbi || '0',
        bb: b.bb || b.walks || '0',
        so: b.so || b.strikeouts || '0',
        avg: b.avg || b.battingAvg || '.000',
      }));
    };

    // Pitching
    const parsePitchers = (team) => {
      if (!team) return [];
      const pitchers = team.pitchers || team.pitching || [];
      return pitchers.map(p => ({
        name: p.name || p.playerName || '',
        ip: p.ip || p.inningsPitched || '0.0',
        h: p.h || p.hits || '0',
        r: p.r || p.runs || '0',
        er: p.er || p.earnedRuns || '0',
        bb: p.bb || p.walks || '0',
        so: p.so || p.strikeouts || '0',
        era: p.era || '0.00',
        note: p.note || p.decision || '',
      }));
    };

    // Scoring plays
    const scoringPlays = (Array.isArray(plays) ? plays : [])
      .filter(p => p.runs || p.score || p.scoring || parseInt(p.runScored) > 0)
      .map(p => ({
        inning: p.inning || p.inn || '',
        half: p.half || p.side || '',
        text: p.description || p.text || p.play || '',
        awayScore: p.awayScore || p.visitorScore || p.vscore || '',
        homeScore: p.homeScore || p.hmScore || '',
      }));

    // Current situation
    const situation = game.situation || game.current || {};

    return {
      source: 'statbroadcast',
      awayBatters: parseBatters(awayTeam),
      homeBatters: parseBatters(homeTeam),
      awayPitchers: parsePitchers(awayTeam),
      homePitchers: parsePitchers(homeTeam),
      scoringPlays,
      currentBatter: situation.batter || situation.currentBatter || '',
      currentPitcher: situation.pitcher || situation.currentPitcher || '',
      outs: parseInt(situation.outs) || 0,
      bases: [
        !!situation.first || !!situation.base1,
        !!situation.second || !!situation.base2,
        !!situation.third || !!situation.base3,
      ],
    };
  } catch (err) {
    console.error('StatBroadcast JSON parse error:', err.message);
    return null;
  }
}

function parseStatBroadcastXML(xml) {
  if (!xml || xml.length < 50) return null;
  try {
    // Helper to extract tag value
    const tag = (name, scope) => {
      const src = scope || xml;
      const m = src.match(new RegExp(`<${name}[^>]*>([^<]*)<\/${name}>`, 'i'));
      return m ? m[1].trim() : null;
    };

    const tagAll = (name, scope) => {
      const src = scope || xml;
      const matches = [];
      const re = new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\/${name}>`, 'gi');
      let m;
      while ((m = re.exec(src)) !== null) matches.push(m[1]);
      return matches;
    };

    // Scoring plays
    const playBlocks = tagAll('play', xml).concat(tagAll('scoringplay', xml));
    const scoringPlays = playBlocks.map(block => ({
      inning: tag('inning', block) || '',
      half: tag('half', block) || tag('side', block) || '',
      text: tag('description', block) || tag('text', block) || block.replace(/<[^>]+>/g, ' ').trim().slice(0, 200),
      awayScore: tag('vscore', block) || tag('awayscore', block) || '',
      homeScore: tag('hscore', block) || tag('homescore', block) || '',
    })).filter(p => p.text);

    // Batters
    const parseBatterBlocks = (teamId) => {
      const teamPattern = new RegExp(`<team[^>]*id="${teamId}"[^>]*>([\\s\\S]*?)<\/team>`, 'i');
      const teamBlock = xml.match(teamPattern);
      if (!teamBlock) return [];
      const batterBlocks = tagAll('batter', teamBlock[1]);
      return batterBlocks.map(b => ({
        name: tag('name', b) || tag('playername', b) || '',
        pos: tag('pos', b) || '',
        ab: tag('ab', b) || '0',
        r: tag('r', b) || '0',
        h: tag('h', b) || '0',
        rbi: tag('rbi', b) || '0',
        bb: tag('bb', b) || '0',
        so: tag('so', b) || '0',
        avg: tag('avg', b) || '.000',
      })).filter(b => b.name);
    };

    const parsePitcherBlocks = (teamId) => {
      const teamPattern = new RegExp(`<team[^>]*id="${teamId}"[^>]*>([\\s\\S]*?)<\/team>`, 'i');
      const teamBlock = xml.match(teamPattern);
      if (!teamBlock) return [];
      const pitcherBlocks = tagAll('pitcher', teamBlock[1]);
      return pitcherBlocks.map(p => ({
        name: tag('name', p) || '',
        ip: tag('ip', p) || '0.0',
        h: tag('h', p) || '0',
        r: tag('r', p) || '0',
        er: tag('er', p) || '0',
        bb: tag('bb', p) || '0',
        so: tag('so', p) || '0',
        era: tag('era', p) || '0.00',
        note: tag('note', p) || tag('decision', p) || '',
      })).filter(p => p.name);
    };

    // Situation
    const bases1 = tag('first') === '1' || tag('base1') === '1';
    const bases2 = tag('second') === '1' || tag('base2') === '1';
    const bases3 = tag('third') === '1' || tag('base3') === '1';

    return {
      source: 'statbroadcast_xml',
      awayBatters: parseBatterBlocks('V') || parseBatterBlocks('away'),
      homeBatters: parseBatterBlocks('H') || parseBatterBlocks('home'),
      awayPitchers: parsePitcherBlocks('V') || parsePitcherBlocks('away'),
      homePitchers: parsePitcherBlocks('H') || parsePitcherBlocks('home'),
      scoringPlays,
      outs: parseInt(tag('outs')) || 0,
      bases: [bases1, bases2, bases3],
      currentBatter: tag('batter') || '',
      currentPitcher: tag('pitcher') || '',
    };
  } catch (err) {
    console.error('StatBroadcast XML parse error:', err.message);
    return null;
  }
}

async function fetchESPNDetail(espnId) {
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball/summary?event=${espnId}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DiamondBaseball/1.0)' },
      timeout: 8000,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

function parseESPNDetail(data) {
  if (!data) return null;
  try {
    const parseAthletes = (players, statIdx) => {
      return (players || []).map(p => {
        const stats = p.stats || [];
        return { name: p.athlete?.displayName || '', ...Object.fromEntries(statIdx.map((k, i) => [k, stats[i] || '-'])) };
      });
    };

    const awayPlayers = data.boxscore?.players?.[0];
    const homePlayers = data.boxscore?.players?.[1];

    const battingKeys = ['ab','r','h','rbi','bb','so','avg'];
    const pitchingKeys = ['ip','h','r','er','bb','so','era'];

    const awayBatters = parseAthletes(awayPlayers?.statistics?.[0]?.athletes, battingKeys);
    const homeBatters = parseAthletes(homePlayers?.statistics?.[0]?.athletes, battingKeys);
    const awayPitchers = parseAthletes(awayPlayers?.statistics?.[1]?.athletes, pitchingKeys);
    const homePitchers = parseAthletes(homePlayers?.statistics?.[1]?.athletes, pitchingKeys);

    // ESPN doesn't provide scoring plays for college baseball well
    // but we can pull from plays if available
    const scoringPlays = (data.plays || [])
      .filter(p => p.scoreValue > 0)
      .slice(-20)
      .reverse()
      .map(p => ({
        inning: p.period?.number || '',
        half: p.period?.type || '',
        text: p.text || '',
        awayScore: '',
        homeScore: '',
      }));

    return { source: 'espn', awayBatters, homeBatters, awayPitchers, homePitchers, scoringPlays };
  } catch { return null; }
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { id, espnId, sbId } = req.query;

  try {
    let detail = null;

    // Try StatBroadcast first (has real box scores + scoring plays)
    const statbroadcastId = sbId || (id?.startsWith('sb_') ? id.replace('sb_', '') : null);
    if (statbroadcastId) {
      const raw = await fetchStatBroadcast(statbroadcastId);
      detail = parseStatBroadcastResponse(raw);
    }

    // Fall back to ESPN for batting/pitching lineups
    if (!detail || (!detail.awayBatters?.length && !detail.scoringPlays?.length)) {
      const eid = espnId || (id?.startsWith('espn_') ? id.replace('espn_', '') : null);
      if (eid) {
        const raw = await fetchESPNDetail(eid);
        const espnDetail = parseESPNDetail(raw);
        if (espnDetail) {
          detail = detail
            ? { ...espnDetail, ...detail, scoringPlays: detail.scoringPlays?.length ? detail.scoringPlays : espnDetail.scoringPlays }
            : espnDetail;
        }
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');
    res.status(200).json({ success: true, detail });
  } catch (err) {
    console.error('Game detail error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
