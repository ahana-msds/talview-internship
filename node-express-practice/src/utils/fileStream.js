const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

/**
 * utility to demonstrate the 'stream' module.
 * streams are more memory-efficient than reading entire files into memory.
 */
class StreamDemo {

    /**
     * streams the user data file and converts it to uppercase as a demonstration.
     */
    streamUsersToResponse(res) {
        const filePath = path.join(__dirname, '..', 'data', 'users.json');

        // check if file exists using fs.access
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('file not found');
        }

        // set appropriate content type
        res.setHeader('Content-Type', 'application/json');

        // 1. stream module: creating a read stream
        const readStream = fs.createReadStream(filePath);

        // demonstrating a transform stream (simple case)
        const upperCaseTransform = new Transform({
            transform(chunk, encoding, callback) {
                // convert chunk to string and uppercase
                const transformed = chunk.toString().toUpperCase();
                callback(null, transformed);
            }
        });

        // pipe: read stream -> transform stream -> response (write stream)
        // this demonstrates the power of streams for data processing
        readStream
            .pipe(upperCaseTransform)
            .pipe(res);

        readStream.on('error', (err) => {
            console.error('stream error:', err);
            res.status(500).end('error streaming file');
        });
    }
}

module.exports = new StreamDemo();
