// add dropdown to create event modal/page so that we can auto-select locations
// selector for edit modal class='ecHOgf RDlrG Inn9w iWO5td'
let inputDiv = null


async function eventModalRender(modal) {
  const dropdowns = Array.from(modal.querySelectorAll(event_modal_location_selector))

  // Time select dropdown: highlight all conflicting times
  let currentEvents = await chrome.storage.sync.get([current_event_list_sync_name]).then((result) => {
    const curr = result[current_event_list_sync_name]
    if( curr == undefined ||curr?.length == 0){
      return {}
    }
    return curr

  })

  dropdowns.forEach((dropdown) => {
    let venueOptions = Array.from(dropdown.children[0].children).find((e) => e.className === "venue-location-dropdown") 

    if (venueOptions === undefined) {
      venueOptions = document.createElement("div")
      venueOptions.className = "venue-location-dropdown"
      let button = document.createElement("button")
      button.className = "venue-location-button"

      let img = document.createElement("img")
      img.src = chrome.runtime.getURL('images/128.png');
      button.appendChild(img)

      let optionsDiv = document.createElement("div")
      optionsDiv.className = "venue-location-content"

      function buttonClick() {
        optionsDiv.classList.toggle("show")
      }
      button.onclick = buttonClick
      
      inputDiv = modal.querySelector(event_modal_location_focus_selector)
      const existingVenues = parseVenuesFromString(inputDiv.value) 
      // console.log(existingVenues)

      const optionClick = (value) => {
        // query for all selected checkboxes
        const checkedBoxes = Array.from(optionsDiv.querySelectorAll('input[type=checkbox]:checked')).map((c) => c.id)
        const timeSelectDropdowns = Array.from(document.querySelectorAll(event_modal_time_options_selector))
        timeSelectDropdowns.map(dropdown => {
          Array.from(dropdown.children).map(timeOption => timeOption.style.color = 'black')
        })
        const dateStamp = modal.querySelector(event_modal_date_selector)?.textContent.split(',')[1].trim()

        if (inputDiv != null) {
          const venueString = parseStringFromVenues(checkedBoxes)
          inputDiv.value = venueString
          inputDiv.click()
          
          //highlight conflicting times here
          if(dateStamp in currentEvents) {
            let bookedTimes = checkedBoxes.reduce((accum, venue) => accum.concat(currentEvents[dateStamp][venue]), []).sort(sortTimestamps) ?? []
            console.log(bookedTimes)
            // let bookedTimes = currentEvents[dateStamp][venueString]
            console.log(timeSelectDropdowns)
            let [startTimeDropdown, endTimeDropdown] = timeSelectDropdowns
            let j = 0
            
            //iteration through dropdown list and comparison to start times
            for (let i = 0; i < bookedTimes.length; i++) {
              while( j < startTimeDropdown.children.length) {
                let dropdownTimeInt = convertTimeStrToInt(startTimeDropdown.children[j].textContent)
                let [startTimeInt, endTimeInt] = bookedTimes[i]?.split(' to ').map(convertTimeStrToInt)
                if (dropdownTimeInt >= endTimeInt) {
                  break;
                }  
                if (dropdownTimeInt >= startTimeInt) {
                  startTimeDropdown.children[j].style.color = 'red'
                }
                j++
              }
            }

          }
        }
      }

      preset_venues.map((venue) => {
        let option = document.createElement("div")
        let checkbox = document.createElement("input")
        checkbox.type = "checkbox"

        if(existingVenues.includes(venue)) {
          checkbox.setAttribute("checked", true)
        }
        
        checkbox.id = venue
        let label = document.createElement("label")
        label.setAttribute("for", venue)
        label.textContent = venue

        option.appendChild(checkbox)
        option.appendChild(label)

        checkbox.onclick = () => optionClick(venue, inputDiv)
        optionsDiv.appendChild(option)
      })

      venueOptions.appendChild(button)
      venueOptions.appendChild(optionsDiv)
      dropdown.children[0].appendChild(venueOptions)
      // dropdown.insertBefore(venueOptions, dropdown.children[Math.max(dropdown.children.length-1,0)])
      
    }
  })


}