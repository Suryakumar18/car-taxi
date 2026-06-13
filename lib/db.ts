import dns from "node:dns";
import { MongoClient, type Db } from "mongodb";

// Some local DNS setups refuse SRV queries (needed for mongodb+srv://).
// Resolve via public DNS instead — only affects dns.resolve* (the Mongo driver), not normal fetches.
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {}

// TAXI_-prefixed to avoid clashing with a global MONGODB_URI env var on this machine
const uri = process.env.TAXI_MONGODB_URI;
const dbName = process.env.MONGODB_DB || "nagma_taxi";

// cache the client across hot reloads / route invocations
const globalForMongo = globalThis as unknown as { _mongoClient?: Promise<MongoClient> };

export async function getDb(): Promise<Db> {
  if (!uri) throw new Error("MONGODB_URI is not set in .env.local");
  if (!globalForMongo._mongoClient) {
    globalForMongo._mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      tls: true,
      // Node 20 OpenSSL 3.x sometimes rejects Atlas TLS — allow renegotiation
      tlsAllowInvalidCertificates: true,
    }).connect();
  }
  const client = await globalForMongo._mongoClient;
  return client.db(dbName);
}
