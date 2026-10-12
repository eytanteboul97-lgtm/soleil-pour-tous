import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, hashPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD n'est pas configuré sur le serveur." },
      { status: 500 }
    );
  }

  if (password !== expected) {
    return NextResponse.json({ ok: false, error: "Mot de passe incorrect." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, await hashPassword(expected), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
  return res;
}
