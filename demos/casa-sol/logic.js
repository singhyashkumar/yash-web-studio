export const rooms = {
  courtyard:{name:'Courtyard room',rate:18000,capacity:2,description:'A restful room opening onto the shade of the central courtyard. Simple, warm, and just enough.',features:['King bed for up to two guests','Private courtyard patio','Breakfast in the courtyard','Air conditioning and Wi-Fi']},
  sea:{name:'Sea terrace',rate:24000,capacity:2,description:'Sea air, a private terrace, and a little more room to watch the afternoon become evening.',features:['King bed for up to two guests','Private terrace with a sea view','Breakfast in the courtyard','Air conditioning and Wi-Fi']},
  garden:{name:'Garden suite',rate:32000,capacity:4,description:'A generous suite with a second sleeping space and a sheltered garden corner to call your own.',features:['Two sleeping spaces for up to four guests','Private garden terrace','Breakfast in the courtyard','Air conditioning and Wi-Fi']}
};
export function localISO(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function day(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const parsed = new Date(value+'T00:00:00Z');
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10) === value ? parsed.getTime() : NaN;
}
export function calculateStay({arrival,departure,suite,guests}, today = localISO()) {
  const room = Object.hasOwn(rooms, suite) ? rooms[suite] : null;
  if (!room) throw new Error('Choose one of the listed rooms.');
  if (!Number.isFinite(day(arrival)) || !Number.isFinite(day(departure))) throw new Error('Choose valid arrival and departure dates.');
  if (day(arrival) < day(today)) throw new Error('Arrival must be today or later.');
  const nights = (day(departure)-day(arrival))/86400000;
  if (nights < 1 || nights > 30) throw new Error('Choose a stay between 1 and 30 nights.');
  const count = Number(guests);
  if (!Number.isInteger(count) || count < 1 || count > room.capacity) throw new Error(`${room.name} accommodates up to ${room.capacity} guests. Choose the garden suite for 3 or 4 guests.`);
  const subtotal = room.rate * nights;
  const serviceCharge = Math.round(subtotal * .1);
  return {name:room.name,nights,guests:count,rate:room.rate,subtotal,serviceCharge,total:subtotal+serviceCharge};
}
