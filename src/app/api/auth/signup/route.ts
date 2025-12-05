import { NextRequest, NextResponse } from "next/server";
import { signup } from "@logic/auth/service";
import { type SignupInput } from "@logic/auth/types";

const toStatus = (error: string): number => {
  if (error === "duplicate_email") {
    return 409;
  }
  if (error === "io_error") {
    return 500;
  }
  return 400;
};

/**
 * Handles user signup requests.
 * @param request Incoming HTTP request.
 * @returns HTTP response with created user or error message.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const payload = (await request.json()) as Partial<SignupInput>;
    const result = await signup({
      name: payload.name ?? "",
      email: payload.email ?? "",
      password: payload.password ?? ""
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: toStatus(result.error) }
      );
    }
    const response = NextResponse.json(result.data, { status: 201 });
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
