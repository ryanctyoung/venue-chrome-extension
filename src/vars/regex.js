export const venue_regex = /(?<=Location: ).[^,]+/
export const timestamp_regex = /\d+(?::\d{2})?(?:am|pm) to \d+(?::\d{2})?(?:am|pm)/
export const single_time_regex = /(\d+(?::\d{2})?)(am|pm)/
export const event_edit_regex = /\w*calendar.google.com\/calendar\/u\/\d\/r\/eventedit\/\w*/ //https://calendar.google.com/calendar/u/1/r/eventedit/*
export const px_regex = /([^a-z])/
export const event_context_regex = /((?<=2:\[")[^"]+)(?:.+)((?<=1:\[")[^"]+)/
// https://calendar.google.com/calendar/u/1/r/eventedit
// const event_context_regex = /((?<=2:\[").+(?="))((?<=.*1:\["]).+(?="))/
// const day_regex = /\/calendar.*\/day/

// for event model: data-uid="c2303"
// for event page: class="FrSOzf"