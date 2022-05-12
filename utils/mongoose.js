import { connect, connection } from 'mongoose'
const MONGODB_URI = process.env.MONGODB_URI

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

const dbConnect = async () => {
  try {
    if (cached.conn) {
      return cached.conn
    }

    if (!cached.promise) {
      let opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
      }
      cached.promise = await connect(MONGODB_URI, opts)
    }
    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    console.error(error)
  }
}

connection.on('connected', () => {
  console.log('Mongoose connected 🚀')
})

connection.on('error', (err) => {
  console.error(err)
  process.exit(1)
})

export default dbConnect
