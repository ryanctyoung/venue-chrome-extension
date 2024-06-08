function addObserverIfDesiredNodeAvailable(selector, callBack) {
  function postObserverCallbacks(mutationList, observer) {
    observer.disconnect();
    // if mutation involves day change, perform event transition animation on the existing events in the redux store.
    callBack(mutationList);
    observer.observe(document.querySelector(selector),
      {
        childList: true,
        // attributes: true,
        subtree: true
      }
    )
  }
  
  const eventsObserver = new MutationObserver(postObserverCallbacks);

  var observed = document.querySelector(selector);
  if(!observed) {
      //The node we need does not exist yet.
      //Wait 500ms and try again
      window.setTimeout(addObserverIfDesiredNodeAvailable,100);
      return;
  }
  eventsObserver.observe(observed,
    {
      childList: true,
      // attributes: true,
      subtree: true
    }
  );
}


function waitForElm(selector, source = document.body) {
  return new Promise(resolve => {
      if (source.querySelector(selector)) {
          return resolve(source.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (source.querySelector(selector)) {
              observer.disconnect();
              resolve(source.querySelector(selector));
          }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(source, {
          childList: true,
          subtree: true
      });
  });
}