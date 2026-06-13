import { v2 as cloudinary } from "cloudinary";
import { isAdminRequest } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return Response.json({ error: "File too large (max 8 MB)" }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "taxi-website/cars", resource_type: "image", overwrite: true }, (err, res) =>
          err || !res ? reject(err) : resolve(res),
        )
        .end(bytes);
    });
    return Response.json({ ok: true, url: result.secure_url });
  } catch (e) {
    console.error("Cloudinary upload failed:", e);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
