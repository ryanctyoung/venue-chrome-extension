const initialState = {events:[], venues:[]}

function dayReducer(state = initialState, action) {
  if (action.type === 'day/change') {
    const { payload } = action
    // handle day change animation
    // fadeEvents()
    // fadeHeaders()
    // get current
    return {
      ...state,
      
    }
  }
}