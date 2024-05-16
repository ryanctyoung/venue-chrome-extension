//onReady load function
$(function () {
  chrome.storage.sync.get(["default_venues"]).then((result) => {
    const inputValue = result.default_venues.join(', ')
    $("#popup-venue-input").val(inputValue)
  })
})

$("#save").click(function() {
  const labelInput = $("#popup-venue-input").val()

  if (labelInput === undefined) {
    return
  }

  labelArray = labelInput.trim().split(',').map(s => s.trim())
  chrome.storage.sync.set({default_venues: labelArray}).then(() => {
    console.log("Default venues saved")
  })

  // send message to content script to update headers
  // chrome.tabs.query({}, tabs => {
  //     tabs.forEach(tab => {
  //     chrome.tabs.sendMessage(tab.id, msgObj);
  //   });
  // });
})