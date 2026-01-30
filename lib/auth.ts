import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, JWT_SECRET);
    return payload as { userId: string; role: "customer" | "vendor"; email: string };
  } catch {
    return null;
  }
}