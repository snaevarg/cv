# CV / Ferilskrá

Simple, fast, and reliable CV hosting using GitHub Pages, Cloudflare, and Mozilla's PDF.js.

## 🌐 Live Sites

- **English**: [sveinbjorn.dev](https://sveinbjorn.dev)
- **Íslenska**: [sveinbjörn.is](https://sveinbjörn.is)

## 📁 Repository Structure

```
├── index.html          # PDF.js viewer wrapper
├── SveinbjornGeirsson.pdf  # CV document
├── CNAME               # Custom domain configuration
└── README.md           # This file
```

## 🏗️ Architecture

This setup provides a **zero-cost, highly available** CV hosting solution:

### GitHub Pages
- Hosts static files (HTML + PDF)
- Provides baseline availability and global CDN
- Automatic HTTPS for `*.github.io` domains

### Cloudflare
- **CNAME Flattening**: Enables root domain (`sveinbjorn.dev`) to point to GitHub Pages
- **Global CDN**: Worldwide caching and edge delivery
- **Enhanced HTTPS**: SSL/TLS termination and security features
- **Analytics & Performance**: Real-time insights and optimization

### Mozilla PDF.js
- Client-side PDF rendering via `mozilla.github.io/pdf.js`
- No server-side processing required
- Full-featured PDF viewer with navigation, zoom, search
- Works across all modern browsers

## 🔧 Technical Details

The `index.html` file is a minimal wrapper that:
1. Loads Mozilla's hosted PDF.js viewer
2. Passes the PDF URL as a parameter
3. Provides a clean, full-screen viewing experience

**PDF.js URL structure:**
```
https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}
```

## 🌍 Benefits

- **Zero hosting costs** (GitHub Pages + Cloudflare free tiers)
- **Maximum uptime** (dependent only on GitHub + Cloudflare)
- **Global performance** (CDN edge caching worldwide)
- **Automatic HTTPS** (SSL/TLS encryption)
- **No maintenance** (static files, no server management)
- **Professional features** (custom domains, analytics)

## 🔄 Deployment

1. Push changes to the `main` branch
2. GitHub Pages automatically deploys updates
3. Cloudflare invalidates cache and serves new content globally
4. Changes are live within minutes

## 🌐 Domain Configuration

The CNAME file contains the custom domain, enabling GitHub Pages to serve content at:
- `sveinbjorn.dev` (English version)
- `sveinbjörn.is` (Icelandic version)

Cloudflare DNS is configured with CNAME flattening to point the root domains to the respective GitHub Pages URLs.

---

*This architecture demonstrates a modern, cost-effective approach to hosting professional documents with enterprise-grade reliability and performance.*