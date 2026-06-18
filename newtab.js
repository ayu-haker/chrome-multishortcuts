(function () {
  const STORAGE_KEY = "homepage_shortcuts";

  // Default shortcuts
  const DEFAULTS = [
    { name: "Gmail", url: "https://mail.google.com", icon: "✉" },
    { name: "YouTube", url: "https://youtube.com", icon: "▶" },
    { name: "GitHub", url: "https://github.com", icon: "💻" },
    { name: "Drive", url: "https://drive.google.com", icon: "📁" },
    { name: "Maps", url: "https://maps.google.com", icon: "📍" },
    { name: "Reddit", url: "https://reddit.com", icon: "🧑" },
    { name: "WhatsApp", url: "https://web.whatsapp.com", icon: "💬" },
    { name: "Calendar", url: "https://calendar.google.com", icon: "📅" },
    { name: "ChatGPT", url: "https://chat.openai.com", icon: "🤖" },
    { name: "Translate", url: "https://translate.google.com", icon: "🌐" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "💼" },
    { name: "X", url: "https://x.com", icon: "🐦" },
  ];

  let shortcuts = [];
  let editIndex = -1;

  const grid = document.getElementById("grid");
  const addBtn = document.getElementById("addBtn");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalName = document.getElementById("modalName");
  const modalUrl = document.getElementById("modalUrl");
  const modalSave = document.getElementById("modalSave");
  const modalCancel = document.getElementById("modalCancel");
  const count = document.getElementById("count");
  const counter = document.getElementById("counter");
  const searchInput = document.getElementById("searchInput");
  const suggestionsEl = document.getElementById("suggestions");
  const timeEl = document.getElementById("time");
  const dateEl = document.getElementById("date");
  let suggestionIndex = -1;
  let suggestionData = [];

  function loadShortcuts() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try { shortcuts = JSON.parse(data); }
      catch { shortcuts = [...DEFAULTS]; }
    } else {
      shortcuts = [...DEFAULTS];
    }
    render();
  }

  function saveShortcuts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
    render();
  }

  function getFavicon(url) {
    try {
      const u = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=48`;
    } catch {
      return null;
    }
  }

  function getInitials(name) {
    return name.slice(0, 2).toUpperCase();
  }

  function render() {
    grid.innerHTML = "";
    shortcuts.forEach((s, i) => {
      const tile = document.createElement("a");
      tile.className = "shortcut-tile";
      tile.href = s.url;
      tile.target = "_blank";
      tile.rel = "noopener noreferrer";

      const iconDiv = document.createElement("div");
      iconDiv.className = "tile-icon";

      const favicon = getFavicon(s.url);
      if (favicon) {
        const img = document.createElement("img");
        img.src = favicon;
        img.onerror = () => { img.style.display = "none"; iconDiv.textContent = s.icon || getInitials(s.name); };
        iconDiv.appendChild(img);
      } else {
        iconDiv.textContent = s.icon || getInitials(s.name);
      }

      const label = document.createElement("div");
      label.className = "tile-label";
      label.textContent = s.name;

      const del = document.createElement("div");
      del.className = "delete-icon";
      del.textContent = "×";
      del.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        shortcuts.splice(i, 1);
        saveShortcuts();
      });

      const edit = document.createElement("div");
      edit.className = "edit-icon";
      edit.textContent = "✎";
      edit.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(i);
      });

      tile.appendChild(iconDiv);
      tile.appendChild(label);
      tile.appendChild(del);
      tile.appendChild(edit);
      grid.appendChild(tile);
    });

    count.textContent = `(${shortcuts.length})`;
    counter.textContent = `✨ ${shortcuts.length} shortcut${shortcuts.length !== 1 ? "s" : ""} — No limits!`;
  }

  function openModal(index) {
    editIndex = index;
    if (index === -1) {
      modalTitle.textContent = "Add Shortcut";
      modalName.value = "";
      modalUrl.value = "";
    } else {
      modalTitle.textContent = "Edit Shortcut";
      modalName.value = shortcuts[index].name;
      modalUrl.value = shortcuts[index].url;
    }
    modal.classList.add("active");
    setTimeout(() => modalName.focus(), 100);
  }

  function closeModal() {
    modal.classList.remove("active");
    editIndex = -1;
  }

  function saveModal() {
    let name = modalName.value.trim();
    let url = modalUrl.value.trim();
    if (!name) { alert("Please enter a name."); return; }
    if (!url) { alert("Please enter a URL."); return; }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    if (editIndex === -1) {
      shortcuts.push({ name, url, icon: name[0].toUpperCase() });
    } else {
      shortcuts[editIndex] = { ...shortcuts[editIndex], name, url };
    }
    saveShortcuts();
    closeModal();
  }

  // Event listeners
  addBtn.addEventListener("click", () => openModal(-1));
  modalSave.addEventListener("click", saveModal);
  modalCancel.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  modalName.addEventListener("keydown", (e) => { if (e.key === "Enter") modalUrl.focus(); });
  modalUrl.addEventListener("keydown", (e) => { if (e.key === "Enter") saveModal(); });

  // Search suggestions
  function goToQuery(query) {
    if (!query) return;
    if (query.includes(".") && !query.includes(" ")) {
      let url = query;
      if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
      window.location.href = url;
    } else {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
  }

  function selectSuggestion(index) {
    if (index >= 0 && index < suggestionData.length) {
      const q = suggestionData[index];
      searchInput.value = q;
      goToQuery(q);
    }
  }

  function highlightSuggestion(index) {
    document.querySelectorAll(".suggestion-item").forEach((el, i) => {
      el.classList.toggle("highlighted", i === index);
    });
  }

  function renderSuggestions(items) {
    suggestionData = items;
    suggestionsEl.innerHTML = "";
    if (!items || items.length === 0) {
      suggestionsEl.classList.remove("active");
      return;
    }
    items.forEach((item, i) => {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.innerHTML = `<span class="query">${item}</span><span class="type">search</span>`;
      div.addEventListener("click", () => selectSuggestion(i));
      div.addEventListener("mouseenter", () => {
        suggestionIndex = i;
        highlightSuggestion(i);
      });
      suggestionsEl.appendChild(div);
    });
    suggestionsEl.classList.add("active");
  }

  let debounceTimer;
  let fetchingSuggestions = false;

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim();
    if (query.length < 2) {
      suggestionsEl.classList.remove("active");
      suggestionIndex = -1;
      return;
    }
    debounceTimer = setTimeout(() => {
      if (fetchingSuggestions) return;
      fetchingSuggestions = true;
      const callbackName = "suggestCallback_" + Date.now();
      const script = document.createElement("script");
      window[callbackName] = (data) => {
        renderSuggestions(data[1] || []);
        delete window[callbackName];
        try { script.remove(); } catch (e) {}
        fetchingSuggestions = false;
      };
      script.onerror = () => { fetchingSuggestions = false; };
      script.src = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}&callback=${callbackName}`;
      document.body.appendChild(script);
    }, 200);
  });

  searchInput.addEventListener("keydown", (e) => {
    const items = document.querySelectorAll(".suggestion-item");
    if (e.key === "Enter") {
      if (suggestionIndex >= 0 && items[suggestionIndex]) {
        selectSuggestion(suggestionIndex);
      } else {
        goToQuery(searchInput.value.trim());
      }
      suggestionsEl.classList.remove("active");
      suggestionIndex = -1;
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (items.length === 0) return;
      suggestionIndex = Math.min(suggestionIndex + 1, items.length - 1);
      highlightSuggestion(suggestionIndex);
      if (suggestionIndex >= 0) searchInput.value = suggestionData[suggestionIndex];
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (items.length === 0) return;
      suggestionIndex = Math.max(suggestionIndex - 1, -1);
      highlightSuggestion(suggestionIndex);
      if (suggestionIndex >= 0) searchInput.value = suggestionData[suggestionIndex];
    }
    if (e.key === "Escape") {
      suggestionsEl.classList.remove("active");
      suggestionIndex = -1;
    }
  });

  searchInput.addEventListener("blur", () => {
    setTimeout(() => {
      suggestionsEl.classList.remove("active");
      suggestionIndex = -1;
    }, 200);
  });

  searchInput.addEventListener("focus", () => {
    if (suggestionData.length > 0) suggestionsEl.classList.add("active");
  });

  // Clock
  function updateClock() {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    dateEl.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Init
  loadShortcuts();
})();
