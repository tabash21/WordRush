const fs = require("fs");
const path = "../../constants/wordBanks/eng.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));
const originalCount = data.words.length;
const uniqueWords = [...new Set(data.words)];
const newCount = uniqueWords.length;
data.words = uniqueWords;
fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(
  "Original: " +
    originalCount +
    ", Unique: " +
    newCount +
    ", Removed: " +
    (originalCount - newCount),
);
