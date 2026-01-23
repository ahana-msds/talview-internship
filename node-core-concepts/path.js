const path = require('path');
function runPathOperations() {
    console.log('[INFO] starting path module operations...\n');
    // 1. path.basename, path.dirname, path.extname
    const samplePath = '/users/dev/project/src/index.js';
    console.log(`original path: ${samplePath}`);
    console.log(`dirname:  ${path.dirname(samplePath)}`);
    console.log(`basename: ${path.basename(samplePath)}`);
    console.log(`extname:  ${path.extname(samplePath)}`);
    // 2. path.parse (Detailed breakdown)
    const parsed = path.parse(samplePath);
    console.log('\nparsed path object:', parsed);
    // 3. path.join (Constructing paths safely)
    // Useful for cross-platform compatibility (handling slashes)
    const joinedPath = path.join('users', 'dev', '..', 'docs', 'readme.md');
    console.log(`\njoined path (with ..): ${joinedPath}`);
    // 4. path.resolve (Absolute path generation)
    // Resolves a sequence of paths or path segments into an absolute path.
    const resolvedPath = path.resolve('dist', 'assets', 'images');
    console.log(`resolved absolute path (relative to cwd): ${resolvedPath}`);
    // 5. path.normalize (Fixing weird paths)
    const weirdPath = '/users//bin/../local/./bin';
    console.log(`\nweird path: ${weirdPath}`);
    console.log(`normalized: ${path.normalize(weirdPath)}`);
}
runPathOperations();
