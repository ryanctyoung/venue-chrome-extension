var month_event_details_regex

(async () => {
  const src = chrome.runtime.getURL("src/vars/regex.js");
  ({month_event_details_regex} = await import(src));

})();

// add venue location to each event item

// find calendar object: div[class='kbf0gd']
// then query all event objects: div[class='KF4T6b smECzc jKgTF QGRmIf']
// for each event object:
//    get event details: span[class='XuJrye']
//    append location(s) to title
//      extract location through regex: 
//      add location to title string: span[class='WBi6vc']
//    add tooltip with timestamp. for efficency sake, only one toolTip should be used
//      add one toolTip item to calendar object. set position to highlighted event   

function monthModeRender() {
  console.log("MonthModeRender")
  const calendarObject = document.querySelector("div[class='kbf0gd']")

  if (calendarObject === null) {
    console.log("Cannot find calendar")
    return
  }

  const eventArray = Array.from(calendarObject?.querySelectorAll("div[class='KF4T6b smECzc jKgTF QGRmIf']"))

  let toolTip = calendarObject.querySelector("div[class='venue-month-event-tooltip']")
  if (toolTip === null) {
    toolTip = document.createElement("div")
    toolTip.className = "venue-month-event-tooltip"
    calendarObject.appendChild(toolTip)
  }

  eventArray.map((event) => {
    const eventDetails = event.querySelector("span[class='XuJrye']")?.textContent?.match(month_event_details_regex)
    if (eventDetails == null) {
      return
    }
    const eventTitle = event.querySelector("span[class='WBi6vc']")
    eventTitle.textContent += ` (${eventDetails})`
    console.log(eventDetails)
  })

  chrome.storage.sync.set({[current_event_list_sync_name]: []})
  console.log("End of MonthModeRender")

}
