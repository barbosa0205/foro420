import { Server } from 'socket.io'

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already connected')
  } else {
    console.log('socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('a user connected')

      socket.on('disconnect', () => {
        console.log('user disconnected')
      })
    })
  }
  res.end()
}
