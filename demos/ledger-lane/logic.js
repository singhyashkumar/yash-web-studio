export const seedInvoices = [
 {id:'INV-026',client:'Northline Studio',service:'Landing page',amount:5400000,issued:'2026-07-02',due:'2026-07-16',status:'paid'},
 {id:'INV-027',client:'Finch & Fern',service:'Storefront interface',amount:7800000,issued:'2026-08-03',due:'2026-08-17',status:'paid'},
 {id:'INV-028',client:'Casa West',service:'Hospitality website',amount:4500000,issued:'2026-09-01',due:'2026-09-15',status:'paid'},
 {id:'INV-029',client:'Fieldwork Co.',service:'Operations dashboard',amount:6100000,issued:'2026-09-10',due:'2026-09-24',status:'paid'},
 {id:'INV-030',client:'Marlow Supply',service:'Product landing page',amount:3600000,issued:'2026-07-20',due:'2026-11-20',status:'sent'},
 {id:'INV-031',client:'Sage Interiors',service:'Portfolio updates',amount:2800000,issued:'2026-08-25',due:'2026-12-10',status:'sent'},
 {id:'INV-032',client:'Common Ground',service:'Event landing page',amount:3200000,issued:'2026-09-14',due:'2026-09-28',status:'sent'},
 {id:'INV-033',client:'The Corner Cafe',service:'Responsive fixes',amount:1800000,issued:'2026-09-22',due:'2026-10-20',status:'sent'},
 {id:'INV-034',client:'Paperplane Works',service:'Business dashboard',amount:4400000,issued:'2026-09-07',due:'2026-09-21',status:'sent'}
];
export const rupees = cents => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:cents%100?2:0,maximumFractionDigits:2}).format(cents/100);
export function validDate(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const date=new Date(value+'T00:00:00Z');return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;
}
export function normalizeInvoice(value){
  if(!value || typeof value!=='object')throw new Error('Enter an invoice.');
  const {id,client,service,amount,issued,due,status}=value;
  if(typeof id!=='string'||!/^[-\w]{1,50}$/.test(id))throw new Error('Invalid invoice reference.');
  if(typeof client!=='string'||!client.trim()||client.length>100)throw new Error('Enter a client name of up to 100 characters.');
  if(typeof service!=='string'||!service.trim()||service.length>120)throw new Error('Enter a project of up to 120 characters.');
  if(!Number.isSafeInteger(amount)||amount<1||amount>100000000)throw new Error('Enter an amount from INR 0.01 to INR 1,000,000.');
  if(!validDate(issued)||!validDate(due)||due<issued)throw new Error('Use valid dates, with the due date on or after the issue date.');
  if(status!=='paid'&&status!=='sent')throw new Error('Choose a listed invoice status.');
  return {id,client:client.trim(),service:service.trim(),amount,issued,due,status};
}
export function effectiveStatus(invoice,today){return invoice.status==='paid'?'paid':invoice.due<today?'overdue':'sent';}
export function filterInvoices(invoices,{query='',period='all',status='all',today}){
  const search=query.trim().toLowerCase();
  return invoices.filter(inv=>(period==='all'||inv.issued.startsWith(period))&&(!search||`${inv.id} ${inv.client} ${inv.service}`.toLowerCase().includes(search))&&(status==='all'||(status==='open'?inv.status!=='paid':effectiveStatus(inv,today)===status)));
}
export function invoiceTotals(invoices,today){
  return invoices.reduce((total,inv)=>{total.count++;if(inv.status==='paid'){total.collected+=inv.amount;total.paidCount++;}else{total.outstanding+=inv.amount;total.openCount++;if(effectiveStatus(inv,today)==='overdue'){total.overdue+=inv.amount;total.overdueCount++;}}return total;},{count:0,collected:0,outstanding:0,overdue:0,paidCount:0,openCount:0,overdueCount:0});
}
function csvCell(value){
  let text=String(value);
  // Spreadsheet programs can execute formula-looking text; prefix it before quoting.
  if(/^[\s\uFEFF]*[=+@\-]/.test(text)||/^[\t\r\n]/.test(text))text="'"+text;
  return '"'+text.replaceAll('"','""')+'"';
}
export function invoiceCSV(invoices,today){
  const rows=[['Invoice','Client','Project','Amount (INR)','Issued','Due','Status'],...invoices.map(inv=>[inv.id,inv.client,inv.service,(inv.amount/100).toFixed(2),inv.issued,inv.due,effectiveStatus(inv,today)])];
  return rows.map(row=>row.map(csvCell).join(',')).join('\r\n');
}
