chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === 'clearCookies' && msg.url) {
    // nutze URL-basiertes Löschen
    chrome.cookies.getAll({ url: msg.url }, cookies => {
      for (const c of cookies) {
        chrome.cookies.remove({
          url: msg.url,
          name: c.name,
          storeId: c.storeId
        });
      }
      sendResponse({ status: 'done' });
    });
    return true;
  }
});