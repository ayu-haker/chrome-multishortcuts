(function () {
  const list = document.getElementById("shortcutList");
  const applyBtn = document.getElementById("applyBtn");
  const resetBtn = document.getElementById("resetBtn");
  let currentShortcuts = [];

  // Tab switching
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
    });
  });

  function renderShortcuts(shortcuts) {
    list.innerHTML = "";
    shortcuts.forEach((s, i) => {
      const div = document.createElement("div");
      div.className = "shortcut-item";

      const label = document.createElement("label");
      label.textContent = s.label;

      const badge = document.createElement("span");
      badge.className = "action-badge";
      badge.textContent = s.action.replace(/-/g, " ");

      const input = document.createElement("input");
      input.type = "text";
      input.value = s.keys;
      input.readOnly = true;
      input.placeholder = "Click to record...";
      input.dataset.index = i;

      let recording = false;

      input.addEventListener("click", () => {
        if (recording) return;
        recording = true;
        input.value = "...";
        input.style.color = "#e94560";

        const handler = (e) => {
          e.preventDefault();
          e.stopPropagation();

          const parts = [];
          if (e.ctrlKey) parts.push("Ctrl");
          if (e.shiftKey) parts.push("Shift");
          if (e.altKey) parts.push("Alt");
          if (e.metaKey) parts.push("Meta");

          let key = e.key;
          if (key === "Control" || key === "Shift" || key === "Alt" || key === "Meta") return;
          if (key === " ") key = "Space";
          if (key.length === 1) key = key.toUpperCase();
          parts.push(key);

          input.value = parts.join("+");
          input.style.color = "#e0e0e0";
          recording = false;

          currentShortcuts[i] = { ...currentShortcuts[i], keys: input.value };

          document.removeEventListener("keydown", handler, true);
        };

        document.addEventListener("keydown", handler, true);
      });

      div.appendChild(label);
      div.appendChild(badge);
      div.appendChild(input);
      list.appendChild(div);
    });
  }

  async function loadShortcuts() {
    const res = await chrome.runtime.sendMessage({ command: "get-shortcuts" });
    currentShortcuts = JSON.parse(JSON.stringify(res.shortcuts));
    renderShortcuts(currentShortcuts);
  }

  applyBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ command: "save-shortcuts", shortcuts: currentShortcuts }, (res) => {
      if (res?.success) {
        applyBtn.textContent = "✓ Saved!";
        setTimeout(() => (applyBtn.textContent = "Apply Changes"), 1500);
      }
    });
  });

  resetBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ command: "reset-shortcuts" }, (res) => {
      if (res?.shortcuts) {
        currentShortcuts = JSON.parse(JSON.stringify(res.shortcuts));
        renderShortcuts(currentShortcuts);
        resetBtn.textContent = "✓ Reset!";
        setTimeout(() => (resetBtn.textContent = "Reset Defaults"), 1500);
      }
    });
  });

  // Homepage tab - show count from localStorage
  function updateHomeCount() {
    const homeCount = document.getElementById("homeCount");
    try {
      const data = localStorage.getItem("homepage_shortcuts");
      if (data) {
        const arr = JSON.parse(data);
        homeCount.textContent = arr.length;
      } else {
        homeCount.textContent = "12";
      }
    } catch {
      homeCount.textContent = "0";
    }
  }
  updateHomeCount();

  // Open new tab links
  document.getElementById("openNewTab").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: "chrome://newtab" });
  });
  document.getElementById("homeOpenBtn").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: "chrome://newtab" });
  });

  loadShortcuts();
})();
