#!/usr/bin/env node
/**
 * Pulls the aggregate metrics needed for the Tech for Good proposal.
 * Reads credentials from your local .env files. Prints ONLY aggregates,
 * never credentials, never personal records.
 *
 *   node pull-metrics.mjs
 *
 * Needs: node 18+ (built-in fetch). Firebase section additionally needs
 *   npm i firebase-admin      (only if you want the user counts)
 */

import fs from 'node:fs';
import path from 'node:path';

const CF_ENV = '~/Documents/Personal/lincymathematics/.env';
const FB_ENV = '~/Documents/Projects/my-cycle-safe/.env';
const FB_REPO = '~/Documents/Projects/my-cycle-safe';

// ---------- tiny .env reader (values never printed) ----------
function readEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return out;
}
const pick = (env, ...names) => names.map(n => env[n]).find(Boolean);

const cf = readEnv(CF_ENV);
const fb = readEnv(FB_ENV);

console.log('='.repeat(64));
console.log('  MYCYCLESAFE METRICS  ·  aggregates only');
console.log('='.repeat(64));
console.log(`  CF env  : ${fs.existsSync(CF_ENV) ? Object.keys(cf).length + ' vars' : 'NOT FOUND'}`);
console.log(`  FB env  : ${fs.existsSync(FB_ENV) ? Object.keys(fb).length + ' vars' : 'NOT FOUND'}`);
console.log();

// ============ 1. CLOUDFLARE ============
const CF_TOKEN = pick(cf, 'CLOUDFLARE_API_TOKEN', 'CF_API_TOKEN', 'CLOUDFLARE_TOKEN', 'API_TOKEN');
const CF_ACCOUNT = pick(cf, 'CLOUDFLARE_ACCOUNT_ID', 'CF_ACCOUNT_ID', 'ACCOUNT_ID');

