import dns from "node:dns";
import { MongoClient, type Db } from "mongodb";

// Some local DNS setups refuse SRV queries (needed for mongodb+srv://).
// Resolve via public DNS instead — only affects dns.resolve* (the Mongo driver), not normal fetches.
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {}

const uri =
  "mongodb://nagmatoursandtravels124_db_user:SiYxbd9pkywjtvIj@ac-ysxxm5j-shard-00-00.xxhiaqh.mongodb.net:27017,ac-ysxxm5j-shard-00-01.xxhiaqh.mongodb.net:27017,ac-ysxxm5j-shard-00-02.xxhiaqh.mongodb.net:27017/?tls=true&authSource=admin&replicaSet=atlas-13mlpn-shard-0&appName=Cluster0";
const dbName = "nagma_taxi";

// cache the client across hot reloads / route invocations
const globalForMongo = globalThis as unknown as { _mongoClient?: Promise<MongoClient> };

export async function getDb(): Promise<Db> {
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
