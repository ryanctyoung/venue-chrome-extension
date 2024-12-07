const event_selector = "div[role=button][data-eventid]"

// the inclusion of 'data-keyboardactiontype' is to prevent selecting the placeholder event element present during event creation
const event_placeholder_attribute = "data-keyboardactiontype"


// const event_selector = "div[role=button][class*='GTG3wb ChfiMc rFUW1c ']"
const event_context_menu_selector = "div[class*='VfPpkd-xl07Ob-XxIAqe UQ5E0']"

const calendar_settings_selector = "div[class='DmDTHe']"

const observe_selector = "div[class=SGWAac]"
const modal_overlay_selector = "div[class='yDmH0d']"
const event_edit_selector = "div[id='YPCqFe']"



const view_mode_selector = "[jsname='jnPWCc'] > span[jsname='V67aGc'][class='AeBiU-vQzf8d']"
const column_header_selector = "div[class='Ifvtsc']"
const initial_spacing_selector = "div[class='fimTmc']"
const event_grid_selector = "div[class='Tmdkcc elYzab-cXXICe-Hjleke']"
const event_timestamp_selector = "div[class*='lhydbb gVNoLb  EiZ8Dd'], div[class='b0NTye'], span[class='EWOIrf']"

const day_column_selector = "h2[class='hI2jVc']"

const create_button = "div[class='JAPqpe K0NPx']"
const create_event_interact_selector = "div[class~='XsRa1c']" // there is a trailing whitespace in the full class name

const day_view_event_board = "div[class='feMFof A3o4Oe']"
const day_view_multi_event_container = "div[class='venue-multi-event-container']"
const day_view_datestamp = "div[class='UyW9db']"


const event_item_title = "span[class='I0UMhf']"

const event_modal_selector = "div[jsname='ssXDle']"
const event_modal_time_preinput_selector = "div[class='Shmoqf xI9Bs jzox1'] button"
const event_modal_time_input_selector = "div[class='JHD0Fd'] input"
const event_modal_time_options_selector = "div[class='w8UdJc']"
const event_modal_date_selector = "span[class='JyrDof']"
const event_details_selector = "div[class='Jcb6qd']"


const event_edit_modal_location_subselector = "div[class='ewPPR'] div[class='FrSOzf']:nth-child(2)"
const event_modal_location_selector = `div[jsname='TmcEkb'] div[class='Shmoqf'], ${event_edit_modal_location_subselector}`
const event_modal_location_label_selector = `div[jsname='TmcEkb'] div[class='rdgVoe'] div[class='x5FT4e kkUTBb'], ${event_edit_modal_location_subselector} div[class='tzcF6']`
const event_modal_location_focus_selector = `div[class~='BVTBSc'] div[class='drQEgd'] input, ${event_edit_modal_location_subselector} input`
//VfPpkd-fmcmS-wGMbrd edit input selector
// const event_modal_location_input_selector = `div[class='YwLf7b XsN7kf'], ${event_edit_modal_location_subselector} input`


const event_edit_page_selector = "div[class='p9lUpf']"

const headerClassName = "venueHeader"
const enabled_sync_name = "venue_enable"
const preset_venue_sync_name = "venue_default_venues"
const current_event_list_sync_name = "current_event_list"
const empty_venue_placeholder = 'Other'

const week_view_day_header_selector = "h2[class='hI2jVc']"
const week_view_event_details_selector = "div[class='XuJrye']"
const week_view_event_location_selector = "span[class='k7JKz'] , div[class*='lhydbb K9QN7e  EiZ8Dd']"
const week_view_day_gridcell_selector = "[role='gridcell'][class~='BiKU4b']"
const week_view_day_timeline_selector = "div[class='feMFof A3o4Oe']"
const week_view_event_board_selector = "div[class='mDPmMe']"
const week_view_event_title_selector = "span[class='I0UMhf']"
const week_view_event_timestamp_selector = "span[class='b0NTye'], div[class='lhydbb gVNoLb  EiZ8Dd TuM9nf']"
const week_view_multi_event_container_selector = "div[class='venue-multi-event-container']"
