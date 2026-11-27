// Writes the subtitles as SRT (same timing as the burned-in ones). usage: node make_srt.js out.srt
const { subtitleChunks } = require("./subs.js");
const ts = s => { const ms = Math.round(s * 1000), h = ms / 3600000 | 0, m = ms / 60000 % 60 | 0, sec = ms / 1000 % 60 | 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`; };
const chunks = subtitleChunks();
chunks.forEach((c, i) => { if (i && c.start < chunks[i - 1].end - 1e-6) throw new Error("overlapping subtitles at " + c.text); });
require("fs").writeFileSync(process.argv[2], chunks.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`).join("\n"));
console.log(chunks.length, "subtitles, last ends at", chunks[chunks.length - 1].end, "s");
