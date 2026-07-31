# PRD PDF build

Regenerate `PMOS-PRD.pdf` from `00-PRD.md`:

```bash
cd /tmp/prd-build           # needs: node_modules/mermaid, fonts/*.ttf
python3 build-prd.py        # md -> styled HTML (mermaid inlined)
google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --run-all-compositor-stages-before-draw --virtual-time-budget=50000 \
  --no-pdf-header-footer --print-to-pdf=PMOS-PRD.pdf file:///tmp/prd-build/prd.html
```

**Deps:** `npm i mermaid@11`, Inter + JetBrains Mono TTFs in `fonts/`, pandoc, Google Chrome.

**Notes**
- Fonts and mermaid.js are base64-inlined → the HTML is fully self-contained.
- `erDiagram` and `gantt` figures auto-render on **landscape** pages (too wide for portrait).
- Mermaid `timeline` does **not** support `<br/>` — use repeated `:` for multi-line events.
- Wide `flowchart LR` diagrams become unreadable when scaled to A4 portrait; prefer `TB`.
