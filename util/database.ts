import { MongoClient } from "mongodb";

// Replace the uri string with your connection string
const url = "mongodb+srv://imhyelyeong_db_user:OIp1vu5xZ4UUyWRS@froum.cj978t5.mongodb.net/?retryWrites=true&w=majority";
let connectDB: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongo) {
    global._mongo = new MongoClient(url).connect()
  }
  connectDB = global._mongo
} else {
  connectDB = new MongoClient(url).connect()
}
export { connectDB }