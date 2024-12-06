var px_regex

(async () => {
  const src = chrome.runtime.getURL("src/vars/regex.js");
  ({px_regex} = await import(src));

})();

function dec_to_px(x) {
  return `${x}px`
}

function px_to_dec(x) {
  return x.match(px_regex)[0]
}

function convertTimeStrToInt(str) {
  const regexResult = str.match(single_time_regex).slice(-2)
  let [hours, minutes = 0] = regexResult[0].split(':').map((str) => parseInt(str))
  hours = hours === 12 ? 0 : hours
  if (regexResult.slice(-1)[0] === 'pm') {
    hours += 12
  }

  return (hours * 60) + minutes
}

function parseVenuesFromString(str) {
  return str.split(';').map(v => v.trim()) ?? []
}

function parseStringFromVenues(events) {
  return events.join("; ") ?? []
}

function sortTimestamps(a, b) {
  console.log(a,b)
  let [ts1, ts2] = [a,b].map(s => convertTimeStrToInt(s.split(' to ')[0]))
  console.log(ts1,ts2)
  return ts1 > ts2 ? 1 : -1
}