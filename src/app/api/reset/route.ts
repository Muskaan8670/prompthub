import { NextResponse } from "next/server";
import { saveDb } from "@/app/db";
import { DEFAULT_CATEGORIES, DEMO_PROMPTS } from "@/app/types";

/**
 * HTTP Method: POST
 * Route: /api/reset
 * Purpose: Reinitialize the database file back to default categories and prompts.
 */
export async function POST() {
  try {
    const defaultData = {
      prompts: DEMO_PROMPTS,
      categories: DEFAULT_CATEGORIES,
    };
    saveDb(defaultData);
    return NextResponse.json({ message: "Database reset to defaults" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reset database" }, { status: 500 });
  }
}
