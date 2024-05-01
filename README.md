[Example of Calendar Extension](https://github.com/padster/CalendarThemeExtension)

Next Items:
- Multi-event creation with multiple locations
- Preset/default location headers
    storage.local ? or use [Calendar List API](https://www.googleapis.com/calendar/v3/users/me/calendarList)

- Week view

  const flexbox = document.createElement('div')
  flexbox.id = 'column-header-flexbox'
  flexbox.style.setProperty('display', 'flex')
  flexbox.style.setProperty('flex-direction', 'row')
  columnHeader = document.querySelector("div[class=mDPmMe]")
  spacingElement = document.querySelector(initial_spacing_selector)
  initialSpacing =  spacingElement?.offsetWidth
  initialSpacing += spacingElement ? parseInt(getComputedStyle(spacingElement).marginLeft) : 0
  columnHeader?.querySelector('#column-header-flexbox')?.remove()
  columnHeader?.insertBefore(flexbox, columnHeader.firstChild)