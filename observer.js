
let timeoutId = null;
let observerDelay = 250;
setTimeout(() => { observerDelay = 20; }, 5000);

function postObserverCallbacks(observer, mutationList) {
  timeoutId = null;
  observer.disconnect();
  collectEventsCallback(mutationList);
  observer.observe(document.querySelector(observe_selector),
    {
      childList: true,
      // attributes: true,
      subtree: true
    }
  )
}

function observerCallback(mutationList, observer) {
  console.log(mutationList)
  if (timeoutId)
    clearTimeout(timeoutId);
  timeoutId = setTimeout(() => postObserverCallbacks(observer, mutationList), observerDelay);
}


const observer = new MutationObserver(observerCallback);

function addObserverIfDesiredNodeAvailable(selector) {
  var observed = document.querySelector(selector);
  if(!observed) {
      //The node we need does not exist yet.
      //Wait 500ms and try again
      window.setTimeout(addObserverIfDesiredNodeAvailable,100);
      return;
  }
  observer.observe(observed,
    {
      childList: true,
      // attributes: true,
      subtree: true
    }
  );
}