// Explicit time zone keeps the studio clock independent of the visitor's location.
const tokyoTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Tokyo', hourCycle: 'h23',
  hour: '2-digit', minute: '2-digit', second: '2-digit'
});
export function getTokyoClockAngles(timestamp = Date.now()) {
  const time = Object.fromEntries(tokyoTime.formatToParts(timestamp).map(p => [p.type, p.value]));
  const seconds = Number(time.second) + new Date(timestamp).getUTCMilliseconds() / 1000;
  const minutes = Number(time.minute) + seconds / 60;
  const hours = Number(time.hour) % 12 + minutes / 60;
  const turn = -Math.PI * 2; // Clockwise around the face normal; noon points upward.
  return { hour: turn * hours / 12, minute: turn * minutes / 60, second: turn * seconds / 60 };
}
