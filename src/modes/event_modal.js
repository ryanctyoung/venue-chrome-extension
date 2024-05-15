// add dropdown to create event modal/page so that we can auto-select locations
// selector for edit modal class='ecHOgf RDlrG Inn9w iWO5td'
let inputDiv = null

function eventModalRender(modal) {
  const dropdowns = Array.from(modal.querySelectorAll(event_modal_location_selector))
  inputDiv = modal.querySelector(event_modal_location_focus_selector)

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
      
      function optionClick(value) {
        if (inputDiv != null) {
          inputDiv.value = value
          inputDiv = modal.querySelector(event_modal_location_focus_selector)
          let labelDivs = Array.from(modal.querySelectorAll(event_modal_location_label_selector))
          labelDivs.map(label => label.textContent = value)
          inputDiv.click()
        }
        else {
          console.log(inputDiv)
        }
      }

      preset_venues.map((venue) => {
        let option = document.createElement("a")
        option.onclick = () => optionClick(venue, inputDiv)
        option.textContent = venue
        optionsDiv.appendChild(option)
      })

      venueOptions.appendChild(button)
      venueOptions.appendChild(optionsDiv)
      // console.log(venueOptions)
      dropdown.children[0].appendChild(venueOptions)
      // dropdown.insertBefore(venueOptions, dropdown.children[Math.max(dropdown.children.length-1,0)])
      
    }
  })


}