async function cfApi(url) {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${CF_TOKEN}` } });
  return r.json();
}

async function cloudflare() {
  console.log('-'.repeat(64));
  console.log('  CLOUDFLARE');
  console.log('-'.repeat(64));
  if (!CF_TOKEN) {
    console.log('  No Cloudflare token found. Looked for CLOUDFLARE_API_TOKEN,');
    console.log('  CF_API_TOKEN, CLOUDFLARE_TOKEN, API_TOKEN.');
    console.log(`  Vars present in that file: ${Object.keys(cf).join(', ') || '(none)'}`);
    return;
  }

  const zonesRes = await cfApi('https://api.cloudflare.com/client/v4/zones?per_page=50');
  if (!zonesRes.success) {
    console.log('  Token rejected or lacks Zone:Read.', zonesRes.errors?.[0]?.message ?? '');
    return;
  }
  const zones = zonesRes.result ?? [];
  console.log(`  Zones on this account: ${zones.length}`);
  zones.forEach(z => console.log(`    - ${z.name}  (${z.status})`));
  console.log();

  const since = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
  const until = new Date().toISOString().slice(0, 10);

  for (const z of zones) {
    const q = {
      query: `{
        viewer { zones(filter: {zoneTag: "${z.id}"}) {
          httpRequests1dGroups(limit: 31, filter: {date_geq: "${since}", date_lt: "${until}"},
                               orderBy: [date_ASC]) {
            dimensions { date }
            sum { requests pageViews countryMap { clientCountryName requests } }
            uniq { uniques }
          }
        } }
      }`
    };
    const r = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${CF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(q)
    }).then(x => x.json());

    const days = r?.data?.viewer?.zones?.[0]?.httpRequests1dGroups;
    if (!days?.length) {
      const err = r?.errors?.[0]?.message ?? 'no data (analytics may need a paid plan)';
      console.log(`  ${z.name}: ${err}`);
      continue;
    }

    const uniques = days.map(d => d.uniq?.uniques ?? 0);
    const pv = days.map(d => d.sum?.pageViews ?? 0);
    const countries = {};
    days.forEach(d => (d.sum?.countryMap ?? []).forEach(c => {
      countries[c.clientCountryName] = (countries[c.clientCountryName] ?? 0) + c.requests;
    }));
    const totalReq = Object.values(countries).reduce((a, b) => a + b, 0) || 1;
    const top = Object.entries(countries).sort((a, b) => b[1] - a[1]);

    console.log(`  ${z.name}  (last 30 days)`);
    console.log(`    unique visitors, sum of daily : ${uniques.reduce((a, b) => a + b, 0).toLocaleString()}`);
    console.log(`    unique visitors, daily median : ${median(uniques).toLocaleString()}`);
    console.log(`    page views, total             : ${pv.reduce((a, b) => a + b, 0).toLocaleString()}`);
    console.log(`    countries seen                : ${top.length}`);
    console.log(`    India share of requests       : ${((countries['IN'] ?? 0) / totalReq * 100).toFixed(1)}%`);
    console.log(`    top 8 countries:`);
    top.slice(0, 8).forEach(([c, n]) =>
      console.log(`      ${c.padEnd(4)} ${(n / totalReq * 100).toFixed(1).padStart(5)}%  (${n.toLocaleString()})`));
    console.log();
  }
}

const median = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] ?? 0; };

// ============ 2. FIREBASE ============
async function firebase() {
  console.log('-'.repeat(64));
  console.log('  FIREBASE  (the real user numbers)');
  console.log('-'.repeat(64));

  let App, Auth, Firestore;
  try {
    App = await import('firebase-admin/app');
    Auth = await import('firebase-admin/auth');
    Firestore = await import('firebase-admin/firestore');
  } catch {
    console.log('  firebase-admin not installed. Run:  npm i firebase-admin');
    console.log('  (only needed for this section)');
    return;
  }

  // find a service account: env var path, env var JSON, or a file in the repo
  let cred = null, how = '';
  const saPath = pick(fb, 'GOOGLE_APPLICATION_CREDENTIALS', 'FIREBASE_SERVICE_ACCOUNT_PATH', 'SERVICE_ACCOUNT_PATH');
  const saJson = pick(fb, 'FIREBASE_SERVICE_ACCOUNT', 'FIREBASE_SERVICE_ACCOUNT_JSON', 'SERVICE_ACCOUNT_JSON');

  if (saJson) { try { cred = JSON.parse(saJson); how = 'service account JSON in .env'; } catch {} }
  if (!cred && saPath && fs.existsSync(saPath)) { cred = JSON.parse(fs.readFileSync(saPath, 'utf8')); how = 'service account file from .env path'; }
  if (!cred) {
    for (const dir of [path.join(FB_REPO, 'secrets'), FB_REPO]) {
      if (!fs.existsSync(dir)) continue;
      const hit = fs.readdirSync(dir).find(f => f.endsWith('.json') && /service|admin|firebase|adminsdk/i.test(f));
      if (hit) { cred = JSON.parse(fs.readFileSync(path.join(dir, hit), 'utf8')); how = `service account file found in ${path.basename(dir)}/`; break; }
    }
  }
  if (!cred) {
    console.log('  No service account found. The client Firebase config in .env');
    console.log('  (apiKey, projectId, etc.) is public and cannot list users.');
    console.log('  You need an Admin SDK service account JSON:');
    console.log('    Firebase Console > Project settings > Service accounts > Generate new private key');
    console.log('  Then either set GOOGLE_APPLICATION_CREDENTIALS to its path, or drop it in secrets/.');
    return;
  }
  console.log(`  Using ${how}. Project: ${cred.project_id}\n`);

  App.initializeApp({ credential: App.cert(cred) });
  const auth = Auth.getAuth();

  // --- Auth: total users + signups by month ---
  let total = 0, token, byMonth = {}, active30 = 0;
  const cutoff = Date.now() - 30 * 864e5;
  try {
  do {
    const page = await auth.listUsers(1000, token);
    for (const u of page.users) {
      total++;
      const created = u.metadata.creationTime ? new Date(u.metadata.creationTime) : null;
      if (created) {
        const k = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`;
        byMonth[k] = (byMonth[k] ?? 0) + 1;
      }
      const seen = u.metadata.lastSignInTime ? new Date(u.metadata.lastSignInTime).getTime() : 0;
      if (seen > cutoff) active30++;
    }
    token = page.pageToken;
    process.stdout.write(`\r  counting users… ${total.toLocaleString()}`);
  } while (token);
  console.log(`\r  TOTAL REGISTERED USERS        : ${total.toLocaleString()}          `);
  } catch (e) {
    console.log(`  Firebase Auth: ${e.message}`);
    console.log('  -> Authentication is not enabled on this project, so there are');
    console.log('     no registered accounts. Checking Firestore instead.');
  }
  console.log(`  signed in within last 30 days : ${active30.toLocaleString()}  (${(active30 / (total || 1) * 100).toFixed(1)}%)`);
  console.log();
  console.log('  signups by month, last 12:');
  Object.entries(byMonth).sort().slice(-12).forEach(([m, n]) =>
    console.log(`    ${m}  ${String(n).padStart(7)}  ${'#'.repeat(Math.min(40, Math.round(n / Math.max(...Object.values(byMonth)) * 40)))}`));
  console.log();

  // --- Firestore: collection sizes, and the irregular-cycle segment ---
  try {
    const db = Firestore.getFirestore();
    const cols = await db.listCollections();
    console.log(`  Firestore collections: ${cols.map(c => c.id).join(', ') || '(none)'}`);
    for (const c of cols) {
      const n = (await c.count().get()).data().count;
      console.log(`    ${c.id.padEnd(24)} ${n.toLocaleString()} docs`);
    }
    console.log();
    console.log('  NOTE: to size the PMOS audience, count users whose logged cycles');
    console.log('  run over 35 days or vary widely. Tell me your cycle collection and');
    console.log('  field names and I will write that query.');
  } catch (e) {
    console.log(`  Firestore read skipped: ${e.message}`);
  }
}

await cloudflare().catch(e => console.log('  Cloudflare error:', e.message));
console.log();
await firebase().catch(e => console.log('  Firebase error:', e.message));
console.log();
console.log('='.repeat(64));
console.log('  Numbers above are safe to quote. Nothing here identifies a user.');
console.log('='.repeat(64));
