# ⚡ MultiShortcuts Pro

**Unlimited homepage shortcuts + 20+ keyboard shortcuts for Chrome!**

Chrome's default New Tab page only allows **10 shortcuts**. MultiShortcuts Pro removes that limit entirely and adds 20+ custom keyboard shortcuts for tab management, scrolling, bookmarks, and more.

---

## ✨ Features

### 🏠 Unlimited Homepage Shortcuts
- Add **unlimited** website shortcuts on your New Tab page
- Edit, delete, and rearrange shortcuts freely
- Auto-fetches favicon for each site
- Built-in search bar (Google search or direct URL)
- Live clock & date display
- Beautiful dark gradient UI

### ⌨️ 20+ Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+1` | New Tab |
| `Ctrl+Shift+2` | Close Tab |
| `Ctrl+Shift+3` | Reopen Closed Tab |
| `Ctrl+Shift+4` | Next Tab |
| `Ctrl+Shift+5` | Previous Tab |
| `Ctrl+Shift+6` | First Tab |
| `Ctrl+Shift+7` | Last Tab |
| `Ctrl+Shift+8` | Duplicate Tab |
| `Ctrl+Shift+9` | Pin/Unpin Tab |
| `Ctrl+Shift+0` | Mute/Unmute Tab |
| `Alt+Shift+N` | New Window |
| `Alt+Shift+W` | Close Window |
| `Alt+Shift+X` | Toggle Fullscreen |
| `Alt+Shift+Z` | Reset Zoom |
| `Alt+Shift+↑` | Scroll to Top |
| `Alt+Shift+↓` | Scroll to Bottom |
| `Ctrl+Shift+L` | Lock Screen |
| `Ctrl+Shift+B` | Bookmark Page |
| `Ctrl+Shift+H` | Open History |
| `Ctrl+Shift+E` | Open Extensions |

All keyboard shortcuts are **fully customizable** — change any key combination from the popup.

---

## 📥 Installation

### Method 1: Load Unpacked (Developer Mode)
1. **Clone or download** this repo:
   ```bash
   git clone https://github.com/ayu-haker/chrome-multishortcuts.git
   ```
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle at top right)
4. Click **Load unpacked** → select the `chrome-multishortcuts` folder
5. ✅ Done! Open a New Tab to see it in action

### Method 2: Pack & Install
1. Go to `chrome://extensions` → Developer mode
2. Click **Pack extension** → select the folder
3. Drag the `.crx` file into `chrome://extensions`

---

## 🎮 How to Use

### Homepage Shortcuts
- Open a **New Tab** — you'll see 12 default shortcuts (Gmail, YouTube, GitHub, etc.)
- Click **`+`** to add a new shortcut
- **Hover** over a tile to see ✏️ (edit) and ❌ (delete) buttons
- Use the **search bar** to Google search or type a URL directly

### Keyboard Shortcuts
- Click the extension icon (or press `Ctrl+Shift+Y`) to open the popup
- Click any key input to **record** a new key combination
- Click **Apply Changes** to save
- Click **Reset Defaults** to restore original shortcuts

---

## 📁 Project Structure

```
chrome-multishortcuts/
├── manifest.json      # Extension manifest (v3)
├── background.js      # Service worker — handles all tab/window actions
├── content.js         # Content script — captures keyboard events on all pages
├── newtab.html        # Custom New Tab page UI
├── newtab.js          # New Tab page logic (shortcuts grid, search, clock)
├── popup.html         # Popup UI for managing shortcuts
├── popup.js           # Popup logic (record keys, save/reset)
└── .gitignore
```

---

## 🛠 Tech Stack

- **Manifest V3** — latest Chrome extension standard
- **Vanilla JS** — zero dependencies, lightweight
- **Chrome APIs** — `storage`, `tabs`, `sessions`, `bookmarks`, `chrome_url_overrides`
- **LocalStorage** — homepage shortcuts persistence

---

## 📝 License

MIT — free to use, modify, and distribute.

---

<p align="center">Made with ❤️ by <a href="https://github.com/ayu-haker">ayu-haker</a></p>
