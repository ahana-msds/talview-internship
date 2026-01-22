import { createServer, IncomingMessage, ServerResponse } from "http"

// typed http server
const server = createServer(
    (req: IncomingMessage, res: ServerResponse) => {
        res.writeHead(200, { "Content-Type": "text/plain" })
        res.end("talview typescript server running")
    }
)

server.listen(3000, () => {
    console.log("server started on port 3000")
})
