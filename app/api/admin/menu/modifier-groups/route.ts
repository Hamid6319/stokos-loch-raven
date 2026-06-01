import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ModifierGroup from "@/models/modifiergroup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const cleanOptions = (values: any[] = []) => {
  if (!Array.isArray(values)) return [];

  return values
    .map((item) => String(item || "").trim())
    .filter(Boolean);
};

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId") || "towson";

    const modifierGroups = await ModifierGroup.find({ storeId })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: modifierGroups });
  } catch (error) {
    console.error("GET MODIFIER GROUPS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch modifier groups" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, message: "Modifier group name is required" },
        { status: 400 }
      );
    }

    const modifierGroup = await ModifierGroup.create({
      storeId: body.storeId || "towson",
      name: body.name,
      slug: body.slug || slugify(body.name),
      appliesTo: body.appliesTo || "",
      options: cleanOptions(body.options),
      required: Boolean(body.required),
      sortOrder: Number(body.sortOrder || 0),
      status: body.status || "Active",
    });

    return NextResponse.json(
      { success: true, data: modifierGroup },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST MODIFIER GROUP ERROR:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Modifier group already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create modifier group" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const id = body.id || body._id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Modifier group ID is required" },
        { status: 400 }
      );
    }

    if (!body.name) {
      return NextResponse.json(
        { success: false, message: "Modifier group name is required" },
        { status: 400 }
      );
    }

    const updateData = {
      name: body.name,
      slug: body.slug || slugify(body.name),
      appliesTo: body.appliesTo || "",
      options: cleanOptions(body.options),
      required: Boolean(body.required),
      sortOrder: Number(body.sortOrder || 0),
      status: body.status || "Active",
    };

    const modifierGroup = await ModifierGroup.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!modifierGroup) {
      return NextResponse.json(
        { success: false, message: "Modifier group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: modifierGroup });
  } catch (error) {
    console.error("PATCH MODIFIER GROUP ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update modifier group" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Modifier group ID is required" },
        { status: 400 }
      );
    }

    const deletedModifierGroup = await ModifierGroup.findByIdAndDelete(id);

    if (!deletedModifierGroup) {
      return NextResponse.json(
        { success: false, message: "Modifier group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Modifier group deleted successfully",
    });
  } catch (error) {
    console.error("DELETE MODIFIER GROUP ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete modifier group" },
      { status: 500 }
    );
  }
}