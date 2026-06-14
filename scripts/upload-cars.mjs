// One-off: uploads public/cars/*.png to Cloudinary and prints the URLs.
// Usage: node scripts/upload-cars.mjs
import { v2 as cloudinary } from "cloudinary";
import { readdirSync } from "node:fs";
import path from "node:path";

cloudinary.config({
  cloud_name: "dgzvoqywg",
  api_key: "412541245868516",
  api_secret: "z8TwRII3582KQzECFFqXKieKiFg",
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
