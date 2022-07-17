const express = require('express')
const io = require('socket.io')({ path: "/webrtc" })

const app = express()
const port = 8080

app.get("/", (req, res) => res.send("hellooooo, webRTC !!!"))

const server = app.listen(port, () => {
    console.log(`webRTC App is listening on port ${port}`)
})

io.listen(server)

const webRTCNamespace = io.of('/webRTCPeers')

webRTCNamespace.on('connection', socket => {
    console.log(socket.id);
    socket.on('disconnect', () => {
        console.log(`${socket.id} has disconnected`);
    })
})