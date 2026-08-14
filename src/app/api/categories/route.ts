import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/app/db";

/**
 * Route: /api/categories
 */

/**
 * HTTP Method: GET
 * Purpose: Fetch all categories.
 */
export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json(db.categories, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

/**
 * HTTP Method: POST
 * Purpose: Add a new custom category.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const trimmed = name.trim();
    const db = getDb();

    // Check duplicate
    if (db.categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }

    db.categories.push(trimmed);
    saveDb(db);

    return NextResponse.json(trimmed, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 });
  }
}

/**
 * HTTP Method: PUT
 * Purpose: Delete or overwrite category database state.
 * For simpler DELETE operations, we receive a delete parameter.
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ error: "Category name parameter is required" }, { status: 400 });
    }

    const db = getDb();
    db.categories = db.categories.filter((c) => c !== name);
    saveDb(db);

    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
