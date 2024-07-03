// add dropdown to create event modal/page so that we can auto-select locations
// selector for edit modal class='ecHOgf RDlrG Inn9w iWO5td'
let inputDiv = null


function eventModalRender(modal) {
  const dropdowns = Array.from(modal.querySelectorAll(event_modal_location_selector))

  function parseEventsFromString(str) {
    return str.split(';').map(v => v.trim()) ?? []
  }
  
  function parseStringFromEvents(events) {
    return events.join("; ") ?? []
  }
  
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
      const existingVenues = parseEventsFromString(inputDiv.value) 
      // console.log(existingVenues)

      const optionClick = (value) => {
        // query for all selected checkboxes
        const checkedBoxes = Array.from(optionsDiv.querySelectorAll('input[type=checkbox]:checked')).map((c) => c.id)
        if (inputDiv != null) {
          inputDiv.value = parseStringFromEvents(checkedBoxes)
          inputDiv.click()
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