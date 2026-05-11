import mongoose from "mongoose";

let gfs;
let gridfsBucket;

export function getGridFSBucket() {
  return gridfsBucket;
}

export async function connectDB() {
  console.log("[DB] Starting MongoDB connection...");

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("[DB] MongoDB connected");

    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: "uploads",
    });

    console.log("[DB] GridFSBucket initialized");
  } catch (err) {
    console.error("[DB] MongoDB connection failed");
    console.error(err);
    process.exit(1);
  }
}
