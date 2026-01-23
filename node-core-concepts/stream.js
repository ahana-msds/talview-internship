const fs = require('fs');
const { Transform } = require('stream');
const path = require('path');
const inputFile = path.join(__dirname, 'input.txt');
const outputFile = path.join(__dirname, 'output.txt');
// Helper to create a dummy file if it doesn't exist
function prepareFile() {
    if (!fs.existsSync(inputFile)) {
        fs.writeFileSync(inputFile, 'hello world\nthis is a stream test\nnode.js streams are powerful\n');
        console.log('[INFO] created dummy input.txt');
    }
}
// 1. Create a Transform Stream (Uppercase)
const upperCaseTr = new Transform({
    transform(chunk, encoding, callback) {
        // Convert chunk (Buffer) to string, uppercase it, push it to next stream
        this.push(chunk.toString().toUpperCase());
        callback();
    }
});
function runStreamPipeline() {
    prepareFile();
    console.log(`[INFO] reading from ${inputFile}...`);
    console.log(`[INFO] writing to ${outputFile}...`);
    // 2. Create Readable Stream
    const readStream = fs.createReadStream(inputFile);
    // 3. Create Writable Stream
    const writeStream = fs.createWriteStream(outputFile);
    // 4. Pipe: Read -> Transform -> Write
    readStream
        .pipe(upperCaseTr)
        .pipe(writeStream);
    // 5. Handle Events
    writeStream.on('finish', () => {
        console.log('\n[SUCCESS] stream pipeline completed.');
        console.log(`[INFO] check ${outputFile} for uppercased content.`);
    });
    readStream.on('error', (err) => {
        console.error('[ERROR] read error:', err);
    });
}
runStreamPipeline();
