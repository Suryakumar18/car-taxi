/**
 * Reset the site content document in MongoDB.
 * This forces getSiteData() to re-seed from DEFAULT_DATA on next page load.
 *
 * Usage:  node scripts/reset-db.mjs
 */
import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (dotenv not required)
try {
  const env = readFileSync(resolve(__dirname, "../.env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
} catch {
  console.warn("Could not read .env.local — using existing environment variables.");
}

const uri = process.env.TAXI_MONGODB_URI;
if (!uri) {
  console.error("ERROR: TAXI_MONGODB_URI not found in .env.local");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 8000,
  tls: true,
  tlsAllowInvalidCertificates: true,
});

await client.connect();
const db = client.db("nagma_taxi");
const result = await db.collection("content").deleteOne({ _id: "main" });
console.log(
  result.deletedCount === 1
    ? "✅ Content document deleted. Visit the site — it will auto-seed with the new defaults."
    : "ℹ️  No content document found (nothing to delete).",
);
await client.close();
