//onReady load function

const setDefaultVenues = async (labels) => {
  await chrome.storage.sync.set({default_venues: labels})
        console.log("Default venues saved")
}

const regex = /(?<=\*Venue sites\*: ).*(?= \*e\*)/
 
$(function () {
  chrome.storage.onChanged.addListener(async (changes) => {
    try {

      if ("selectedCalendarId" in changes) {
        const id = changes.selectedCalendarId.newValue
        if (id == undefined || id === -1) {
          return
        }
  
        const { calendars } = await chrome.storage.sync.get(["calendars"])
        const description = calendars.find((c) => c.id === id)?.description
        const labelArray = ((description?.match(regex) ?? [null])[0] ?? "").split(", ")
        setDefaultVenues(labelArray)
        $("#popup-venue-input").val(labelArray.join(', '))
      }
    } catch (err) {

    }
  })

  // $("#popup-calendar-dropdown").append
  function updatePopup () {
    chrome.storage.sync.get(["calendars"]).then((response) => {
      try {
        const { calendars } = response
        const select = document.querySelector("select[id='calendar-select']")
        if (select === null) {
          return
        }
        select.addEventListener('change', function (e) {
          const value = e.target.value 
          chrome.storage.sync.set({selectedCalendarId: value})
         });
    
        calendars.map((c) => {
          const option = document.createElement("option")
          option.value = c.id
          option.textContent = c.summary
          select?.appendChild(option)
        })
    
        chrome.storage.sync.get(["selectedCalendarId"]).then((res) => {
          // if (id == undefined) {
          //   const defaultId = calendars[0]?.id ?? -1
          //   chrome.storage.sync.set({selectedCalendarId: defaultId})
          // }
          const id = res.selectedCalendarId
          select.value = id
        })
        
        chrome.storage.sync.get(["default_venues"]).then((res) => {
          const { default_venues } = res
          $("#popup-venue-input").val(default_venues.join(', '))
        })
      } catch (err) {
  
      }
    })
  }

  updatePopup();
})



$("#save").click(function() {
  const labelInput = $("#popup-venue-input").val()

  if (labelInput === undefined) {
    return
  }

  labelArray = labelInput.trim().split(',').map(s => s.trim())
  setDefaultVenues(labelArray)
  // overwrite settings in calendar description
  const id_Promise = chrome.storage.sync.get(["selectedCalendarId"])
  const calendar_Promise = chrome.storage.sync.get(["calendars"])
  Promise.all([id_Promise, calendar_Promise]).then(([id, cal]) => {
     id = id.selectedCalendarId
     const calendar = cal.calendars.find(c => c.id === id)
      // find the cursor position where the venue settings are. if they do not exist, append it to the end of the description
      const settings = `\n*Venue sites*: ${labelInput} *e*`
      if (calendar.description == undefined) {
        calendar.description = settings
      } else {
        const cursor_match = calendar.description.match(regex)
        console.log(cursor_match)
        if (cursor_match == null) {
          calendar.description += settings
        } else {
          calendar.description = calendar.description.replace(regex, labelInput)
        }

      }
      console.log(cal)
      chrome.identity.getAuthToken({interactive: true}, (token) => {
      let parameters = {
        method: 'PUT',
        async: true,
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          ...calendar
        })
      };

      fetch(`https://www.googleapis.com/calendar/v3/calendars/${id}?key=AIzaSyA3P5mCPZpU4Y6jUjBvpgIybUc1CdCgcCI`, parameters)
        .then((res) => {
          console.log(res.json())
        })
        .catch((err) => console.error(err));
    })
  })
})