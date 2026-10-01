// Turns the simple line format used in src/notes-content.ts into Payload's rich text (Lexical) JSON.
let ids = 0;
const inline = (s: string) => {
  const out: object[] = [];
  for (const part of s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).filter(Boolean)) {
    const bold = part.startsWith("**"), italic = !bold && part.startsWith("*");
    const text = bold ? part.slice(2, -2) : italic ? part.slice(1, -1) : part;
    out.push({ type: "text", text, format: bold ? 1 : italic ? 2 : 0, detail: 0, mode: "normal", style: "", version: 1 });
  }
  return out;
};
const el = (type: string, children: object[], extra: object = {}) => ({ type, children, direction: "ltr", format: "", indent: 0, version: 1, ...extra });

export function toLexical(lines: string[]) {
  const children: object[] = [];
  let list: object[] | null = null;
  for (const line of lines) {
    if (line.startsWith("- ")) {
      if (!list) children.push(el("list", (list = []), { listType: "bullet", start: 1, tag: "ul" }));
      list.push(el("listitem", inline(line.slice(2)), { value: list.length + 1 }));
      continue;
    }
    list = null;
    const media = line.match(/^\[media\]\(([^|)]+)\|?([^|)]*)\|?([^)]*)\)$/);
    if (media)
      children.push({
        type: "block",
        version: 2,
        format: "",
        fields: { id: `seed${(ids++).toString(16).padStart(20, "0")}`, blockName: "", blockType: "noteMedia", source: "url", url: media[1], caption: media[2], size: media[3] || "text" },
      });
    else if (line.startsWith("## ")) children.push(el("heading", inline(line.slice(3)), { tag: "h2" }));
    else if (line.startsWith("> ")) children.push(el("quote", inline(line.slice(2))));
    else children.push(el("paragraph", inline(line), { textFormat: 0, textStyle: "" }));
  }
  return { root: el("root", children) };
}
