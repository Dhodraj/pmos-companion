#!/usr/bin/env python3
"""PMOS PRD -> premium PDF.  markdown -> styled HTML (mermaid) -> Chrome print-to-PDF."""
import re, subprocess, pathlib, base64, html, sys

SRC = pathlib.Path("~/Documents/Personal/t4g-hackathon-2026/product/00-PRD.md")
BUILD = pathlib.Path("/tmp/prd-build")
OUT_HTML = BUILD / "prd.html"
OUT_PDF = pathlib.Path("~/Documents/Personal/t4g-hackathon-2026/product/PMOS-PRD.pdf")

md = SRC.read_text(encoding="utf-8")

# ---------- 1. strip the markdown cover + footer (we build our own) ----------
md = re.sub(r'^<div align="center">.*?</div>\s*', '', md, flags=re.S)
md = re.sub(r'<div align="center">\s*\n+### 🩺.*?</div>\s*$', '', md, flags=re.S)

# ---------- 2. pull out mermaid blocks ----------
mermaids = []
def _grab(m):
    mermaids.append(m.group(1))
    return f"\n\nMMDPLACEHOLDER{len(mermaids)-1}ENDMMD\n\n"
md = re.sub(r'```mermaid\n(.*?)```', _grab, md, flags=re.S)

# ---------- 3. markdown -> html ----------
tmp_md = BUILD / "_body.md"
tmp_md.write_text(md, encoding="utf-8")
body = subprocess.run(
    ["pandoc", "--from=gfm", "--to=html5", "--wrap=none", str(tmp_md)],
    capture_output=True, text=True, check=True).stdout

# ---------- 4. re-inject mermaid ----------
for i, code in enumerate(mermaids):
    kind = code.strip().split()[0]
    wide = " land" if kind in ("erDiagram", "gantt") else ""
    fig = (f'<figure class="dgm{wide}"><pre class="mermaid">{html.escape(code)}</pre>'
           f'<figcaption>Figure {i+1}</figcaption></figure>')
    body = re.sub(rf'<p>MMDPLACEHOLDER{i}ENDMMD</p>', fig, body)
    body = body.replace(f'MMDPLACEHOLDER{i}ENDMMD', fig)

# ---------- 5. requirement-ID chips + verdict pills ----------
body = re.sub(r'<strong>((?:FR|NFR|REG|ADR|G|D|R)-?\d+)</strong>',
              r'<code class="rid">\1</code>', body)
body = re.sub(r'<strong>(SHALL NOT|SHALL)</strong>', r'<span class="shall">\1</span>', body)
body = re.sub(r'<td>((?:FR|NFR|REG)-\d+)</td>', r'<td><code class="rid">\1</code></td>', body)

# ---------- 6. assets ----------
def b64(p):
    return base64.b64encode(pathlib.Path(p).read_bytes()).decode()

fonts = ""
for w in (400, 500, 600, 700):
    fonts += (f"@font-face{{font-family:Schibsted;font-weight:{w};font-style:normal;"
              f"src:url(data:font/ttf;base64,{b64(BUILD/'fonts'/f'SG-{w}.ttf')}) format('truetype');}}\n")
fonts += (f"@font-face{{font-family:JBMono;font-weight:400;"
          f"src:url(data:font/ttf;base64,{b64(BUILD/'fonts'/'JetBrainsMono-Regular.ttf')}) format('truetype');}}\n")

mermaid_js = (BUILD / "node_modules/mermaid/dist/mermaid.min.js").read_text(encoding="utf-8")

