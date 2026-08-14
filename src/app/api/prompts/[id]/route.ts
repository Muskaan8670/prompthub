import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/app/db";

/**
 * Route: /api/prompts/[id]
 */

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * HTTP Method: PUT
 * Purpose: Update an existing prompt matching the ID parameter in the URL.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    // Check if prompt exists in database
    const exists = db.prompts.some((p) => p.id === id);
    if (!exists) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    // Map through list and update target fields
    db.prompts = db.prompts.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          // Support toggling favorite status or editing body data fields
          title: body.title !== undefined ? body.title.trim() : p.title,
          category: body.category !== undefined ? body.category.trim() : p.category,
          tags: Array.isArray(body.tags) ? body.tags : p.tags,
          content: body.content !== undefined ? body.content.trim() : p.content,
          notes: body.notes !== undefined ? (body.notes ? body.notes.trim() : undefined) : p.notes,
          isFavorite: body.isFavorite !== undefined ? body.isFavorite : p.isFavorite,
        };
      }
      return p;
    });

    saveDb(db);
    const updatedPrompt = db.prompts.find((p) => p.id === id);
    return NextResponse.json(updatedPrompt, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update prompt" }, { status: 500 });
  }
}

/**
 * HTTP Method: DELETE
 * Purpose: Delete a prompt matching the ID parameter in the URL.
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const db = getDb();

    const exists = db.prompts.some((p) => p.id === id);
    if (!exists) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    // Filter out target item and save database
    db.prompts = db.prompts.filter((p) => p.id !== id);
    saveDb(db);

    return NextResponse.json({ message: "Prompt deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete prompt" }, { status: 500 });
  }
}
