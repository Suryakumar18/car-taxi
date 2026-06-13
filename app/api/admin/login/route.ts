import { checkCredentials, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json().catch(() => ({}));
  if (!checkCredentials(username ?? "", password ?? "")) {
    return Response.json({ ok: false, error: "Invalid username or password" }, { status: 401 });
  }
  await setSessionCookie();
  return Response.json({ ok: true });
}
