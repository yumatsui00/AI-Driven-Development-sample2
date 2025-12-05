import fs from "node:fs/promises";
import path from "node:path";
import { err, ok, type Result } from "@/utils/csv/types";

/**
 * Ensures a CSV file with the provided header exists, creating directories
 * and the header row when missing.
 * @param filePath Absolute path to the CSV file.
 * @param headers Ordered header entries.
 * @returns Result indicating success or an IO failure.
 */
export const ensureCsvFile = async (
  filePath: string,
  headers: string[]
): Promise<Result<null>> => {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const headerLine = `${headers.join(",")}\n`;
    const fileHandle = await fs.open(filePath, "a+");
    const stats = await fileHandle.stat();
    if (stats.size === 0) {
      await fileHandle.write(headerLine, 0, "utf8");
    }
    await fileHandle.close();
    return ok(null);
  } catch (error) {
    console.error(error);
    return err("io_error");
  }
};

/**
 * Reads all rows from a CSV file after validating the header matches.
 * @param filePath Absolute path to the CSV file.
 * @param headers Expected header order.
 * @returns Result with parsed rows or an error.
 */
export const readCsv = async (
  filePath: string,
  headers: string[]
): Promise<Result<Record<string, string>[]>> => {
  const ensured = await ensureCsvFile(filePath, headers);
  if (!ensured.ok) {
    return ensured;
  }

  try {
    const content = await fs.readFile(filePath, "utf8");
    const lines = content.split("\n").filter((line) => line.trim().length > 0);
    if (lines.length === 0) {
      return ok([]);
    }
    const headerLine = lines[0];
    if (headerLine !== headers.join(",")) {
      return err("invalid_header");
    }
    const rows = lines.slice(1).map((line) => line.split(","));
    const mapped = rows.map((row) => {
      const record: Record<string, string> = {};
      headers.forEach((key, index) => {
        record[key] = row[index] ?? "";
      });
      return record;
    });
    return ok(mapped);
  } catch (error) {
    console.error(error);
    return err("io_error");
  }
};

/**
 * Writes all rows to a CSV file with the provided header.
 * @param filePath Absolute path to the CSV file.
 * @param headers Ordered header entries.
 * @param rows Ordered rows matching the header.
 * @returns Result indicating success or an IO failure.
 */
export const writeCsv = async (
  filePath: string,
  headers: string[],
  rows: string[][]
): Promise<Result<null>> => {
  const ensured = await ensureCsvFile(filePath, headers);
  if (!ensured.ok) {
    return ensured;
  }

  try {
    const lines = [headers.join(","), ...rows.map((row) => row.join(","))];
    await fs.writeFile(filePath, `${lines.join("\n")}\n`, "utf8");
    return ok(null);
  } catch (error) {
    console.error(error);
    return err("io_error");
  }
};
