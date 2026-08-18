# Light Matter

A simple image viewer with HDR photo support for Windows and Linux (macOS support is coming soon).

<a href="https://apps.microsoft.com/detail/9P96SPR78HM8?cid=github"><img src="https://get.microsoft.com/images/en-us%20dark.svg" width="200"/></a>

<a href="https://github.com/Auxx/light-matter/releases"><img src="https://docs.appimage.org/_images/download-appimage-banner.svg" width="200" alt="Download Light Matter AppImage for Linux"/></a>

## Installation

### Windows

The preferred way to install Light Matter on Windows is from [Microsoft Store](https://apps.microsoft.com/detail/9P96SPR78HM8).

You can alternatively download an unsigned EXE installer from [GitHub Release](https://github.com/Auxx/light-matter/releases) page.

### Linux

Download the latest `LightMatter-*.AppImage` from the [GitHub Release](https://github.com/Auxx/light-matter/releases) page, make it executable, and run it:

```bash
chmod +x LightMatter-*.AppImage
./LightMatter-*.AppImage
```

## Features

- SDR image rendering;
- HDR image rendering;
- Wide gamut support;
- Colour profile support;
- Simple photo gallery browser with customisable locations.

## Supported image formats

- JPEG
- JPEG with gain maps (UltraHDR)
- JPEG XL
- AVIF
- PNG
- WebP
- SVG
- GIF
- BMP

## Windows 11 ACM note

When using ACM on Windows 11 in SDR display mode (HDR mode is NOT affected!)
you will need to enable `Use legacy display ICC colour management`
in Compatibility settings in Light Matter properties.
To do so, right-click on an app icon in Windows Explorer, then click on Properties.

Do NOT enable this legacy setting in HDR display mode!
