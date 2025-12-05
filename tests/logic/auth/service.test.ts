import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { login, logout, signup } from "@/logic/auth/service";
import { readUsers } from "@/logic/auth/repository";

const ORIGINAL_CWD = process.cwd();

const createTempWorkspace = async (): Promise<string> =>
  fs.mkdtemp(path.join(os.tmpdir(), "auth-tests-"));

describe("auth service", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempWorkspace();
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(ORIGINAL_CWD);
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("signs up a user and persists CSV row", async () => {
    const result = await signup({
      name: "Alice",
      email: "alice@example.com",
      password: "secret"
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const user = result.data;
    expect(user.id).toBeTruthy();
    expect(user.created_at).toBe(user.updated_at);
    expect(Number.isNaN(Date.parse(user.created_at))).toBe(false);

    const stored = await readUsers();
    expect(stored.ok).toBe(true);
    if (!stored.ok) return;
    expect(stored.data).toHaveLength(1);
    expect(stored.data[0].email).toBe("alice@example.com");
  });

  it("rejects duplicate email on signup", async () => {
    await signup({ name: "Alice", email: "alice@example.com", password: "secret" });
    const result = await signup({
      name: "Bob",
      email: "alice@example.com",
      password: "another"
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("duplicate_email");
  });

  it("logs in with correct credentials", async () => {
    await signup({ name: "Alice", email: "alice@example.com", password: "secret" });

    const result = await login({ email: "alice@example.com", password: "secret" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.email).toBe("alice@example.com");
  });

  it("rejects invalid credentials", async () => {
    await signup({ name: "Alice", email: "alice@example.com", password: "secret" });

    const wrongPassword = await login({
      email: "alice@example.com",
      password: "wrong"
    });
    expect(wrongPassword.ok).toBe(false);
    if (!wrongPassword.ok) return;
    expect(wrongPassword.error).toBe("invalid_credentials");

    const unknownUser = await login({
      email: "bob@example.com",
      password: "secret"
    });
    expect(unknownUser.ok).toBe(false);
    if (!unknownUser.ok) return;
    expect(unknownUser.error).toBe("invalid_credentials");
  });

  it("logs out successfully", async () => {
    const result = await logout();
    expect(result.ok).toBe(true);
  });
});
