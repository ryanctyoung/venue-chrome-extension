export const venue_regex = /(?<=Location: ).[^,]+/
export const timestamp_regex = /\d+(?::\d{2})?(?:am|pm) to \d+(?::\d{2})?(?:am|pm)/
export const single_time_regex = /(\d+(?::\d{2})?)(am|pm)/
export const event_edit_regex = /\w*calendar.google.com\/calendar\/u\/\d\/r\/eventedit\/\w*/ //https://calendar.google.com/calendar/u/1/r/eventedit/*
export const px_regex = /(\d+)/
export const event_context_regex = /((?<=2:\[")[^"]+)(?:.+)((?<=1:\[")[^"]+)/
export const month_event_details_regex = /(?<=Location: )([^,]*)/
export const month_day_stamp_regex = /(\b\d{1,2}\D{0,3})?\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|(Nov|Dec)(?:ember)?)\D?(\d{1,2})?/

// https://calendar.google.com/calendar/u/1/r/eventedit
// const event_context_regex = /((?<=2:\[").+(?="))((?<=.*1:\["]).+(?="))/
// const day_regex = /\/calendar.*\/day/
