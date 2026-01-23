const fs = require('fs').promises;
const path = require('path');
async function runFsOperations() {
    const dirName = 'practice_logs';
    const fileName = 'access.log';
    const filePath = path.join(__dirname, dirName, fileName);
    const dirPath = path.join(__dirname, dirName);
    console.log(`[INFO] starting fs operations in ${dirPath}...`);
    try {
        // 1. Create directory if it doesn't exist
        try {
            await fs.access(dirPath);
            console.log('[INFO] directory already exists.');
        } catch {
            await fs.mkdir(dirPath);
            console.log('[INFO] directory created.');
        }
        // 2. Write to a file
        const logContent = `log entry at ${new Date().toISOString()}\n`;
        await fs.appendFile(filePath, logContent);
        console.log(`[PASS] wrote to file: ${filePath}`);
        // 3. Read the file
        const data = await fs.readFile(filePath, 'utf8');
        console.log('\n--- file contents ---');
        console.log(data.trim());
        console.log('---------------------');
        // 4. Get File Stats
        const stats = await fs.stat(filePath);
        console.log(`\n[INFO] file size: ${stats.size} bytes`);
        console.log(`[INFO] created at: ${stats.birthtime}`);
        // 5. Read Directory
        const files = await fs.readdir(dirPath);
        console.log(`\n[INFO] files in ${dirName}:`, files);
    } catch (error) {
        console.error('[ERROR] fs operation failed:', error);
    }
}
runFsOperations();