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

// 2) Ansicht aktualisieren
function refreshDataView() {
  const view = document.getElementById('data-view');
  view.textContent = 'Lade Daten…';

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
              let out = `LocalStorage: ${ls.length? ls.join(', ') : '(leer)'}\n`;
              out += `SessionStorage: ${ss.length? ss.join(', ') : '(leer)'}\n`;
              out += `Cookies: ${cookieString || '(keine)'}\n`;
              view.textContent = out;
            }
          );
        }
      );
    }
  );
}

// 3) Klick-Handler binden & initial laden
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

  // Erstmalige Befüllung
  refreshDataView();
});