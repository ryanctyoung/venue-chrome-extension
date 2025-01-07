
// Day View, scroll through overlapping events
function EventScroll(div) {
  let list = []
  let index = 0
  
  this.enter = (elements) => {

    // check if the list is the same just different order
    

    index = 0 
    list = [...elements]
    if (list.length == 0) {
      return
    } 
    
  }

  this.scroll = (delta) => {
    console.log(list)
    if (list.length == 0) {
      return
    }
    console.log(delta)
    list[index].style.zIndex = '0'
    index =  delta < 0 ? Math.max(0, index - 1) : Math.min(list.length - 1, index + 1)
    console.log(index)
    list[index].style.zIndex = '100'
  }


  this.exit = () => {
    list = []
    index = 0 
  }
}