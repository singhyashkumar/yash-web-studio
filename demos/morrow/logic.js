export const products = {
  pitcher:{id:'pitcher',name:'The clay pitcher',price:7200,category:'serve',finish:'Natural terracotta · 1.2 L',description:'A sculptural pitcher with an easy-to-hold handle and a warm, unglazed exterior.',features:['1.2 litre capacity','Food-safe glazed interior','Hand wash recommended'],tag:'A TABLE ESSENTIAL'},
  bowl:{id:'bowl',name:'The everyday bowl',price:4800,category:'serve',finish:'Speckled cream · 20 cm',description:'A generous everyday bowl with a soft speckled glaze, made for the centre of the table.',features:['20 cm diameter','Speckled cream glaze','Hand wash recommended'],tag:'THE DAILY RITUAL'},
  cup:{id:'cup',name:'The morning cup',price:2800,category:'drink',finish:'Rust glaze · 250 ml',description:'A small, tactile cup in a deep rust glaze. A good companion for a quieter morning.',features:['250 ml capacity','Rust-coloured glazed finish','Hand wash recommended'],tag:'A QUIET MORNING'}
};
export const money = cents => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
export function sanitizeCart(value) {
  if(!value || typeof value!=='object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([id,quantity])=>Object.hasOwn(products,id) && Number.isInteger(quantity) && quantity>0 && quantity<=10));
}
export function setQuantity(cart,id,quantity) {
  if(!Object.hasOwn(products,id) || !Number.isInteger(quantity) || quantity<0 || quantity>10) throw new Error('Choose a quantity between 0 and 10 for a listed product.');
  const next=sanitizeCart(cart);if(quantity===0)delete next[id];else next[id]=quantity;return next;
}
export function cartTotals(cart) {
  const clean=sanitizeCart(cart);
  const count=Object.values(clean).reduce((sum,quantity)=>sum+quantity,0);
  const subtotal=Object.entries(clean).reduce((sum,[id,quantity])=>sum+products[id].price*quantity,0);
  const shipping=count===0 || subtotal>=12000 ? 0 : 900;
  return {count,subtotal,shipping,total:subtotal+shipping};
}
