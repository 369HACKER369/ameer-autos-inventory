

## Fix: WhatsApp Share Must Send Bill as PNG Image, Not Text

### Problem
The `shareViaWhatsApp` function currently falls back to opening `wa.me/?text=...` with plain text. Even when `navigator.share` is available, it downloads the image separately and opens WhatsApp with text — the image is never directly shared as a file.

### Root Cause
The code splits into two actions (download + open wa.me with text) instead of using `navigator.share({ files: [pngFile] })` directly, which would let the OS share sheet handle sending the image to WhatsApp natively.

### Plan

**File: `src/pages/BillHistory.tsx`**

Rewrite `shareViaWhatsApp` to prioritize image-file sharing:

1. **Primary path** — Use `navigator.share` with the PNG file only (no text fallback alongside it). When `navigator.canShare({ files })` is true, call `navigator.share({ files: [file] })`. This opens the native Android share sheet where WhatsApp appears as an option, and the image is sent directly as a photo.

2. **Fallback path** — If `navigator.share` or file sharing isn't supported, download the PNG and show a toast instructing the user to open WhatsApp and attach the saved image. Do NOT open `wa.me/?text=` at all — the requirement is image-only sharing.

3. **Image quality** — Update the `captureBillAsImage` call in the `useEffect` render pipeline to use `pixelRatio: 3` for higher resolution (~1080px+ width output), ensuring the PNG is sharp on phone screens.

4. Also fix `shareFile` (used by the generic "Share" button) with the same image-first approach — share the PNG file via `navigator.share`, fall back to download only.

### Changes Summary
- **1 file modified**: `src/pages/BillHistory.tsx` — rewrite `shareViaWhatsApp` and `shareFile` functions
- No data model, billing logic, or calculation changes

