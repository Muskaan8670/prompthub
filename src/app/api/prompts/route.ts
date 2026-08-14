import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/app/db";
import { Prompt } from "@/app/types";

/**
 * HTTP Method: GET
 * Route: /api/prompts
 * Purpose: Fetch all prompts currently saved in the JSON database file.
 */
export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json(db.prompts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load prompts" }, { status: 500 });
  }
}

/**
 * HTTP Method: POST
 * Route: /api/prompts
 * Request Body: { title, category, tags, content, notes }
 * Purpose: Create a new prompt and append it to the database file.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, tags, content, notes } = body;

    // Validate required fields
    if (!title || !category || !content) {
      return NextResponse.json(
        { error: "Title, category, and content are required fields." },
        { status: 400 }
      );
    }

    const db = getDb();

    // Create prompt record matching Prompt interface structure
    const newPrompt: Prompt = {
      id: "prompt-" + Date.now(),
      title: title.trim(),
      category: category.trim(),
      tags: Array.isArray(tags) ? tags : [],
      content: content.trim(),
      notes: notes ? notes.trim() : undefined,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    // Prepend to array (so recent items appear first) and write to disk
    db.prompts = [newPrompt, ...db.prompts];
    saveDb(db);

    return NextResponse.json(newPrompt, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add prompt" }, { status: 500 });
  }
}
