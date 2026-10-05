import {seedInvoices,rupees,normalizeInvoice,effectiveStatus,filterInvoices,invoiceTotals,invoiceCSV} from './logic.js';
import {localISO} from '../casa-sol/logic.js';
let invoices=seedInvoices.map(inv=>({...inv}));
try{const stored=JSON.parse(localStorage.getItem('ledger-lane-v1')||'null');if(Array.isArray(stored)){const ids=new Set();const valid=[];for(const record of stored){try{const normalized=normalizeInvoice(record);if(!ids.has(normalized.id)){ids.add(normalized.id);valid.push(normalized);}}catch{}}if(valid.length)invoices=valid;}}catch{}
const period=document.querySelector('#period'), status=document.querySelector('#status'), search=document.querySelector('#search');
const notice=document.querySelector('#app-status');const today=()=>localISO();
function save(){try{localStorage.setItem('ledger-lane-v1',JSON.stringify(invoices));return true;}catch{notice.textContent='Browser storage is unavailable. Changes last only for this visit.';return false;}}
function updatePeriods(){
  const selected=period.value;
  period.replaceChildren(Object.assign(document.createElement('option'),{value:'all',textContent:'All demo records'}),...Array.from(new Set(invoices.map(inv=>inv.issued.slice(0,7)))).sort().map(month=>Object.assign(document.createElement('option'),{value:month,textContent:new Date(month+'-01T12:00:00Z').toLocaleDateString('en-GB',{month:'long',year:'numeric',timeZone:'UTC'})})));
  period.value=Array.from(period.options).some(option=>option.value===selected)?selected:'all';
}
function currentRows(){return filterInvoices(invoices,{query:search.value,period:period.value,status:status.value,today:today()});}
function render(){
  const rows=currentRows(), totals=invoiceTotals(rows,today());
  document.querySelector('#metric-collected').textContent=rupees(totals.collected);
  document.querySelector('#metric-outstanding').textContent=rupees(totals.outstanding);
  document.querySelector('#metric-overdue').textContent=rupees(totals.overdue);
  document.querySelector('#metric-count').textContent=String(totals.count);
  document.querySelector('#collected-detail').textContent=`${totals.paidCount} paid ${totals.paidCount===1?'invoice':'invoices'}`;
  document.querySelector('#outstanding-detail').textContent=`${totals.openCount} awaiting payment`;
  document.querySelector('#overdue-detail').textContent=`${totals.overdueCount} past the due date`;
  document.querySelector('#insight-text').textContent=totals.openCount?`${totals.openCount} invoices in this view are still open. ${totals.overdueCount} ${totals.overdueCount===1?'is':'are'} past the due date. Start with the oldest due date.`:'All invoices in this view are settled. A little more space to focus on the next project.';
  const body=document.querySelector('#invoice-rows');body.replaceChildren(...rows.map(inv=>{
    const row=document.createElement('tr');const fields=[inv.id,inv.client,inv.due,rupees(inv.amount),effectiveStatus(inv,today()),''];
    const cells=fields.map(text=>Object.assign(document.createElement('td'),{textContent:text}));
    cells[1].className='client-cell';cells[1].replaceChildren(Object.assign(document.createElement('span'),{className:'client-name',textContent:inv.client}),Object.assign(document.createElement('span'),{className:'service-name',textContent:inv.service}));
    cells[2].textContent=new Date(inv.due+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
    cells[3].className='amount-cell';const state=effectiveStatus(inv,today());cells[4].replaceChildren(Object.assign(document.createElement('span'),{className:`status-pill ${state}`,textContent:state==='sent'?'Outstanding':state==='paid'?'Paid':'Overdue'}));
    if(inv.status!=='paid'){const button=Object.assign(document.createElement('button'),{type:'button',className:'mark-paid',textContent:'Mark paid'});button.dataset.id=inv.id;button.setAttribute('aria-label',`Mark ${inv.id} for ${inv.client} paid in the demo`);cells[5].append(button);}else cells[5].textContent='—';
    row.append(...cells);return row;
  }));
  document.querySelector('#empty-state').hidden=rows.length>0;
  document.querySelector('#record-count').textContent=`${rows.length} of ${invoices.length} demo invoices shown`;
  const byMonth=new Map();for(const invoice of rows){const key=invoice.issued.slice(0,7);byMonth.set(key,(byMonth.get(key)||0)+(invoice.status==='paid'?invoice.amount:0));}
  const entries=[...byMonth].sort(([a],[b])=>a.localeCompare(b)), max=Math.max(1,...entries.map(([,amount])=>amount));
  const chart=document.querySelector('#chart');chart.replaceChildren(...entries.map(([month,amount])=>{
    const column=Object.assign(document.createElement('div'),{className:'chart-column'});
    const label=new Date(month+'-01T12:00:00Z').toLocaleDateString('en-GB',{month:'short',year:'2-digit',timeZone:'UTC'});
    const bar=Object.assign(document.createElement('span'),{className:'chart-bar'});bar.style.setProperty('--height',`${amount/max*78}%`);
    column.append(Object.assign(document.createElement('span'),{className:'chart-amount',textContent:rupees(amount)}),bar,Object.assign(document.createElement('span'),{className:'chart-label',textContent:label}));return column;
  }));
  chart.setAttribute('aria-label',entries.length?`Collected amounts: ${entries.map(([month,amount])=>`${month}: ${rupees(amount)}`).join('; ')}`:'No paid invoices in this view.');
  if(!entries.length)chart.append(Object.assign(document.createElement('p'),{className:'chart-amount',textContent:'No records in this view.'}));
}
period.addEventListener('change',render);status.addEventListener('change',render);search.addEventListener('input',render);
document.querySelector('#invoice-rows').addEventListener('click',event=>{
  const button=event.target.closest('[data-id]');if(!button)return;
  const invoice=invoices.find(inv=>inv.id===button.dataset.id);if(!invoice)return;invoice.status='paid';const saved=save();render();if(saved)notice.textContent=`${invoice.id} marked paid in this browser's demo. No payment is processed.`;
});
const dialog=document.querySelector('#invoice-dialog'),form=document.querySelector('#invoice-form');
document.querySelector('#new-invoice').addEventListener('click',()=>{
  form.reset();form.elements.issued.value=today();const due=new Date();due.setDate(due.getDate()+14);form.elements.due.value=localISO(due);document.querySelector('#form-error').hidden=true;dialog.showModal();
});
document.querySelector('.close').addEventListener('click',()=>dialog.close());
form.addEventListener('submit',event=>{
  event.preventDefault();const data=Object.fromEntries(new FormData(form));const error=document.querySelector('#form-error');
  try{
    if(!/^\d+(\.\d{1,2})?$/.test(data.amount))throw new Error('Use a positive amount with no more than two decimal places.');
    const invoice=normalizeInvoice({...data,amount:Math.round(Number(data.amount)*100),id:'INV-'+crypto.randomUUID().slice(0,8).toUpperCase()});
    invoices.unshift(invoice);const saved=save();updatePeriods();period.value='all';status.value='all';search.value='';render();dialog.close();if(saved)notice.textContent=`${invoice.id} saved in your local demo workspace.`;
  }catch(problem){error.textContent=problem.message;error.hidden=false;}
});
document.querySelector('#export-csv').addEventListener('click',()=>{
  const rows=currentRows();const url=URL.createObjectURL(new Blob(['\uFEFF'+invoiceCSV(rows,today())],{type:'text/csv;charset=utf-8'}));
  const link=Object.assign(document.createElement('a'),{href:url,download:'ledger-lane-demo-invoices.csv'});document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notice.textContent=`Prepared ${rows.length} demo invoices for download.`;
});
updatePeriods();render();
