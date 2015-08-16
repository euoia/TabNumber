var update = function(details) {
  var tabId = details.id;
  var tabIndex = details.index;
  var tabTitle = details.title;

  // Remove the leading number if it was there.
  var numTitlePattern= /(\d*)(.*)/
  var matches = tabTitle.match(numTitlePattern);
  var title = matches[2];

  var tabNumber = tabIndex + 1;
  var newTabNumber;
  if (tabNumber > 3 && tabNumber < 10) {
    newTabNumber = parseInt(tabIndex + 1, 10);
  } else {
    newTabNumber = '';
  }

  var newTabTitle = newTabNumber + ' ' + title;

  try {
    chrome.tabs.executeScript(
      tabId,
      {
        code : "document.title = '" + newTabTitle + "';"
      }
    );
  } catch(e) {}
};


function updateAll() {
  chrome.tabs.query({}, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      update(tab);
    }
  });
}

chrome.tabs.onMoved.addListener(function(id) {
  updateAll();
});

chrome.tabs.onRemoved.addListener(function(id) {
  updateAll();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  update(tab);
});

updateAll();
