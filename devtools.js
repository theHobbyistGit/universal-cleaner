// Legt beim Öffnen der DevTools einen neuen Tab "Cleaner" an, der panel.html lädt
chrome.devtools.panels.create(
  "Cleaner",
  "",
  "panel.html",
  function(panel) {
    panel.onHidden.addListener(() => {
      chrome.runtime.sendMessage({ type: 'STOP_MY_INTERVAL' });
    });
    panel.onShown.addListener(() => {
      chrome.runtime.sendMessage({ type: 'START_MY_INTERVAL' });
    });
  }
);