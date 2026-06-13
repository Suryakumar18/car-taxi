// One-off: uploads public/cars/*.png to Cloudinary and prints the URLs.
// Usage: node scripts/upload-cars.mjs
import { v2 as cloudinary } from "cloudinary";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

// load .env.local manually (no dotenv dependency)
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const dir = path.join("public", "cars");
const results = {};
for (const f of readdirSync(dir).filter((f) => f.endsWith(".png"))) {
  const name = path.basename(f, ".png");
  const res = await cloudinary.uploader.upload(path.join(dir, f), {
    folder: "taxi-website/cars",
    public_id: name,
    overwrite: true,
    resource_type: "image",
  });
  results[name] = res.secure_url;
  console.log(`${name}: ${res.secure_url}`);
}
console.log("\nJSON:\n" + JSON.stringify(results, null, 2));
