function deleteLocalStorage() {
  console.log('[Cleaner] clear LS');
  chrome.devtools.inspectedWindow.eval(
    'localStorage.clear();',
    (res, exc) => {
      if (exc) console.error('LS clear failed:', exc);
    }
  );
}

function deleteSessionStorage() {
  console.log('[Cleaner] clear SS');
  chrome.devtools.inspectedWindow.eval(
    'sessionStorage.clear();',
    (res, exc) => {
      if (exc) console.error('SS clear failed:', exc);
    }
  );
}

function deleteCookies() {
  console.log('[Cleaner] clear Cookies');
  chrome.devtools.inspectedWindow.eval('location.href;', (url, exc) => {
    if (exc || !url) {
      console.error('Konnte URL nicht ermitteln', exc);
      return;
    }
    chrome.runtime.sendMessage({ action: 'clearCookies', url: url });
  });
}

function refreshDataView() {
  const lsView     = document.getElementById('localStorage-view');
  const ssView     = document.getElementById('sessionStorage-view');
  const cookieView = document.getElementById('cookie-view');

  lsView.textContent     = 'Loading LocalStorage…';
  ssView.textContent     = 'Loading SessionStorage…';
  cookieView.textContent = 'Loading Cookies…';

  chrome.devtools.inspectedWindow.eval(
    'JSON.stringify(Object.keys(localStorage))',
    lsKeys => {
      chrome.devtools.inspectedWindow.eval(
        'JSON.stringify(Object.keys(sessionStorage))',
        ssKeys => {
          chrome.devtools.inspectedWindow.eval(
            'document.cookie',
            cookieString => {
              const ls = JSON.parse(lsKeys || '[]');
              const ss = JSON.parse(ssKeys || '[]');
              lsView.textContent = `LocalStorage: ${ls.length? ls.join(', ') : '(empty)'}\n`;
              ssView.textContent = `SessionStorage: ${ss.length? ss.join(', ') : '(empty)'}\n`;
              cookieView.textContent = `Cookies: ${cookieString || '(none)'}\n`;
            }
          );
        }
      );
    }
  );
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('clear-all').addEventListener('click', () => {
    deleteLocalStorage(); deleteSessionStorage(); deleteCookies();
    setTimeout(refreshDataView, 300);
  });
  document.getElementById('clear-LocalStorage')
    .addEventListener('click', () => {
      deleteLocalStorage(); setTimeout(refreshDataView, 300);
    });
  document.getElementById('clear-SessionStorage')
    .addEventListener('click', () => {
      deleteSessionStorage(); setTimeout(refreshDataView, 300);
    });
  document.getElementById('clear-Cookies')
    .addEventListener('click', () => {
      deleteCookies(); setTimeout(refreshDataView, 300);
    });
  document.getElementById('refresh-data-view')
    .addEventListener('click', () => {
      refreshDataView();
    });

  // Version aus dem Manifest auslesen und anzeigen
  const manifest = chrome.runtime.getManifest();
  const versionEl = document.getElementById('version');
  versionEl.textContent = versionEl.textContent + manifest.version;

  // Initiale Anzeige der Daten
  refreshDataView();  
});