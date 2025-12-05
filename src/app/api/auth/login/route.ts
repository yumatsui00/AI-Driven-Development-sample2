import { NextRequest, NextResponse } from "next/server";
import { login } from "@logic/auth/service";
import { type LoginInput } from "@logic/auth/types";

const toStatus = (error: string): number => {
  if (error === "invalid_credentials") {
    return 401;
  }
  if (error === "io_error") {
    return 500;
  }
  return 400;
};

/**
 * Handles user login requests.
 * @param request Incoming HTTP request.
 * @returns HTTP response with authenticated user or error.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const payload = (await request.json()) as Partial<LoginInput>;
    const result = await login({
      email: payload.email ?? "",
      password: payload.password ?? ""
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: toStatus(result.error) }
      );
    }
    const response = NextResponse.json(result.data, { status: 200 });
    response.cookies.set({
      name: "login",
      value: "true",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
}
