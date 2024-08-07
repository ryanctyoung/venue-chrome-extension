const columnMargins = week_view_day_header_column_margins // px

function weekModeRender() {

  const numberOfColumns = preset_venues.length + 1
  var columnWidth = 0

  // install venue columns into each day on the week view
  // day : HTMLElement
  function createDayColumn(day) {
    
    let columnContainer = day.querySelector(`div[class=${day_header_container_classname}]`)
    if (columnContainer === null) {
      columnContainer = document.createElement("div")
      day.appendChild(columnContainer)

      columnContainer.className = day_header_container_classname
      columnContainer.style.setProperty('display', 'flex')
      columnContainer.style.setProperty('flex-direction', 'row')
      columnContainer.style.setProperty('justify-content', 'flex-start')
  
      
      for (let i = 0; i < numberOfColumns - 1; i++) {
        const venueName = preset_venues[i]
  
        const columnDiv = document.createElement("div")
        columnDiv.className = day_header_classname
        columnDiv.style.setProperty('width', `calc(${100 / numberOfColumns}% - ${2 * columnMargins}px)`)
        columnDiv.style.setProperty('height', '10px')
        columnDiv.style.setProperty('background-color', 'blue')
        columnDiv.style.setProperty('border-radius', '3px')
        columnDiv.style.setProperty('margin', `0px ${columnMargins}px 0px ${columnMargins}px`)
        columnContainer.appendChild(columnDiv)
  
        // apply on hover tooltip
        const toolTipDiv = document.createElement("div")
        toolTipDiv.className = day_header_tooltip_classname
        toolTipDiv.textContent = venueName
        columnDiv.appendChild(toolTipDiv)
      }
      day.appendChild(columnContainer)
    }
    columnWidth = (columnContainer.getBoundingClientRect().width / numberOfColumns) - (2 *columnMargins)

  }
  const dayColumns = Array.from(document.querySelectorAll(day_column_selector))
  dayColumns.map(createDayColumn)

  // instantiating the multi-event containers for each day
  Array.from(document.querySelectorAll(week_view_day_gridcell_selector)).map(day => {
    let multi_event_container = day.querySelector(week_view_multi_event_container_selector)
    if (multi_event_container === null) {
      multi_event_container = document.createElement("div")
      const index = day.getAttribute("data-column-index")
      multi_event_container.setAttribute("class", "venue-multi-event-container")
      multi_event_container.setAttribute("venue-index", index)
      day.querySelector("[role='presentation']").appendChild(multi_event_container)

    }
    multi_event_container.replaceChildren()

  })

  const presetVenueSpacingMap = ((arr) => {
    const obj = {}
    for (var key in Object.keys(arr)) {
      obj[arr[key]] = key
    }
    return obj
  })(preset_venues)

  
  // organize events into their respective venues
  // event : HTMLElement
  function createMultiEvents(event) {
    const location = event.querySelector(week_view_event_location_selector)?.textContent ?? ""
    const title = event.querySelector(week_view_event_title_selector)?.textContent ?? "(No Title)"
    const timeStamp = event.querySelector(week_view_event_timestamp_selector)?.textContent ?? ""
    const eventDimensions = event.getBoundingClientRect()

    const multi_event_container = event.closest(week_view_day_gridcell_selector)?.querySelector(week_view_multi_event_container_selector)
    
    const venues = location.split(";").map(v => {
      v = v.trim()
      const result = preset_venues.includes(v) ? v: empty_venue_placeholder
      return result
    })

    console.log(`Venue logs for event ${title}:`)
    console.log(venues)

    for(let i = 0; i < venues.length ; i++) {
      const index = preset_venues.findIndex((label) => venues[i] === label) ?? 0
      const eventSpacing = presetVenueSpacingMap[venues[i]] ?? preset_venues.length
      let eventWidth = columnWidth

      let htmlBox = null
      if (i === 0) {
        htmlBox = event
      } else {
        htmlBox = document.createElement("div")
        // const titleDiv = document.createElement("div")
        // titleDiv.textContent = title
        // const subtitleDiv = document.createElement("div")
        // subtitleDiv.textContent = `${timeStamp} | ${venues[i]}`

        htmlBox.style.setProperty("top", event.style.top)
        htmlBox.style.setProperty("padding", dec_to_px(multi_event_padding))
        htmlBox.style.setProperty("height", dec_to_px(px_to_dec(event.style.height) - (2 * multi_event_border_size) - (2 * multi_event_padding)))
        eventWidth = eventWidth  - (2*columnMargins) - (2 * multi_event_padding)
        htmlBox.style.opacity = multi_event_opacity
        htmlBox.style.backgroundColor = event.style.backgroundColor
        htmlBox.style.border = `${dec_to_px(multi_event_border_size)} dotted black`
        htmlBox.style.borderRadius = `${dec_to_px(multi_event_border_radius)}`
        // htmlBox.style.fontSize = `${dec_to_px(multi_event_fontSize)}`
        // subtitleDiv.style.fontSize = `${dec_to_px(multi_event_subtitle_fontSize)}`
        // htmlBox.style.color = `${multi_event_fontColor}`
        htmlBox.style.cursor = multi_event_pointer
        htmlBox.style.setProperty("position", multi_event_position_style)

        htmlBox.onclick = (clickevent) => {
          clickevent.stopPropagation()
          event.click()
        }

        // htmlBox.append(titleDiv, subtitleDiv)
        multi_event_container.appendChild(htmlBox)
      }

      // add tooltip with Title, Location, Timestamp
      const toolTipDiv = document.createElement("div")
      toolTipDiv.className = week_view_event_tooltip_classname
      toolTipDiv.textContent = title
      const defaultBorder = i === 0 ? 'none' : `${dec_to_px(multi_event_border_size)} dotted black`
      htmlBox.appendChild(toolTipDiv)
      htmlBox.onmouseover = () => {
        htmlBox.style.border = `${dec_to_px(multi_event_border_size)} double black`
        toolTipDiv.style.visibility = 'visible'
        htmlBox.style.zIndex = 26

      }

      htmlBox.onmouseleave = () => {
        htmlBox.style.border = defaultBorder
        toolTipDiv.style.visibility = 'hidden'
        htmlBox.style.zIndex = 25
      }

      // apply universal styling
      htmlBox.querySelector(event_details_selector)?.style.setProperty("visibility", week_view_event_detail_visibility)
      htmlBox.style.setProperty("width", dec_to_px(eventWidth), "important")
      htmlBox.style.setProperty("margin", `0px ${dec_to_px(columnMargins)}`, "important")
      htmlBox.style.setProperty("left", dec_to_px((columnWidth + (2 *columnMargins)) * eventSpacing), "important")
      htmlBox.style.zIndex = 25
    }
  }
  Array.from(document.querySelectorAll(event_selector)).map(createMultiEvents)
}