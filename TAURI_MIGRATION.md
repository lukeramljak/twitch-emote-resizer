# Tauri Migration Guide

## Overview

The emote-resizer has been converted from a SvelteKit + Cloudflare Workers web app to a Tauri desktop application. This enables local image processing without needing to host `sharp` (which requires native binaries) on Cloudflare Workers.

## Architecture Changes

### Before: Web App
- **Frontend**: SvelteKit SPA with `adapter-cloudflare`
- **Server**: Cloudflare Workers with `sharp` for image processing
- **Processing**: Remote function calls to `command()` API
- **Deployment**: Cloudflare Workers runtime

### After: Desktop App
- **Frontend**: SvelteKit SPA with `adapter-static`
- **Backend**: Rust with Tauri commands
- **Processing**: Local Tauri IPC commands via `invoke()`
- **Deployment**: GitHub Releases with multi-platform installers

## Directory Structure

```
emote-resizer/
├── src/                          # Frontend (Tauri webview)
│   ├── routes/
│   │   ├── +page.svelte         # Main tool page
│   │   ├── +layout.svelte       # Global layout
│   │   ├── privacy/             # Privacy page
│   │   └── (deleted) resize/    # ✗ Old remote function route
│   ├── lib/
│   │   ├── emote-converter.svelte.ts  # Now uses Tauri invoke()
│   │   ├── file-uploader.svelte.ts    # Handles SVG rasterization
│   │   ├── umami.ts                   # Tauri-aware analytics
│   │   └── utils/
│   │       ├── file-processing.ts     # SVG → PNG rasterization
│   │       └── ...
│   └── app.html                  # Removed Umami, manifest
├── src-tauri/                    # ✨ New Rust backend
│   ├── src/
│   │   ├── main.rs              # Tauri entry point
│   │   ├── lib.rs               # Tauri app setup + command registration
│   │   └── commands/
│   │       ├── mod.rs
│   │       ├── shared.rs        # Shared types & helpers
│   │       ├── resize_image.rs  # Tauri command: resize_image
│   │       └── resize_gif.rs    # Tauri command: resize_gif
│   ├── Cargo.toml               # Rust dependencies
│   ├── tauri.conf.json          # Window config, build settings
│   ├── capabilities/
│   │   └── default.json         # Tauri v2 permissions
│   └── icons/                   # App icons (Windows, macOS, Linux)
├── landing/                      # ✨ New static marketing site
│   ├── src/
│   │   ├── routes/
│   │   │   ├── +page.svelte    # Landing page
│   │   │   └── privacy/        # Privacy policy
│   │   └── app.html
│   ├── svelte.config.js        # adapter-static (prerendered)
│   └── package.json
├── .github/workflows/
│   └── release.yml              # ✨ Multi-platform build + release
├── package.json                 # Updated deps
├── svelte.config.js             # Switched to adapter-static
├── wrangler.jsonc               # ✗ Deleted (Cloudflare config)
├── .env                         # ✗ Deleted (server limit)
└── src/routes/resize/           # ✗ Deleted (remote functions)
```

## Key Changes

### 1. Frontend Dependencies
**Removed**:
- `sharp` — Image processing moved to Rust
- `@sveltejs/adapter-cloudflare` — No longer targeting Workers
- `wrangler` — No Cloudflare deployment
- `valibot` — Input validation no longer needed (Rust handles it)

**Added**:
- `@sveltejs/adapter-static` — SPA for Tauri webview
- `@tauri-apps/api` — IPC to Rust commands
- `@tauri-apps/cli` — Tauri development tooling

### 2. Image Processing Logic

#### Moved from TypeScript to Rust
- `resizeImage()` → `src-tauri/src/commands/resize_image.rs`
- `resizeGif()` → `src-tauri/src/commands/resize_gif.rs`

#### Key Libraries
- `image` + `fast_image_resize` — Replaces `sharp`'s resizing (Lanczos3)
- `imagequant` — Same palette quantization library `sharp` uses internally
- `gif` — Frame-level GIF handling with delay preservation

#### Processing Flow
1. Frontend: User uploads image/GIF → stored as base64 data URL
2. Frontend: `invoke('resize_image', { file, metadata })` → IPC call
3. Backend: Rust command decodes base64 → loads with `image` crate
4. Backend: Resizes with Lanczos3 via `fast_image_resize`
5. Backend: Quantizes to 256 colors via `imagequant`
6. Backend: Encodes to PNG/GIF → returns as base64 data URL
7. Frontend: Shows results + download buttons

