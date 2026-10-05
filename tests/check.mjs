import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {calculateStay,localISO} from '../demos/casa-sol/logic.js';
import {setQuantity,sanitizeCart,cartTotals} from '../demos/morrow/logic.js';
import {seedInvoices,rupees,normalizeInvoice,filterInvoices,invoiceTotals,invoiceCSV} from '../demos/ledger-lane/logic.js';
const today='2026-10-05';
assert.deepEqual(calculateStay({arrival:today,departure:'2026-10-08',suite:'courtyard',guests:2},today),{name:'Courtyard room',nights:3,guests:2,rate:18000,subtotal:54000,serviceCharge:5400,total:59400});
assert.equal(calculateStay({arrival:'2028-02-28',departure:'2028-03-01',suite:'garden',guests:4},today).nights,2);
for(const patch of [{departure:today},{arrival:'2026-02-30'},{arrival:'2026-10-04'},{guests:3},{suite:'__proto__'},{departure:'2026-11-10'}])assert.throws(()=>calculateStay({arrival:today,departure:'2026-10-08',suite:'courtyard',guests:2,...patch},today));
assert.equal(localISO(new Date(2026,0,2)),'2026-01-02');
assert.deepEqual(sanitizeCart({cup:2,bowl:-1,pitcher:1.5,unknown:5}),{cup:2});
assert.deepEqual(sanitizeCart(null),{});
assert.deepEqual(setQuantity({cup:1},'cup',0),{});
assert.throws(()=>setQuantity({},'cup',11));
assert.throws(()=>setQuantity({},'unknown',1));
assert.deepEqual(cartTotals({}),{count:0,subtotal:0,shipping:0,total:0});
assert.deepEqual(cartTotals({cup:2}),{count:2,subtotal:5600,shipping:900,total:6500});
assert.equal(cartTotals({bowl:1,pitcher:1}).shipping,0);
assert.deepEqual(invoiceTotals(seedInvoices,today),{count:9,collected:23800000,outstanding:15800000,overdue:7600000,paidCount:4,openCount:5,overdueCount:2});
assert.equal(rupees(125050),'₹1,250.50');
assert.equal(filterInvoices(seedInvoices,{query:'FINCH',period:'all',status:'paid',today}).length,1);
assert.equal(filterInvoices(seedInvoices,{period:'2026-09',status:'overdue',today}).length,2);
assert.equal(filterInvoices(seedInvoices,{query:'no such client',today}).length,0);
assert.throws(()=>normalizeInvoice({...seedInvoices[0],amount:NaN}));
assert.throws(()=>normalizeInvoice({...seedInvoices[0],due:'2026-06-01'}));
assert.throws(()=>normalizeInvoice({...seedInvoices[0],issued:'2026-02-30'}));
assert.throws(()=>normalizeInvoice({...seedInvoices[0],status:'unlisted'}));
assert.throws(()=>normalizeInvoice({...seedInvoices[0],client:'  '}));
const protectedCSV=invoiceCSV([{...seedInvoices[0],client:' =2+2',service:'A "quoted", project'}],today);
assert(protectedCSV.includes('"\' =2+2"'));
assert(protectedCSV.includes('"A ""quoted"", project"'));
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
async function files(folder){const result=[];for(const entry of await readdir(folder,{withFileTypes:true})){if(entry.name==='.git')continue;const path=resolve(folder,entry.name);if(entry.isDirectory())result.push(...await files(path));else result.push(path);}return result;}
for(const path of await files(root)){
  if(!/\.(html|css)$/.test(path))continue;
  const source=await readFile(path,'utf8');
  const references=path.endsWith('.html')?[...source.matchAll(/(?:href|src)="([^"#]+)"/g)].map(m=>m[1]):[...source.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(m=>m[1]);
  for(const reference of references){if(/^(https?:|data:|mailto:)/.test(reference))continue;const target=resolve(dirname(path),decodeURIComponent(reference.split('#')[0]));await assert.doesNotReject(()=>stat(target),`${path} has a broken local reference: ${reference}`);}
}
console.log('PASS: stay pricing/date/capacity validation; cart totals/storage validation; invoice totals/filters/input validation; CSV formula protection; every local page and asset reference.');
