# node.js core modules practice
this project contains practice codes for fundamental node.js core modules. each file is self-contained and demonstrates specific concepts with clear, efficient logic.
## concepts & files
| concept | description | file |
| :--- | :--- | :--- |
| **file system (fs)** | asynchronous operations using fs.promises, including creating directories, writing/reading logs, and checking file stats. | [fs_practice.js](./fs_practice.js) |
| **path manipulation** | handling cross-platform paths, resolving absolute paths, parsing extensions/basenames, and normalization. | [path_practice.js](./path_practice.js) |
| **http module** | creating a rest server, implementing basic routing (get/post), handling json payloads, and managing status codes/headers. | [http_server.js](./http_server.js) |
| **streams** | efficient data processing using readable, writable, and transform streams. demonstrates pipe() and event-driven data flow. | [stream_processing.js](./stream_processing.js) |
## how to run
ensure you have node.js installed.
1. **file system example:**
   ```bash
   node fs_practice.js
   ```
2. **path example:**
   ```bash
   node path_practice.js
   ```
3. **http server:**
   ```bash
   node http_server.js
   # test with: curl http://localhost:3000/
   ```
4. **streams example:**
   ```bash
   node stream_processing.js
   ```

