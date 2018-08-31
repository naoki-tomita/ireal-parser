
const DATA_TYPE = {
  iRealPro: "irealpro",
  iRealBook: "irealbook",
};

const IRealProKeys = ["title", "composer", "a2", "style", "key", "actualKey", "actualStyle", "actualTempo", "actualRepeats"];

function reverse(str, index, length) {
  return substr(str, index, length).split("").reverse().join("");
}

function substr(str, index, length) {
  return str.substr(index, length);
}

function fixName(name) {
  return name.split(" ").reverse().join(" ");
}

function parse(songData) {
  // https://metacpan.org/source/JV/Data-iRealPro-1.09/lib/Data/iRealPro/Song.pm#PData::iRealPro::Song
  // ↑ says song token is start with 1r34LbKcu7.
  songData = songData.replace("1r34LbKcu7", "");
  songData = hussle(songData);
  songData = songData
    .replace(/XyQ/g, "   ")
    .replace(/LZ/g, " |")
    .replace(/Kcl/g, "| x");
  return songData;
}

function hussle(str) {
  let arr = str.split("");
  let result = "";
  while (arr.length > 50) {
    const segment = arr.splice(0, 50).join("");
    if (arr.length < 2) {
      result += arr.join("");
      continue;
    }
    result += parseSegment(segment);
  }
  return result += arr.join("");
}

function parseSegment(segment) {
  const arr = [
    reverse(segment, 45, 5),
    substr(segment, 5, 5),
    reverse(segment, 26, 14),
    substr(segment, 24, 2),
    reverse(segment, 10, 14),
    substr(segment, 40, 5),
    reverse(segment, 0, 5),
  ];
  return arr.join("");
}


class Song {
  constructor(str) {
    const songDataArray = str.split("=");
    if (songDataArray.length < 10) {
      console.log(str);
    }
    this.variant = songDataArray.length === 10
      ? DATA_TYPE.iRealPro
      : DATA_TYPE.iRealBook;
    this.title = songDataArray[0];
    this.composer = fixName(songDataArray[1]);
    this.a2 = songDataArray[2];
    this.style = songDataArray[3];
    this.key = songDataArray[4];
    this.actualKey = songDataArray[5];
    const raw = songDataArray[6];
    this.actualStyle = songDataArray[7];
    this.actualTempo = songDataArray[8];
    this.actualRepeats = songDataArray[9];
    if (raw) {
      this.data = parse(raw);
    }
  }

  toJSON() {
    return {
      ...IRealProKeys.reduce((p, k) => ({ ...p, [k]: this[k] }), {}),
      data: this.data,
    };
  }
}

module.exports.Song = Song;
