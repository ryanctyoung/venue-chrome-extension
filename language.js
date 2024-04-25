function getLocalizedString(str) {
  const language = window.navigator.languages[0]
  const url = chrome.runtime.getURL('text.json')
  console.log(url)
  fetch(url)
    .then((res) => {
      console.log(res)
      return res.json();
    })
    .then((data) => 
      console.log(data[language][str]))
    .catch((error) => 
      console.error("Unable to fetch data:", error));
}