function daysAction(events, venues) {
  return {
    type: 'DAYS/UPDATE',
    payload: {
      events:events,
      venues: venues,
    }
  }
}