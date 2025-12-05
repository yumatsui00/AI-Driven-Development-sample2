import { NextResponse } from "next/server";
import { logout } from "@logic/auth/service";

/**
 * Handles logout requests. No persistent session is stored, so this returns
 * a success Result immediately.
 * @returns HTTP response indicating logout success or failure.
 */
export async function POST(): Promise<NextResponse> {
  const result = await logout();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
