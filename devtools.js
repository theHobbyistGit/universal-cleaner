// Legt beim Öffnen der DevTools einen neuen Tab "Cleaner" an, der panel.html lädt
chrome.devtools.panels.create(
  "Cleaner",
  "",
  "panel.html"
);