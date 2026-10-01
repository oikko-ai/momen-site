import { Fragment } from "react";

// A title whose words rise one after another. Line breaks typed in the CMS are kept.
export default function Words({ text, as: Tag = "h1", className = "", start = 0 }: { text: string; as?: "h1" | "h2" | "p"; className?: string; start?: number }) {
  const lines = text.split("\n").map((line) => line.split(" ").filter(Boolean));
  const offsets = lines.map((_, i) => lines.slice(0, i).reduce((n, l) => n + l.length, start));
  return (
    <Tag className={`words ${className}`} aria-label={text.replace(/\n/g, " ")}>
      {lines.map((words, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {words.map((word, j) => (
            <Fragment key={j}>
              {j > 0 && " "}
              <span aria-hidden>
                <span style={{ ["--w" as string]: offsets[i] + j }}>{word}</span>
              </span>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </Tag>
  );
}
