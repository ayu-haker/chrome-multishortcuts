const DEFAULT_SHORTCUTS = [
  { keys: "Ctrl+Shift+1", action: "new-tab", label: "New Tab" },
  { keys: "Ctrl+Shift+2", action: "close-tab", label: "Close Tab" },
  { keys: "Ctrl+Shift+3", action: "reopen-tab", label: "Reopen Closed Tab" },
  { keys: "Ctrl+Shift+4", action: "next-tab", label: "Next Tab" },
  { keys: "Ctrl+Shift+5", action: "prev-tab", label: "Previous Tab" },
  { keys: "Ctrl+Shift+6", action: "first-tab", label: "First Tab" },
  { keys: "Ctrl+Shift+7", action: "last-tab", label: "Last Tab" },
  { keys: "Ctrl+Shift+8", action: "duplicate-tab", label: "Duplicate Tab" },
  { keys: "Ctrl+Shift+9", action: "pin-tab", label: "Pin/Unpin Tab" },
  { keys: "Ctrl+Shift+0", action: "mute-tab", label: "Mute/Unmute Tab" },
  { keys: "Alt+Shift+N", action: "new-window", label: "New Window" },
  { keys: "Alt+Shift+W", action: "close-window", label: "Close Window" },
  { keys: "Alt+Shift+X", action: "fullscreen", label: "Toggle Fullscreen" },
  { keys: "Alt+Shift+Z", action: "zoom-reset", label: "Reset Zoom" },
  { keys: "Alt+Shift+Up", action: "scroll-top", label: "Scroll to Top" },
  { keys: "Alt+Shift+Down", action: "scroll-bottom", label: "Scroll to Bottom" },
  { keys: "Ctrl+Shift+L", action: "lock-screen", label: "Lock Screen" },
  { keys: "Ctrl+Shift+B", action: "bookmark", label: "Bookmark Page" },
  { keys: "Ctrl+Shift+H", action: "history", label: "Open History" },
  { keys: "Ctrl+Shift+E", action: "extensions", label: "Open Extensions" },
];

async function getShortcuts() {
  const { shortcuts } = await chrome.storage.sync.get("shortcuts");
  return shortcuts || DEFAULT_SHORTCUTS;
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

async function executeAction(action) {
  const tab = await getActiveTab();
  switch (action) {
    case "new-tab":
      chrome.tabs.create({});
      break;
    case "close-tab":
      if (tab) chrome.tabs.remove(tab.id);
      break;
    case "reopen-tab":
      chrome.sessions.restore();
      break;
    case "next-tab":
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const idx = tabs.findIndex((t) => t.id === tab?.id);
        const next = tabs[(idx + 1) % tabs.length];
        if (next) chrome.tabs.update(next.id, { active: true });
      });
      break;
    case "prev-tab":
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const idx = tabs.findIndex((t) => t.id === tab?.id);
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        if (prev) chrome.tabs.update(prev.id, { active: true });
      });
      break;
    case "first-tab":
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        if (tabs.length) chrome.tabs.update(tabs[0].id, { active: true });
      });
      break;
    case "last-tab":
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        if (tabs.length) chrome.tabs.update(tabs[tabs.length - 1].id, { active: true });
      });
      break;
    case "duplicate-tab":
      if (tab) chrome.tabs.duplicate(tab.id);
      break;
    case "pin-tab":
      if (tab) chrome.tabs.update(tab.id, { pinned: !tab.pinned });
      break;
    case "mute-tab":
      if (tab) chrome.tabs.update(tab.id, { muted: !tab.mutedInfo?.muted });
      break;
    case "new-window":
      chrome.windows.create({});
      break;
    case "close-window":
      if (tab) chrome.windows.remove(tab.windowId);
      break;
    case "fullscreen":
      if (tab) {
        const win = await chrome.windows.get(tab.windowId);
        chrome.windows.update(tab.windowId, { state: win.state === "fullscreen" ? "normal" : "fullscreen" });
      }
      break;
    case "zoom-reset":
      if (tab) chrome.tabs.setZoom(tab.id, 0);
      break;
    case "scroll-top":
      chrome.tabs.sendMessage(tab.id, { command: "scroll", position: "top" }).catch(() => {});
      break;
    case "scroll-bottom":
      chrome.tabs.sendMessage(tab.id, { command: "scroll", position: "bottom" }).catch(() => {});
      break;
    case "bookmark":
      if (tab) chrome.bookmarks.create({ title: tab.title, url: tab.url });
      break;
    case "history":
      chrome.tabs.create({ url: "chrome://history" });
      break;
    case "extensions":
      chrome.tabs.create({ url: "chrome://extensions" });
      break;
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === "execute-shortcut") {
    executeAction(msg.action);
    sendResponse({ success: true });
  }
  if (msg.command === "get-shortcuts") {
    getShortcuts().then((s) => sendResponse({ shortcuts: s }));
    return true;
  }
  if (msg.command === "save-shortcuts") {
    chrome.storage.sync.set({ shortcuts: msg.shortcuts }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  if (msg.command === "reset-shortcuts") {
    chrome.storage.sync.set({ shortcuts: DEFAULT_SHORTCUTS }, () => {
      sendResponse({ shortcuts: DEFAULT_SHORTCUTS });
    });
    return true;
  }
});
