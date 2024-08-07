var single_time_regex, venue_regex, timestamp_regex

(async () => {
  const src = chrome.runtime.getURL("src/vars/regex.js");
  ({single_time_regex, venue_regex, timestamp_regex} = await import(src));

})();

const timeSlots = []
Array(24).keys().forEach(hour => {
  if (hour < 9) {
    return
  }
  let AmPm = hour > 11 ? 'pm': 'am' 
  hour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour)
  for(let i = 0; i < 4; i++) {
    let minutes = i === 0 ? '00': 15 * i
    let timeString = hour + ':' + minutes + AmPm
    timeSlots.push(timeString)
  }
});

const convertTimeStrToInt = (time12h) => {
  
}

function getEventTimes(text) {

  let startString = ''
  let endString = ''
  let startTime = -1
  let endTime = -1

  const stringToMinutes = (s) => {
    let minutes = s.includes('pm') ? minutes_in_half_day : 0
    const parts = s.split(':')
    minutes +=   parseInt(parts[0]) === 12 ? 0 : parseInt(parts[0]) * minutes_in_hour
    if (parts.length > 1) {
      minutes += parseInt(parts[1])
    }
    return Math.min(minutes, minutes_in_day - 1)
  }

  if (text.includes(',')) {
    startString = text.split(',')[0]
    startTime = stringToMinutes(startString)
    endTime = startTime + minutes_in_hour
  }
  else {
    const times = text.split("–")
    startString = times[0]
    endString = times.length > 1 ? times[1] : ''
    startTime = stringToMinutes(startString)
    endTime = stringToMinutes(endString)

    if (endTime > minutes_in_half_day && !startString.includes('am')) {
      startTime += minutes_in_half_day
    }
  }

  return {startTime, endTime}
}

