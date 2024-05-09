const columnMargins = 2 // px

function weekModeRender() {
  Array.from(document.querySelectorAll(event_selector)).map(event => {
    event.style.margin = ""
    event.style.left = ""
    event.style.width = "calc(100% + 0px)"
  })

  // const dayColumns = Array.from(document.querySelectorAll(day_column_selector))

  // dayColumns.map(d => {
  //   const columnContainer = document.createElement("div")
  //   columnContainer.style.setProperty('display', 'flex')
  //   columnContainer.style.setProperty('flex-direction', 'row')
  //   columnContainer.style.setProperty('justify-content', 'flex-start')

  //   const numberOfColumns = preset_venues.length + 1
  //   for (let i = 0; i < numberOfColumns - 1; i++) {
  //     const columnDiv = document.createElement("div")
  //     columnDiv.style.setProperty('width', `calc(${100 / numberOfColumns}% - ${2 * columnMargins}px)`)
  //     columnDiv.style.setProperty('height', '5px')
  //     columnDiv.style.setProperty('background-color', 'blue')
  //     columnDiv.style.setProperty('border-radius', '3px')
  //     columnDiv.style.setProperty('margin', `0px ${columnMargins}px 0px ${columnMargins}px`)
  //     columnContainer.appendChild(columnDiv)
  //   }

  //   d.appendChild(columnContainer)



  // })

  // const events = Array.from(document.querySelectorAll(event_selector))
  // console.log(events)
}