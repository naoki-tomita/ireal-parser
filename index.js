const { readFileSync, writeFileSync } = require("fs");
const { Song } = require("./Song");
const { toCSVString } = require("./Table");

let result = readFileSync("./sample.txt", { encoding: "utf-8" });
result = result.replace(/^irealb:\/\//, "");
result = decodeURIComponent(result);

const songs = result.split("===").slice(0, -1).map(s => new Song(s));

// writeFileSync("./sample.json", JSON.stringify(songs.map(s => s.toJSON()), "", "  "));
writeFileSync("./sample.csv", toCSVString(songs.map(s => s.toJSON())));
