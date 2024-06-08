/* 
  - receive a message from content script that the Google Calendar page has been loaded

  - make an Calendar API call, getCalendarList.

    const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList')
      .then((res) => res.json());
    
      const calendars = response.map(c => {
      c.id,
      c.summary,
      c.description
    })

  - store info in Chrome storage
        chrome.storage.sync.set(calendars).then(() => {
          console.log("Default venues saved")
        })


  - when setting new default venues for a calendar, the popup must send a patch HTTP request using the 
      relevant calendar id, describing the new description that contains the default venue

      for ex. URL: PATCH https://www.googleapis.com/calendar/v3/users/me/calendarList/{calendarId}

      BOdy: {
        "description"
      }


*/

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {

  if (request.message = 'getCalendarList') {
    
    chrome.identity.getAuthToken({interactive: true}, (token) => {
      let parameters = {
        method: 'GET',
        async: true,
        headers: {
          'Authorization': 'Bearer ' + token
        },
        'contentType': 'json'
      };

      fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList?key=AIzaSyA3P5mCPZpU4Y6jUjBvpgIybUc1CdCgcCI', parameters)
        .then((res) => res.json())
        .then((data => {
          const pick = (obj, arr) =>
            Object.fromEntries(Object.entries(obj).filter(([k]) => arr.includes(k)));
          
          const calendars = data.items.map(c => pick(c, ['id', 'summary', 'description']))
        chrome.storage.sync.set({calendars: calendars}).then(() => {
          console.log("Default venues saved")
        })
      })
      )
        .catch((err) => console.error(err));
    })
  
  
    // const calendars = response.map(c => {
    //   c.id,
    //   c.summary,
    //   c.description
    // })

    // chrome.storage.sync.set(calendars).then(() => {
    //   console.log("Default venues saved")
    // })
  }
});
