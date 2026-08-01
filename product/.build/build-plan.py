#!/usr/bin/env python3
"""Clinician review pack -> PDF. brief + proposal, same house style as the PRD."""
import re, subprocess, pathlib, base64, html

H = pathlib.Path("~/Documents/Personal/t4g-hackathon-2026/hackathon")
BUILD = pathlib.Path("/tmp/prd-build")
OUT_HTML = BUILD / "build-plan.html"

md = (H / "build-plan.md").read_text(encoding="utf-8")
# the H1 is the cover title; drop it from the body
md = re.sub(r'^# Build plan\n\n', '', md)

mermaids = []
def _grab(m):
    mermaids.append(m.group(1)); return f"\n\nMMDPH{len(mermaids)-1}ENDMMD\n\n"
md = re.sub(r'```mermaid\n(.*?)```', _grab, md, flags=re.S)
md = md.replace("\\newpage", '<div class="pagebreak"></div>')

(BUILD/"_p.md").write_text(md, encoding="utf-8")
body = subprocess.run(["pandoc","--from=gfm","--to=html5","--wrap=none",str(BUILD/"_p.md")],
                      capture_output=True, text=True, check=True).stdout
for i, code in enumerate(mermaids):
    fig = f'<figure class="dgm"><pre class="mermaid">{html.escape(code)}</pre><figcaption>Figure {i+1}</figcaption></figure>'
    body = re.sub(rf'<p>MMDPH{i}ENDMMD</p>', fig, body)
body = re.sub(r'<strong>((?:FR|NFR|REG|ADR)-?\d+)</strong>', r'<code class="rid">\1</code>', body)
body = re.sub(r'<td>((?:FR|NFR|REG)-\d+)</td>', r'<td><code class="rid">\1</code></td>', body)

b64 = lambda p: base64.b64encode(pathlib.Path(p).read_bytes()).decode()
fonts = "".join(
    f"@font-face{{font-family:Schibsted;font-weight:{w};src:url(data:font/ttf;base64,{b64(BUILD/'fonts'/f'SG-{w}.ttf')}) format('truetype');}}"
    for w in (400,500,600,700))
fonts += f"@font-face{{font-family:JBMono;src:url(data:font/ttf;base64,{b64(BUILD/'fonts'/'JetBrainsMono-Regular.ttf')}) format('truetype');}}"
mjs = (BUILD/"node_modules/mermaid/dist/mermaid.min.js").read_text(encoding="utf-8")

