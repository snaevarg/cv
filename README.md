# CV / Professional Portfolio

Source code for my professional portfolio and CV, hosted at [sveinbjorn.dev](https://sveinbjorn.dev).

## Tech Stack

- **XeLaTeX** for PDF generation
- **PDF.js** for web-based PDF viewing
- **QR Code Generation** for contact information and links

## Building

Requires:
- TeX Live installation with XeLaTeX
- Iosevka font

# Generate PDF

```bash
xelatex -interaction=nonstopmode cv.tex
```