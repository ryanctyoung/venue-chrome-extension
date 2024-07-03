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