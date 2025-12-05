import path from "node:path";
import { err, ok, type Result } from "@/utils/csv/types";
import { readCsv, writeCsv } from "@/utils/csv";
import { type User } from "./types";

const USER_HEADERS = [
  "id",
  "name",
  "email",
  "password",
  "created_at",
  "updated_at"
];

const userCsvPath = path.resolve(process.cwd(), "db/user.csv");

/**
 * Reads all users from the CSV datastore.
 * @returns Result wrapping user collection.
 */
export const readUsers = async (): Promise<Result<User[]>> => {
  const rows = await readCsv(userCsvPath, USER_HEADERS);
  if (!rows.ok) {
    return rows;
  }
  const users = rows.data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    created_at: row.created_at,
    updated_at: row.updated_at
  }));
  return ok(users);
};

/**
 * Writes all users back to the CSV datastore.
 * @param users Users to persist.
 * @returns Result indicating success or IO failure.
 */
export const writeUsers = async (users: User[]): Promise<Result<null>> => {
  const rows = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.password,
    user.created_at,
    user.updated_at
  ]);
  return writeCsv(userCsvPath, USER_HEADERS, rows);
};
