// Narration plan for "Le commencement d'Adam" (voice-over recorded separately, ~2.6 words/s).
// [start, end, text] in seconds; "|" splits a line into on-screen subtitle chunks.
// Shared by film.html (burned-in subtitles) and make_srt.js (SRT export).
const NARRATION = [
  [0.5, 6.0, "Avant l'apparition de l'humanité,|Allah annonça aux anges|qu'Il allait établir un représentant sur Terre."],
  [6.5, 13.6, "Les anges demandèrent pourquoi y serait établi|celui qui pourrait y semer le désordre|et répandre le sang."],
  [14.1, 20.7, "Allah enseigna à Adam les noms de toutes choses,|révélant ainsi un savoir qu'Il lui avait accordé."],
  [21.2, 26.6, "Puis vint l'ordre de se prosterner.|Tous obéirent, sauf Iblis,|qui refusa par orgueil."],
  [27.1, 34.0, "Dans le Jardin, Adam et son épouse|reçurent une interdiction.|Mais ils furent trompés|et goûtèrent à l'arbre."],
  [34.5, 39.6, "Ils reconnurent leur faute et se repentirent.|Allah accueillit le repentir d'Adam."],
  [40.1, 49.4, "Puis Adam et son épouse descendirent sur Terre.|Allah leur promit une guidée :|ceux qui la suivraient|ne seraient ni égarés ni malheureux."],
  [49.8, 57.6, "Et c'est ainsi que commença l'histoire de l'humanité.|Une histoire qui nous rappelle la miséricorde d'Allah|et l'importance du repentir."],
];

// Chunk timing: duration proportional to letters, plus a breath after a full stop.
function subtitleChunks() {
  const out = [];
  for (const [s, e, text] of NARRATION) {
    const parts = text.split("|");
    const w = parts.map(p => p.replace(/\s/g, "").length + (/[.:]$/.test(p) ? 6 : 0));
    const tot = w.reduce((a, b) => a + b, 0);
    let t = s;
    parts.forEach((p, i) => {
      const d = (e - s) * w[i] / tot;
      out.push({ start: +t.toFixed(2), end: +(t + d).toFixed(2), text: p.replace(/'/g, "’").replace(/ :/g, " :") });
      t += d;
    });
  }
  return out;
}
if (typeof module !== "undefined") module.exports = { NARRATION, subtitleChunks };
