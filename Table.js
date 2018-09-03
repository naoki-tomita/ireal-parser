function toCSVString(jarr) {
  const set = new Set();
  jarr.forEach(j => Object.keys(j).forEach(x => set.add(x)));
  return `"${[...set].join(`","`)}"\n${jarr.map(j => `"${[...set].map(k => j[k] || "").join(`","`)}"`).join(`\n`)}`;
}

module.exports.toCSVString = toCSVString;