CSS = r"""
:root{--ink:#0B1220;--ink2:#1E293B;--muted:#64748B;--line:#E2E8F0;--accent:#6D28D9;
--accent-soft:#F5F3FF;--accent-line:#DDD6FE;--red:#B91C1C;--surface:#F8FAFC;}
*{box-sizing:border-box}
@page{size:A4;margin:16mm 15mm 15mm 15mm;}
@page:first{margin:0;}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:Schibsted,'Noto Sans',sans-serif;color:var(--ink);font-size:10pt;line-height:1.62;margin:0;}
.cover{position:relative;height:297mm;padding:30mm 24mm;display:flex;flex-direction:column;
 background:radial-gradient(900px 560px at 115% -10%,rgba(109,40,217,.40),transparent 62%),
 linear-gradient(160deg,#070B16,#0F172A 55%,#141B33);color:#fff;page-break-after:always;}
.badge{align-self:flex-start;font-size:7.6pt;font-weight:600;letter-spacing:.13em;text-transform:uppercase;
 padding:6px 13px;border-radius:100px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.2);color:#DDD6FE;}
.cover h1{font-size:40pt;line-height:1.05;font-weight:700;letter-spacing:-.03em;margin:24mm 0 0;}
.cover h1 em{font-style:normal;display:block;font-size:16pt;font-weight:500;color:#C4B5FD;margin-top:12px;}
.cover .t{font-size:12.5pt;color:#CBD5E1;max-width:130mm;margin:12mm 0 0;border-left:3px solid var(--accent);padding-left:14px;}
.sp{flex:1}
.cm{border-top:1px solid rgba(255,255,255,.16);padding-top:8mm;font-size:9.5pt;color:#E2E8F0;}
.cm b{display:block;font-size:7.2pt;letter-spacing:.14em;text-transform:uppercase;color:#7C8BA5;font-weight:600;margin-bottom:2px;}
.cm div{margin-bottom:5mm}
.pagebreak{page-break-before:always;height:0}
h1{font-size:20pt;font-weight:700;letter-spacing:-.025em;margin:12mm 0 5mm;padding-bottom:3mm;
 border-bottom:2.5px solid var(--ink);page-break-after:avoid;}
h1:first-of-type{margin-top:0}
h2{font-size:12.6pt;font-weight:650;margin:8mm 0 3mm;page-break-after:avoid;}
h3{font-size:10.6pt;font-weight:650;color:var(--ink2);margin:6mm 0 2.5mm;page-break-after:avoid;}
p{margin:0 0 3.2mm;orphans:3;widows:3}
strong{font-weight:650}
a{color:var(--accent);text-decoration:none;border-bottom:.6px solid var(--accent-line)}
ul,ol{margin:0 0 3.2mm;padding-left:5.4mm}li{margin:1mm 0}li::marker{color:var(--accent)}
li:has(input[type="checkbox"]){list-style:none;margin-left:-4.2mm}
input[type="checkbox"]{accent-color:var(--accent);margin-right:1.8mm;vertical-align:-1px}
hr{border:0;border-top:1px solid var(--line);margin:7mm 0}
code{font-family:JBMono,monospace;font-size:8.4pt;background:var(--surface);padding:1.4px 5px;
 border-radius:4px;border:.6px solid var(--line);color:var(--ink2);}
code.rid{background:var(--accent-soft);border-color:var(--accent-line);color:var(--accent);white-space:nowrap}
pre:not(.mermaid){background:#0F172A;color:#E2E8F0;padding:4mm;border-radius:7px;
 font-family:JBMono,monospace;font-size:8pt;line-height:1.55;page-break-inside:avoid;margin:0 0 4mm;}
pre:not(.mermaid) code{background:none;border:0;color:inherit;padding:0}
table{width:100%;border-collapse:collapse;margin:0 0 5mm;font-size:8.7pt;line-height:1.48}
thead{background:var(--ink);display:table-header-group}
th{color:#fff;font-weight:600;text-align:left;padding:2.4mm;font-size:7.9pt;letter-spacing:.045em;text-transform:uppercase}
td{padding:2.3mm;border-bottom:.6px solid var(--line);vertical-align:top}
tr{page-break-inside:avoid}
tbody tr:nth-child(even){background:#FBFCFE}
blockquote{margin:0 0 4.5mm;padding:3.4mm 4.5mm;background:var(--accent-soft);
 border-left:3px solid var(--accent);border-radius:0 7px 7px 0;page-break-inside:avoid}
blockquote p:last-child{margin-bottom:0}
figure.dgm{margin:0 0 6mm;padding:5mm 4mm 3mm;background:var(--surface);border:.8px solid var(--line);
 border-radius:9px;page-break-inside:avoid;text-align:center}
figure.dgm svg{max-width:100%!important;height:auto!important;max-height:225mm}
figcaption{margin-top:3mm;font-size:7.4pt;color:var(--muted);letter-spacing:.09em;text-transform:uppercase}
"""

TPL = f"""<!doctype html><html><head><meta charset="utf-8"><title>PMOS Companion, build plan</title>
<style>{fonts}{CSS}</style></head><body>
<section class="cover">
  <span class="badge">Build plan</span>
  <h1>Build plan<em>PMOS Companion, 2 to 9 August 2026</em></h1>
  <p class="t">Who builds what, when, and what gets cut. Single source of truth. If this document and a message in the group disagree, this document wins.</p>
  <div class="sp"></div>
  <div class="cm">
    <div><b>Team</b>War Room, TEAM-311</div>
    <div><b>Lead</b>Dhodraj Sundaram</div>
    <div><b>Build</b>Saturday 8 to Sunday 9 August, GRD College</div>
  </div>
</section>
{body}
<script>{mjs}</script>
<script>
mermaid.initialize({{startOnLoad:false,theme:'base',securityLevel:'loose',
 fontFamily:"Schibsted,'Noto Sans',sans-serif",
 themeVariables:{{fontSize:'17px',primaryColor:'#F5F3FF',primaryTextColor:'#0B1220',
  primaryBorderColor:'#6D28D9',lineColor:'#64748B',clusterBkg:'#FFFFFF',clusterBorder:'#CBD5E1',
  edgeLabelBackground:'#ffffff',mainBkg:'#F5F3FF',nodeBorder:'#6D28D9'}},
 flowchart:{{curve:'basis',htmlLabels:true,padding:16,nodeSpacing:26,rankSpacing:38,
  useMaxWidth:true,subGraphTitleMargin:{{top:8,bottom:14}}}}}});
(async()=>{{await mermaid.run({{querySelector:'.mermaid'}});
 document.querySelectorAll('figure.dgm svg').forEach(s=>{{s.removeAttribute('height');s.style.maxWidth='100%';}});}})();
</script></body></html>"""
OUT_HTML.write_text(TPL, encoding="utf-8")
print(f"html: {OUT_HTML}  diagrams: {len(mermaids)}")
