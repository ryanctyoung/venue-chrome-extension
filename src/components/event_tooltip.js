
// keep an array of events. queue and dequeue from it using id 
function EventToolTip(div) {
  this.html = div
  this.queue = new Set()
  
  this.add = (e, loc) => {
    this.queue.add(e)
    let text = [...this.queue].join(', ') + ` @ ${loc}`
    this.html.textContent = text
  }

  this.clear = () => {
    this.queue.clear()
  }
}

// example of instantiation: const eventToolTip = new EventToolTip(div)
// eventToolTip.update(event) , should add new event to the text