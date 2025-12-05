import { randomUUID } from "node:crypto";
import { err, ok, type Result } from "@/utils/csv/types";
import { readUsers, writeUsers } from "./repository";
import { type LoginInput, type SignupInput, type User } from "./types";

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

/**
 * Validates and normalizes signup input.
 * @param input Raw signup payload.
 * @returns Result with cleaned input or validation error.
 */
const validateSignupInput = (input: SignupInput): Result<SignupInput> => {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password.trim();
  if (!name || !email || !password) {
    return err("validation_error");
  }
  if (!isValidEmail(email)) {
    return err("invalid_email");
  }
  return ok({ name, email, password });
};

/**
 * Validates and normalizes login input.
 * @param input Raw login payload.
 * @returns Result with cleaned input or validation error.
 */
const validateLoginInput = (input: LoginInput): Result<LoginInput> => {
  const email = normalizeEmail(input.email);
  const password = input.password.trim();
  if (!email || !password) {
    return err("validation_error");
  }
  if (!isValidEmail(email)) {
    return err("invalid_email");
  }
  return ok({ email, password });
};

/**
 * Registers a user if the email is not already taken.
 * @param input Signup payload.
 * @returns Result with created user or error.
 */
export const signup = async (input: SignupInput): Promise<Result<User>> => {
  const validated = validateSignupInput(input);
  if (!validated.ok) {
    return validated;
  }

  const existing = await readUsers();
  if (!existing.ok) {
    return existing;
  }
  const duplicate = existing.data.find(
    (user) => normalizeEmail(user.email) === validated.data.email
  );
  if (duplicate) {
    return err("duplicate_email");
  }

  const timestamp = new Date().toISOString();
  const newUser: User = {
    id: randomUUID(),
    name: validated.data.name,
    email: validated.data.email,
    password: validated.data.password,
    created_at: timestamp,
    updated_at: timestamp
  };
  const saved = await writeUsers([...existing.data, newUser]);
  if (!saved.ok) {
    return saved;
  }
  return ok(newUser);
};

/**
 * Authenticates a user by email and password.
 * @param input Login payload.
 * @returns Result with authenticated user or error.
 */
export const login = async (input: LoginInput): Promise<Result<User>> => {
  const validated = validateLoginInput(input);
  if (!validated.ok) {
    return validated;
  }

  const users = await readUsers();
  if (!users.ok) {
    return users;
  }
  const user = users.data.find(
    (entry) => normalizeEmail(entry.email) === validated.data.email
  );
  if (!user || user.password !== validated.data.password) {
    return err("invalid_credentials");
  }
  return ok(user);
};

/**
 * Returns a successful logout Result. No session is persisted.
 * @returns Result indicating logout success.
 */
export const logout = async (): Promise<Result<null>> => ok(null);