CSS = r"""
:root{
  --ink:#0B1220; --ink2:#1E293B; --muted:#64748B; --line:#E2E8F0; --bg:#FFFFFF;
  --accent:#6D28D9; --accent-soft:#F5F3FF; --accent-line:#DDD6FE;
  --cyan:#0E7490; --green:#15803D; --amber:#B45309; --red:#B91C1C;
  --surface:#F8FAFC;
}
*{box-sizing:border-box}
@page{ size:A4; margin:16mm 14mm 15mm 14mm; }
@page:first{ margin:0; }
html{-webkit-print-color-adjust:exact; print-color-adjust:exact;}
body{
  font-family:Schibsted,'Noto Sans',sans-serif; color:var(--ink); background:var(--bg);
  font-size:9.6pt; line-height:1.62; margin:0;
  font-feature-settings:'ss01' 1;
}

/* ---------- COVER ---------- */
.cover{
  position:relative; height:297mm; width:210mm; margin:0; padding:26mm 22mm;
  background:
    radial-gradient(1100px 620px at 118% -8%, rgba(109,40,217,.42), transparent 62%),
    radial-gradient(760px 520px at -18% 108%, rgba(14,116,144,.34), transparent 60%),
    linear-gradient(158deg,#070B16 0%,#0F172A 52%,#141B33 100%);
  color:#fff; page-break-after:always; display:flex; flex-direction:column;
  overflow:hidden;
}
.cover::after{
  content:""; position:absolute; inset:0;
  background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);
  background-size:34px 34px; mask-image:radial-gradient(circle at 78% 14%,#000,transparent 72%);
}
.cover>*{position:relative; z-index:2}
.badge{
  display:inline-flex; align-items:center; gap:7px; align-self:flex-start;
  font-size:7.6pt; font-weight:600; letter-spacing:.13em; text-transform:uppercase;
  padding:6px 13px; border-radius:100px;
  background:rgba(255,255,255,.09); border:1px solid rgba(255,255,255,.20); color:#DDD6FE;
}
.cover h1{
  font-size:53pt; line-height:1.0; font-weight:700; letter-spacing:-.033em;
  margin:26mm 0 0; color:#fff;
}
.cover h1 em{
  font-style:normal; display:block; font-size:20pt; font-weight:500; letter-spacing:-.012em;
  color:#C4B5FD; margin-top:11px;
}
.tagline{
  font-size:13.5pt; line-height:1.5; font-weight:400; color:#CBD5E1;
  max-width:132mm; margin:13mm 0 0; border-left:3px solid var(--accent); padding-left:15px;
}
.spacer{flex:1}
.cover-meta{
  display:grid; grid-template-columns:repeat(2,1fr); gap:0;
  border-top:1px solid rgba(255,255,255,.16); padding-top:9mm;
}
.cover-meta div{padding:5px 0}
.cover-meta dt{
  font-size:7.2pt; letter-spacing:.14em; text-transform:uppercase; color:#7C8BA5;
  font-weight:600; margin-bottom:3px;
}
.cover-meta dd{margin:0; font-size:10.5pt; font-weight:500; color:#F1F5F9}
.cover-foot{
  display:flex; justify-content:space-between; align-items:baseline;
  margin-top:8mm; font-size:8.2pt; color:#64748B;
}
.stamp{color:#34D399; font-weight:600}

/* ---------- TYPE ---------- */
h1{
  font-size:22pt; font-weight:700; letter-spacing:-.026em; line-height:1.16;
  margin:14mm 0 5mm; padding-bottom:3.5mm; border-bottom:2.5px solid var(--ink);
  page-break-after:avoid; page-break-inside:avoid;
}
h1:first-of-type{margin-top:0}
h2{
  font-size:13.2pt; font-weight:650; letter-spacing:-.016em; color:var(--ink);
  margin:9mm 0 3mm; page-break-after:avoid;
}
h3{
  font-size:10.8pt; font-weight:650; color:var(--ink2);
  margin:6.5mm 0 2.5mm; page-break-after:avoid;
}
h4{font-size:9.8pt;font-weight:650;color:var(--ink2);margin:5mm 0 2mm;page-break-after:avoid}
p{margin:0 0 3.2mm; orphans:3; widows:3}
strong{font-weight:650; color:var(--ink)}
em{color:var(--ink2)}
a{color:var(--accent); text-decoration:none; border-bottom:.6px solid var(--accent-line)}
hr{border:0;border-top:1px solid var(--line);margin:8mm 0}
ul,ol{margin:0 0 3.2mm; padding-left:5.2mm}
li{margin:.9mm 0}
li::marker{color:var(--accent)}

/* ---------- CODE / CHIPS ---------- */
code{
  font-family:JBMono,monospace; font-size:8.3pt; background:var(--surface);
  padding:1.4px 5px; border-radius:4px; border:.6px solid var(--line); color:var(--ink2);
}
code.rid{
  background:var(--accent-soft); border-color:var(--accent-line); color:var(--accent);
  font-weight:500; letter-spacing:.01em; white-space:nowrap;
}
.shall{
  font-family:JBMono,monospace; font-size:7.9pt; font-weight:400;
  letter-spacing:.03em; color:var(--red); background:#FEF2F2;
  padding:1px 5px; border-radius:3px; border:.6px solid #FECACA; white-space:nowrap;
}
pre:not(.mermaid){
  background:#0F172A; color:#E2E8F0; padding:4mm 5mm; border-radius:7px;
  font-family:JBMono,monospace; font-size:8pt; line-height:1.55;
  overflow-x:auto; page-break-inside:avoid; margin:0 0 4mm;
}
pre:not(.mermaid) code{background:none;border:0;color:inherit;padding:0;font-size:inherit}

/* ---------- TABLES ---------- */
table{
  width:100%; border-collapse:collapse; margin:0 0 5mm; font-size:8.5pt;
  line-height:1.48;
}
thead{display:table-header-group}
tr{page-break-inside:avoid}
tbody tr:first-child{page-break-after:avoid}
thead{background:var(--ink); }
th{
  color:#fff; font-weight:600; text-align:left; padding:2.4mm 2.6mm;
  font-size:7.9pt; letter-spacing:.045em; text-transform:uppercase;
}
td{padding:2.3mm 2.6mm; border-bottom:.6px solid var(--line); vertical-align:top}
tbody tr:nth-child(even){background:#FBFCFE}
tbody tr:last-child td{border-bottom:1.2px solid var(--line)}
table code{font-size:7.7pt}

/* ---------- CALLOUTS ---------- */
blockquote{
  margin:0 0 4.5mm; padding:3.4mm 4.5mm; background:var(--accent-soft);
  border-left:3px solid var(--accent); border-radius:0 7px 7px 0;
  page-break-inside:avoid; font-size:9pt;
}
blockquote p:last-child{margin-bottom:0}
blockquote h3,blockquote h4{margin-top:0;color:var(--accent)}
blockquote strong{color:var(--ink)}

/* ---------- DIAGRAMS ---------- */
@page land{ size:A4 landscape; margin:14mm; }
figure.dgm.land{
  page:land; page-break-before:always; page-break-after:always;
  padding:6mm 5mm 4mm;
}
figure.dgm.land svg{max-height:150mm}
figure.dgm{
  margin:0 0 6mm; padding:5mm 4mm 3mm; background:var(--surface);
  border:.8px solid var(--line); border-radius:9px;
  page-break-inside:avoid; text-align:center;
}
figure.dgm svg{max-width:100%!important; height:auto!important; max-height:225mm}
figcaption{
  margin-top:3mm; font-size:7.4pt; color:var(--muted); font-weight:500;
  letter-spacing:.09em; text-transform:uppercase;
}
.mermaid{background:none;padding:0;margin:0}

/* keep headings with their content */
h1+p,h2+p,h3+p,h2+table,h3+table,h2+figure,h3+figure,h2+blockquote{page-break-before:avoid}
"""

