const fs = require("fs");

const readStream = fs.createReadStream("sample.txt");
const writeStream = fs.createWriteStream("copy.txt");

readStream.pipe(writeStream);

console.log("File copied using pipe");