function dayModeRender() {
  
  let venue_labels = []

  const compareTimes = (str1, str2) => {
      let [a, b] = [str1, str2].map((str) => {
        const regexResult = str.match(single_time_regex).slice(-2)
        let [hours, minutes = 0] = regexResult[0].split(':').map((str) => parseInt(str))
        hours = hours === 12 ? 0 : hours
        if (regexResult.slice(-1)[0] === 'pm') {
          hours += 12
        }
  
        return (hours * 60) + minutes
      })
      return b >= a

  }

  // Create Header Flexbox
  const flexbox = document.createElement('div')
  flexbox.style.setProperty('display', 'flex')
  flexbox.style.setProperty('flex-direction', 'row')
  flexbox.style.setProperty('overflow', 'scroll')
  flexbox.style.setProperty('width', 'fit-content')
  const columnHeader = document.querySelector("div[class=Ifvtsc]")
  const eventGrid = document.querySelector(event_grid_selector)
  const spacingElement = document.querySelector(initial_spacing_selector)
  let initialSpacing =  spacingElement?.offsetWidth
  initialSpacing += spacingElement ? parseInt(getComputedStyle(spacingElement).marginLeft) : 0
  columnHeader?.style.setProperty('width', '100%')
  columnHeader?.style.setProperty('overflow-x', 'hidden')
  columnHeader?.style.setProperty("word-wrap", "break-word")
  columnHeader?.replaceChildren(flexbox)

  // query for event Elements - {element: HTMLElement, venue: string, timestamp: string}
  const events = Array.from(document.querySelectorAll(event_selector)).map(event => {

    let eventVenue = event.outerText.match(venue_regex)
    return {
      element: event,
      venue: eventVenue? eventVenue[0] : empty_venue_placeholder,
      timestamp: event.outerText.match(timestamp_regex)?  event.outerText.match(timestamp_regex)[0] : '',
      title: event.querySelector(event_item_title).outerText
    }
  })

  const venue_headers = {}
  venue_labels = [...new Set(preset_venues.concat(empty_venue_placeholder))]
  if (venue_labels.length > 1 || !(venue_labels.includes(empty_venue_placeholder))) {
    venue_labels.map((label) => {
      const header = document.createElement('div')

      // style the venue header
      header.style.width = dec_to_px(max_column_width - (columnMargins*2))
      header.style.marginLeft = dec_to_px(columnMargins)
      header.style.marginRight = dec_to_px(columnMargins)
      header.style.fontSize = dec_to_px(font_size)
      header.className = headerClassName

      const textContent = document.createElement("span")
      textContent.textContent = label
      header.appendChild(textContent)

      // configure the dropdown
      const button = document.createElement('button')
      button.className = 'venueHeader-arrow'
      button.style.color = 'blue'
      button.style.backgroundImage = `url(${chrome.runtime.getURL('images/dropdown-arrow.png')})`
      // const img = document.createElement('img')
      // img.src = chrome.runtime.getURL('images/dropdown-arrow.png');
      const optionsDiv = document.createElement("div")
      optionsDiv.className = "venue-timeslot-content"
      optionsDiv.style.width = dec_to_px(max_column_width - (columnMargins*2))

      const busyTimes = []

      events.filter(e => e.venue === label).map(e => {
        if (e.timestamp.match(timestamp_regex) === null) {
          return
        }

        const [start, end] = ((ts) => ts.split(' to '))(e.timestamp)

        if (busyTimes.length === 0) {
          busyTimes.push({start, end})
          return
        }

        if (compareTimes(busyTimes[busyTimes.length - 1].end, start)) {
          busyTimes.push({start,end})
        } else if (compareTimes(busyTimes[busyTimes.length - 1].end, end)) {
          busyTimes[busyTimes.length - 1].end = end
        }
        
      })

      const createEventButton = document.querySelector(create_event_interact_selector)
      const optionClick = (e, venue, time) => {
        const observer = new MutationObserver(async mutations => {
          const eventModal = document.querySelector(`${event_modal_selector}`)
          if (eventModal) {
            observer.disconnect()
            inputDiv = eventModal.querySelector(event_modal_location_focus_selector)

            eventModal.querySelector(event_modal_time_preinput_selector).click()
            eventModal.querySelector(event_modal_time_input_selector).click()
            const optionsContainer = await waitForElm(event_modal_time_options_selector, eventModal)
            Array.from(optionsContainer.children).find(option => option.textContent === time)?.click()

            inputDiv.value = venue
            inputDiv = eventModal.querySelector(event_modal_location_focus_selector)
            let labelDivs = Array.from(eventModal.querySelectorAll(event_modal_location_label_selector))
            labelDivs.map(label => label.textContent = venue)
            inputDiv.click()
          }
        })
        observer.observe(document.body, {
          childList: true,
          subtree: true
        })
        createEventButton.click()
      }

      let i = 0
      timeSlots.map((t) => {
        let disabled = false
        if (busyTimes.length > 0 && i < busyTimes.length) {
          if (compareTimes(busyTimes[i].start, t)) {
            if (compareTimes(busyTimes[i].end, t)) {
              i++
            } else {
              disabled = true
            }
          }
        }

        let option = document.createElement("a")
        option.textContent = t
        if (disabled) {
          option.classList.add("disabled")
          option.onclick = (e) => e.stopPropagation()
        } else {
          option.onclick = (e) => optionClick(e, label, t)
        }
        optionsDiv.appendChild(option)
      })
      
      function headerToggle(event) {
        optionsDiv.classList.toggle("show")
        event.stopPropagation()
      }
      header.onclick = headerToggle

      optionsDiv.addEventListener('blur',(e) => {
        optionsDiv.classList.remove("show")
      }, true)


      header.appendChild(button)
      header.appendChild(optionsDiv)
      venue_headers[label] = header
    })
    flexbox.replaceChildren(...Object.values(venue_headers))  
  }

  eventGrid?.style.setProperty('width', dec_to_px(flexbox.offsetWidth + initialSpacing + (2*column_margin)))
  if (columnHeader != null) {
    columnHeader.scrollLeft = eventGrid?.parentElement.scrollLeft
    eventGrid?.parentElement.addEventListener("scroll", (e) => {
      columnHeader.scrollLeft = e.target.scrollLeft
    })
  }


  // form - {start, end, stack}
  const columnMapper = venue_labels.reduce((acc, curr) => (acc[curr] = [], acc) , {})
  
  let multi_event_container = document.querySelector(day_view_multi_event_container)
  if (multi_event_container === null) {
    multi_event_container = document.createElement("div")
    multi_event_container.setAttribute("class", "venue-multi-event-container")
    document.querySelector(day_view_event_board)?.appendChild(multi_event_container)
  }
  multi_event_container.replaceChildren()

  events.map(e => {
    const eventTimeStamp = e.element.querySelector(event_timestamp_selector)?.textContent ?? ""
    // form - {startTime, endTime}
    timeStamp = getEventTimes(eventTimeStamp)

    const venues = e.venue.split(";").map(v => {
      v = v.trim()
      const result = venue_labels.includes(v) ? v: empty_venue_placeholder
      if (columnMapper[result].length === 0) {
        columnMapper[result].push(timeStamp)
      } else {
        
        while(columnMapper[result].length > 0) {
          const topLayer = columnMapper[result].slice(-1)
          if (timeStamp.startTime < topLayer.endTime) {
            columnMapper[result].push(timeStamp)
            break
          } else {
            columnMapper[result].pop()
          }
        }
  
      }
      return result
    })

    // loop here through venues
    for(let i = 0; i < venues.length ; i++) {
      const index = venue_labels.findIndex((label) => venues[i] === label) ?? 0
      const finalSpacing = initialSpacing + (index*max_column_width)


      let htmlBox = null
      if (i === 0) {
        htmlBox = e.element
      } else {
        htmlBox = document.createElement("div")
        const title = document.createElement("div")
        title.textContent = `${e.title}`
        const subtitle = document.createElement("div")
        subtitle.textContent = `${e.timestamp} | ${venues[i]}`

        htmlBox.style.setProperty("top", e.element.style.top)
        htmlBox.style.setProperty("padding", dec_to_px(multi_event_padding))
        htmlBox.style.setProperty("height", dec_to_px(px_to_dec(e.element.style.height) - (2 * multi_event_border_size) - (2 * multi_event_padding)))
        htmlBox.style.opacity = multi_event_opacity
        htmlBox.style.backgroundColor = e.element.style.backgroundColor
        htmlBox.style.border = `${dec_to_px(multi_event_border_size)} solid black`
        htmlBox.style.borderRadius = `${dec_to_px(multi_event_border_radius)}`
        htmlBox.style.fontSize = `${dec_to_px(multi_event_fontSize)}`
        subtitle.style.fontSize = `${dec_to_px(multi_event_subtitle_fontSize)}`
        htmlBox.style.color = `${multi_event_fontColor}`
        htmlBox.style.cursor = multi_event_pointer
        htmlBox.style.setProperty("position", multi_event_position_style)

        htmlBox.onclick = (clickevent) => {
          clickevent.stopPropagation()
          e.element.click()
        }
        // htmlBox.setAttribute("data-eventchip", true)
        // htmlBox.setAttribute("data-eventid", e.element.getAttribute("data-eventid"))

        htmlBox.append(title, subtitle)
        multi_event_container.appendChild(htmlBox)
      }

      htmlBox.querySelector(event_details_selector)?.style.setProperty("visibility", day_view_event_detail_visibility)
      htmlBox.style.setProperty("width", dec_to_px(max_column_width - (2*column_margin) - (2 * multi_event_padding)), "important")
      htmlBox.style.setProperty("margin", `0 ${dec_to_px(column_margin)} 0 ${dec_to_px(column_margin)}`, "important")
      htmlBox.style.setProperty("left", dec_to_px(finalSpacing + ((columnMapper[venues[i]].length-1)*overlap_spacing)), "important")
      htmlBox.style.zIndex = "4"
    }
  })
}

