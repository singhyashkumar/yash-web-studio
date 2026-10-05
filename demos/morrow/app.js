import {products,money,sanitizeCart,setQuantity,cartTotals} from './logic.js';
let cart={};try{cart=sanitizeCart(JSON.parse(localStorage.getItem('morrow-cart-v1')||'{}'));}catch{}
let category='all', currentProduct='pitcher';
const cartDialog=document.querySelector('#cart-dialog'), detailsDialog=document.querySelector('#details-dialog'), orderDialog=document.querySelector('#order-dialog');
const status=document.querySelector('#shop-status');
function persist(){try{localStorage.setItem('morrow-cart-v1',JSON.stringify(cart));}catch{status.textContent='Your bag works for this visit; browser storage is unavailable.';}renderCart();}
function add(id){
  try{cart=setQuantity(cart,id,(cart[id]||0)+1);persist();status.textContent=`${products[id].name} added to your bag.`;}
  catch{status.textContent='The demo allows up to 10 of each piece.';}
}
function renderProducts(){
  const entries=Object.values(products).filter(p=>category==='all'||p.category===category);
  const sort=document.querySelector('#sort').value;
  if(sort!=='featured')entries.sort((a,b)=>sort==='low'?a.price-b.price:b.price-a.price);
  // All interpolated product fields are fixed local catalog data, never user input.
  document.querySelector('#product-grid').innerHTML=entries.map(p=>`<article class="product-card"><div class="product-photo ${p.id}" role="img" aria-label="${p.name} from the original ceramics still life"><span class="product-tag">${p.tag}</span></div><div class="product-title"><h3>${p.name}</h3><span>${money(p.price)}</span></div><p>${p.finish}</p><div class="product-actions"><button class="button" type="button" data-add="${p.id}" aria-label="Add ${p.name} to bag">Add to bag</button><button class="details-button" type="button" data-details="${p.id}" aria-label="Details for ${p.name}">Details</button></div></article>`).join('');
}
function totalsMarkup(totals){return `<div class="cart-total-line"><span>Subtotal</span><span>${money(totals.subtotal)}</span></div><div class="cart-total-line"><span>Shipping estimate</span><span>${totals.shipping?money(totals.shipping):'Free'}</span></div><div class="cart-total-line total"><span>Total</span><strong>${money(totals.total)}</strong></div>`;}
function renderCart(){
  const totals=cartTotals(cart);document.querySelector('#cart-count').textContent=String(totals.count);
  document.querySelector('#open-cart').setAttribute('aria-label',`Open shopping bag, ${totals.count} items`);
  document.querySelector('#cart-items').innerHTML=totals.count?Object.entries(cart).map(([id,quantity])=>`<article class="cart-item"><div class="product-photo ${id}" role="img" aria-label="${products[id].name}"></div><div><h3>${products[id].name}</h3><p class="item-price">${money(products[id].price)} each</p><div class="quantity"><button type="button" data-quantity="${id}" data-step="-1" aria-label="Decrease ${products[id].name} quantity">−</button><span aria-label="${quantity} pieces">${quantity}</span><button type="button" data-quantity="${id}" data-step="1" aria-label="Increase ${products[id].name} quantity" ${quantity>=10?'disabled':''}>+</button></div></div><div><span>${money(products[id].price*quantity)}</span><br><button class="remove-item" type="button" data-remove="${id}" aria-label="Remove ${products[id].name}">Remove</button></div></article>`).join(''):'<div class="cart-empty"><h3>A little room for something good.</h3><p>Your bag is empty. Explore the collection and add a piece.</p></div>';
  document.querySelector('#cart-summary').innerHTML=totals.count?`<p class="cart-summary-note">Free shipping estimate on orders of $120 or more.</p>${totalsMarkup(totals)}`:'';
  document.querySelector('#preview-order').disabled=!totals.count;
}
document.querySelector('.filters').addEventListener('click',event=>{
  const button=event.target.closest('[data-filter]');if(!button)return;category=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  renderProducts();status.textContent=`${document.querySelectorAll('.product-card').length} pieces shown.`;
});
document.querySelector('#sort').addEventListener('change',renderProducts);
document.querySelector('#product-grid').addEventListener('click',event=>{
  const addButton=event.target.closest('[data-add]');if(addButton){add(addButton.dataset.add);return;}
  const details=event.target.closest('[data-details]');if(!details)return;currentProduct=details.dataset.details;
  const product=products[currentProduct];document.querySelector('#details-title').textContent=product.name;
  document.querySelector('#details-copy').textContent=product.description;
  document.querySelector('#details-features').replaceChildren(...product.features.map(text=>Object.assign(document.createElement('li'),{textContent:text})));
  document.querySelector('#details-price').textContent=money(product.price);detailsDialog.showModal();
});
document.querySelector('#open-cart').addEventListener('click',()=>{renderCart();cartDialog.showModal();});
document.querySelector('[data-close-cart]').addEventListener('click',()=>cartDialog.close());
document.querySelector('[data-close-details]').addEventListener('click',()=>detailsDialog.close());
document.querySelector('[data-close-order]').addEventListener('click',()=>orderDialog.close());
document.querySelector('#details-add').addEventListener('click',()=>{add(currentProduct);detailsDialog.close();});
document.querySelector('#cart-items').addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  const id=button.dataset.quantity||button.dataset.remove;
  if(!id)return;
  cart=setQuantity(cart,id,button.dataset.remove?0:(cart[id]||0)+Number(button.dataset.step));persist();
});
document.querySelector('#preview-order').addEventListener('click',()=>{
  const totals=cartTotals(cart);if(!totals.count)return;
  document.querySelector('#order-summary').innerHTML=Object.entries(cart).map(([id,quantity])=>`<div class="order-product"><span>${products[id].name} × ${quantity}</span><span>${money(products[id].price*quantity)}</span></div>`).join('')+totalsMarkup(totals);
  cartDialog.close();orderDialog.showModal();
});
document.querySelector('#download-order').addEventListener('click',()=>{
  const totals=cartTotals(cart);const lines=Object.entries(cart).map(([id,quantity])=>`${products[id].name} x ${quantity}: ${money(products[id].price*quantity)}`);
  const text=['MORROW GOODS - DEMO ORDER PREVIEW','',...lines,'',`Subtotal: ${money(totals.subtotal)}`,`Shipping estimate: ${money(totals.shipping)}`,`Total: ${money(totals.total)}`,'','No real order, payment, or shipment is created.'].join('\n');
  const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
  const link=Object.assign(document.createElement('a'),{href:url,download:'morrow-order-preview.txt'});document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
renderProducts();renderCart();
