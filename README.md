# ManoDienynas enhancer

This extension adds the following features to manodienynas:
- makes all pages print-friendly

## How to enable it?

To enable and test this extension during development:

1. **Clone or download this repository.**

2. **Open Chrome and go to:** [chrome://extensions/](chrome://extensions/)

3. **Enable "Developer mode"** (toggle in the top right corner).

4. **Click "Load unpacked"** and select the project folder

5. **For changes to take effect:**
    - After editing files, click the "Reload" button on the extension card in `chrome://extensions/`.
    - Refresh the target page.

## File Overview

- `manifest.json` — Chrome extension manifest
- `content.js` — Content script injected into supported pages


## Troubleshooting

- Make sure you are on a supported URL (`https://manodienynas.lt`)

---

