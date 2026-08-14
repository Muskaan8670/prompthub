import fs from "fs";
import path from "path";
import { Prompt, DEFAULT_CATEGORIES, DEMO_PROMPTS } from "@/app/types";

// Locate the database JSON file in the project root folder: prompt-library/data/db.json
const DB_PATH = path.join(process.cwd(), "data", "db.json");

// Structure interface for the JSON database file
export interface DatabaseSchema {
  prompts: Prompt[];
  categories: string[];
}

/**
 * Reads and parses the db.json file.
 * Automatically initializes the database file with default mock values if it does not exist.
 */
export function getDb(): DatabaseSchema {
  // Ensure the directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // If the file does not exist, initialize it with sample data
  if (!fs.existsSync(DB_PATH)) {
    const initialData: DatabaseSchema = {
      prompts: DEMO_PROMPTS,
      categories: DEFAULT_CATEGORIES,
    };
    saveDb(initialData);
    return initialData;
  }

  // Read and parse file
  try {
    const rawData = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(rawData) as DatabaseSchema;
  } catch (error) {
    console.error("Failed to read database, falling back to default data:", error);
    return { prompts: DEMO_PROMPTS, categories: DEFAULT_CATEGORIES };
  }
}

/**
 * Writes the complete database state object back to db.json.
 */
export function saveDb(data: DatabaseSchema): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
