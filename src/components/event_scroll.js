
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
    let tempLeft = list[index].style.left
    list[index].style.zIndex = '4'
    nextIndex =  index >= list.length - 1 ? 0 : index + 1
    let oldLeft = list[nextIndex].style.left
    list[index].style.left = oldLeft
    list[nextIndex].style.left = tempLeft

    list[nextIndex].style.zIndex = '100'
    index = nextIndex
  }


  this.exit = () => {
    list = []
    index = 0 
  }
}