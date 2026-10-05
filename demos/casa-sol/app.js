import {rooms,localISO,calculateStay} from './logic.js';
const euro = cents => new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(cents/100);
const form = document.querySelector('#stay-form');
const arrival = form.elements.arrival, departure = form.elements.departure;
const today = new Date();
arrival.min = localISO(today);
const start = new Date(today);start.setDate(start.getDate()+7);
const end = new Date(start);end.setDate(end.getDate()+3);
arrival.value = localISO(start); departure.value = localISO(end);departure.min = arrival.value;
arrival.addEventListener('change',()=>{departure.min=arrival.value;});
form.addEventListener('submit',event=>{
  event.preventDefault();
  const error = document.querySelector('#stay-error'), output = document.querySelector('#quote');
  try {
    const quote = calculateStay(Object.fromEntries(new FormData(form)));
    document.querySelector('#quote-title').textContent = `${quote.name} · ${quote.nights} ${quote.nights===1?'night':'nights'}`;
    document.querySelector('#quote-details').textContent = `${quote.guests} ${quote.guests===1?'guest':'guests'} · ${euro(quote.rate)} / night · room subtotal ${euro(quote.subtotal)}`;
    document.querySelector('#quote-total').textContent = euro(quote.total);
    error.hidden=true;output.hidden=false;
  } catch (problem) {output.hidden=true;error.textContent=problem.message;error.hidden=false;}
});
const dialog = document.querySelector('#room-dialog');
let selectedRoom = 'courtyard';
document.querySelectorAll('[data-room]').forEach(button=>button.addEventListener('click',()=>{
  selectedRoom=button.dataset.room;const room=rooms[selectedRoom];
  document.querySelector('#room-dialog-title').textContent=room.name;
  document.querySelector('#room-description').textContent=room.description;
  document.querySelector('#room-features').replaceChildren(...room.features.map(text=>Object.assign(document.createElement('li'),{textContent:text})));
  document.querySelector('#room-rate').textContent=`From ${euro(room.rate)} per night · up to ${room.capacity} guests`;
  dialog.showModal();
}));
document.querySelector('.close').addEventListener('click',()=>dialog.close());
document.querySelector('#choose-room').addEventListener('click',()=>{
  form.elements.suite.value=selectedRoom;
  if(Number(form.elements.guests.value)>rooms[selectedRoom].capacity) form.elements.guests.value=String(rooms[selectedRoom].capacity);
  dialog.close();document.querySelector('#plan').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});arrival.focus({preventScroll:true});
});
