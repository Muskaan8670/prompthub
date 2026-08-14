import { NextResponse } from "next/server";
import { saveDb } from "@/app/db";

/**
 * HTTP Method: POST
 * Route: /api/import
 * Request Body: { prompts, categories }
 * Purpose: Overwrites database with imported JSON file structure.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompts, categories } = body;

    if (!prompts || !Array.isArray(prompts)) {
      return NextResponse.json({ error: "Invalid backup format: missing prompts array" }, { status: 400 });
    }

    const newData = {
      prompts,
      categories: Array.isArray(categories) ? categories : [],
    };

    saveDb(newData);
    return NextResponse.json({ message: "Import completed successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to import database" }, { status: 500 });
  }
}
