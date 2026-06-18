(function () {
  let shortcuts = [];

  chrome.storage.sync.get("shortcuts", (data) => {
    shortcuts = data.shortcuts || [];
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.shortcuts) {
      shortcuts = changes.shortcuts.newValue || [];
    }
  });

  function matchKeys(e, shortcutKeys) {
    const parts = shortcutKeys.split("+");
    let ctrl = false, shift = false, alt = false, meta = false, key = "";

    parts.forEach((p) => {
      const lower = p.toLowerCase();
      if (lower === "ctrl") ctrl = true;
      else if (lower === "shift") shift = true;
      else if (lower === "alt") alt = true;
      else if (lower === "meta" || lower === "command" || lower === "cmd") meta = true;
      else key = p;
    });

    const eKey = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    const sKey = key.length === 1 ? key.toUpperCase() : key;

    return (
      e.ctrlKey === ctrl &&
      e.shiftKey === shift &&
      e.altKey === alt &&
      e.metaKey === meta &&
      eKey === sKey
    );
  }

  document.addEventListener("keydown", (e) => {
    for (const s of shortcuts) {
      if (s.keys && matchKeys(e, s.keys)) {
        e.preventDefault();
        e.stopPropagation();
        chrome.runtime.sendMessage({ command: "execute-shortcut", action: s.action }).catch(() => {});
        return;
      }
    }
  }, true);

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.command === "scroll") {
      if (msg.position === "top") window.scrollTo(0, 0);
      else if (msg.position === "bottom") window.scrollTo(0, document.body.scrollHeight);
    }
  });
})();
