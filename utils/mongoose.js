import { connect, connection } from 'mongoose'
const MONGODB_URI = process.env.MONGODB_URI

const conn = {
  isConnected: false,
}

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export const dbConnect = async () => {
  try {
    if (conn.isConnected) return
    const db = await connect(MONGODB_URI)

    conn.isConnected = db.connections[0].readyState

    console.log(db.connection.db.databaseName)

    console.log('MongoDB connected')
  } catch (error) {
    console.error(error)
  }
}

connection.on('connected', () => {
  console.log('Mongoose connected uwu')
})

connection.on('error', (err) => {
  console.error( err)
  process.exit(1)
})
