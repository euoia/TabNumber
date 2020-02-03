var update = function(details, isLast) {
  var tabId = details.id;
  var tabIndex = details.index;
  var tabTitle = details.title;

  // Remove the leading number if it was there.
  var numTitlePattern= /(\d*)(.*)/
  var matches = tabTitle.match(numTitlePattern);
  var title = matches[2];

  var tabNumber = tabIndex + 1;
  var newTabNumber;
  if (tabNumber > 3 && tabNumber < 9) {
    // Tabs between 3 and 9 get a number.
    newTabNumber = parseInt(tabIndex + 1, 10);
  } else if (tabNumber > 8 && isLast === true) {
    // The last tab always uses command-9.
    newTabNumber = '9';
  } else {
    // Other tabs don't get a number.
    newTabNumber = '';
  }

  var newTabTitle = newTabNumber + ' ' + title;

  try {
    chrome.tabs.executeScript(
      tabId,
      {
        code: "document.title = `" + newTabTitle + "`;"
      }
    );
  } catch(e) {}
};


function updateAll() {
  chrome.tabs.query({}, function(tabs) {
    var isLast;

    for (var i = 0, tab; tab = tabs[i]; i++) {
      isLast = (i === tabs.length - 1);
      update(tab, isLast);
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
  updateAll();
});

updateAll();
