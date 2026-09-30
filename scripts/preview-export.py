"""Build output for the hosted preview: one index.html (every route inside, switched by #hash) plus assets.
Usage: NEXT_PUBLIC_PREVIEW=1 STATIC_EXPORT=1 npx next build && python3 scripts/preview-export.py out <dir>
"""
import os, re, shutil, sys

src, dst = sys.argv[1], sys.argv[2]
shutil.rmtree(dst, ignore_errors=True)
shutil.copytree(os.path.join(src, "_next"), os.path.join(dst, "assets"))
s = open(os.path.join(src, "index.html"), encoding="utf-8").read().replace("_next/", "assets/")
s = re.sub(r'<link rel="icon"[^>]*>', "", s)
open(os.path.join(dst, "index.html"), "w", encoding="utf-8").write(s)
for root, _, files in os.walk(os.path.join(dst, "assets")):
    for f in files:
        p = os.path.join(root, f)
        if f.startswith("_") or f.endswith(".ico"):
            os.remove(p)
        elif f.endswith((".js", ".css")):
            t = open(p, encoding="utf-8").read()
            open(p, "w", encoding="utf-8").write(t.replace("_next/", "assets/").replace("�", "\\uFFFD"))
print("ok", os.path.getsize(os.path.join(dst, "index.html")))