### 3. SVG Handling

**Before**: Returned `blob:` URL (can't be processed by Rust)

**After**: Rasterizes to PNG data URL via canvas:
1. Load SVG content as blob
2. Create object URL
3. Draw to `<canvas>`
4. Convert to PNG data URL via `toDataURL()`
5. Pass PNG to Rust

### 4. Frontend Communication

**Before**: Remote functions
```ts
const result = await resizeImage({ file, metadata });
```

**After**: Tauri invoke
```ts
const result = await invoke<ResizeResult>('resize_image', { file, metadata });
```

Error handling changed:
- Remote functions: `isHttpError()` checks + HTTP status
- Tauri commands: String rejections (from Rust `anyhow` errors)

### 5. Privacy & Analytics

**Before**:
- Processed on server (Cloudflare Workers)
- Umami analytics tracked usage
- Data sent to third parties

**After**:
- Processed locally on device
- No analytics (removed Umami)
- No data transmission
- Updated privacy policy to reflect local processing

## Building & Deploying

### Development

```bash
# Install dependencies
pnpm install

# Start dev servers (frontend on 5173, Rust auto-reloads)
pnpm dev

# Build frontend only (for testing)
pnpm build:web

# Build complete app (frontend + Rust)
pnpm build
```

### Compilation Requirements

Linux/macOS/Windows development requires system packages:

**Ubuntu/Debian**:
```bash
sudo apt-get install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

**macOS**: Xcode Command Line Tools
```bash
xcode-select --install
```

**Windows**: C++ build tools (Visual Studio or MinGW)

### Generating Custom Icons

```bash
# From SVG to Tauri icon set
pnpm tauri icon static/favicon.svg
```

### Creating Releases

```bash
# Tag a release
git tag v0.2.0
git push origin v0.2.0

# GitHub Actions automatically:
# 1. Builds for Windows, macOS (Intel + Apple Silicon), Linux
# 2. Creates installers (.msi, .dmg, .AppImage, .deb)
# 3. Uploads to GitHub Releases (as draft)
# 4. User reviews and publishes
```

### Landing Page Deployment

The `landing/` directory is a separate SvelteKit project:

```bash
cd landing
pnpm install
pnpm build

# Deploy build/ directory to Cloudflare Pages
```

Download links point to `https://github.com/lukeramljak/emote-resizer/releases/latest`.

## Testing Checklist

- [ ] `pnpm dev` opens Tauri app window
- [ ] Upload PNG → emotes and badges appear with correct sizes
- [ ] File sizes for emotes under 25KB (with palette reduction)
- [ ] Upload GIF → animated preview at 3 sizes
- [ ] Upload SVG → correctly rasterized and resized
- [ ] Download individual image works
- [ ] Download as ZIP works
- [ ] `pnpm build` creates installer for current platform
- [ ] Landing page builds and deploys

## Known Limitations

1. **System Dependencies**: Tauri development requires system packages (no longer just Node.js)
2. **GIF Frame Count**: Current implementation quantizes each frame independently. A more advanced approach would use a global color table for better consistency.
3. **SVG Limitations**: SVG rasterization uses canvas, so complex SVGs with gradients/filters may render differently than expected

## Future Improvements

1. Create a proper landing page with screenshots
2. Add app auto-update via `tauri-plugin-updater`
3. Optimize GIF processing with frame-level color table optimization
4. Add settings for:
   - Output quality (palette colors)
   - Dithering level
   - Compression options
5. Implement keyboard shortcuts (Ctrl+A to select all, etc.)
6. Add dark mode toggle (respect OS preference)
7. Support for more output formats (WEBP, AVIF)

## Troubleshooting

### Cargo build fails with missing dependencies
- Install system packages (see "Compilation Requirements")
- On Linux, ensure pkg-config is installed

### Tauri window doesn't appear
- Check that `pnpm build:web` succeeds
- Verify `devUrl` in `tauri.conf.json` points to correct dev server

### Images don't resize correctly
- Verify `canvas` is available (should be in webview)
- Check browser console for invoke errors

## References

- [Tauri Docs](https://tauri.app/v1/docs/getting-started/intro/)
- [fast_image_resize](https://docs.rs/fast_image_resize)
- [imagequant](https://docs.rs/imagequant)
- [`image` crate](https://docs.rs/image)
