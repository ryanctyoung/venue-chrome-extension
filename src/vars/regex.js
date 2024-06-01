const venue_regex = /(?<=Location: ).[^,]+/
const timestamp_regex = /\d+(?::\d{2})?(?:am|pm) to \d+(?::\d{2})?(?:am|pm)/
const single_time_regex = /(\d+(?::\d{2})?)(am|pm)/
const event_edit_regex = /https?:\/\/calendar.google.com\/calendar\/u\/\d\/r\/eventedit\/\w*/ //https://calendar.google.com/calendar/u/1/r/eventedit/*
const px_regex = /([^a-z])/
// const day_regex = /\/calendar.*\/day/

// for event model: data-uid="c2303"
// for event page: class="FrSOzf"