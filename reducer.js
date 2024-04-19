// venue data will be saved as an array of strings for now
// venues should be persisted through Calendar description data
const initialState = {venue: []}

function venueReducer(state = initialState, action) {
  if (action.type === 'venue/update') {
    const { payload } = action

    return {
      ...state,
      venue: payload
    }
  }
}