TPL = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>PMOS Companion — PRD</title>
<style>{fonts}{CSS}</style></head><body>

<section class="cover">
  <span class="badge">◆ Product Requirements Document</span>
  <h1>PMOS<br>Companion<em>Polyendocrine Metabolic Ovarian Syndrome</em></h1>
  <p class="tagline">The lifelong companion for the 1&nbsp;in&nbsp;8 women medicine renamed a condition for, and still does not treat.</p>
  <div class="spacer"></div>
  <div class="cover-meta">
    <div><dt>Team</dt><dd>War Room</dd></div>
    <div><dt>Version</dt><dd>1.0, July 2026</dd></div>
    <div><dt>Owners</dt><dd>Dhodraj, Belson, Rahul, Satheesh Kumar</dd></div>
    <div><dt>Launch vehicle</dt><dd>Tech for Good 2026, GDG Coimbatore</dd></div>
    <div><dt>Distribution</dt><dd>mycyclesafe.ai, 500,000+ users</dd></div>
  </div>
  <div class="cover-foot">
    <span>102 functional, 48 non-functional and 14 regulatory requirements</span>
    <span>Single source of truth</span>
  </div>
</section>

{body}

<script>{mermaid_js}</script>
<script>
mermaid.initialize({{
  startOnLoad:false, theme:'base', securityLevel:'loose',
  fontFamily:"Schibsted, 'Noto Sans', sans-serif",
  themeVariables:{{
    fontSize:'17px',
    primaryColor:'#F5F3FF', primaryTextColor:'#0B1220', primaryBorderColor:'#6D28D9',
    lineColor:'#64748B', secondaryColor:'#ECFEFF', tertiaryColor:'#F8FAFC',
    background:'#ffffff', mainBkg:'#F5F3FF', nodeBorder:'#6D28D9',
    clusterBkg:'#FFFFFF', clusterBorder:'#CBD5E1', titleColor:'#0B1220',
    edgeLabelBackground:'#ffffff',
    cScale0:'#4C1D95', cScale1:'#5B21B6', cScale2:'#6D28D9',
    cScale3:'#0E7490', cScale4:'#155E75', cScale5:'#1E293B',
    cScaleLabel0:'#FFFFFF', cScaleLabel1:'#FFFFFF', cScaleLabel2:'#FFFFFF',
    cScaleLabel3:'#FFFFFF', cScaleLabel4:'#FFFFFF', cScaleLabel5:'#FFFFFF',
    pie1:'#6D28D9', pie2:'#0E7490', pie3:'#15803D',
    git0:'#6D28D9', git1:'#0E7490',
    taskBkgColor:'#6D28D9', taskTextColor:'#FFFFFF', taskTextDarkColor:'#0B1220',
    activeTaskBkgColor:'#0E7490', activeTaskBorderColor:'#155E75',
    doneTaskBkgColor:'#CBD5E1', critBkgColor:'#B91C1C',
    sectionBkgColor:'#F8FAFC', sectionBkgColor2:'#F1F5F9',
    altSectionBkgColor:'#FFFFFF', gridColor:'#E2E8F0'
  }},
  flowchart:{{curve:'basis', htmlLabels:true, padding:16, nodeSpacing:26, rankSpacing:38,
             useMaxWidth:true, subGraphTitleMargin:{{top:8, bottom:14}}}},
  gantt:{{barHeight:20, fontSize:13, sectionFontSize:13, gridLineStartPadding:28, leftPadding:110}},
  er:{{fontSize:13, minEntityWidth:110}},
  timeline:{{padding:12}}
}});
(async () => {{
  await mermaid.run({{querySelector:'.mermaid'}});
  document.querySelectorAll('figure.dgm svg').forEach(s => {{
    s.removeAttribute('height');
    s.style.maxWidth='100%';
  }});
  document.title='RENDERED';
}})();
</script></body></html>"""

OUT_HTML.write_text(TPL, encoding="utf-8")
print(f"html   : {OUT_HTML}  ({OUT_HTML.stat().st_size/1024/1024:.1f} MB)")
print(f"diagrams: {len(mermaids)}")
