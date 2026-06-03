import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/product";
import Category from "@/models/category";
import ModifierGroup from "@/models/modifiergroup";
import UpsellRule from "@/models/upsellrule";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const isValidObjectId = (value: string) =>
  mongoose.Types.ObjectId.isValid(value);

async function resolveCategory(body: any) {
  const storeId = body.storeId || "towson";

  if (body.categoryId && isValidObjectId(body.categoryId)) {
    const category = await Category.findById(body.categoryId);
    if (category) return category;
  }

  if (body.category && isValidObjectId(body.category)) {
    const category = await Category.findById(body.category);
    if (category) return category;
  }

  const categoryName = body.categoryName || body.category || "Uncategorized";
  const categorySlug = slugify(categoryName);

  const category = await Category.findOneAndUpdate(
    { storeId, slug: categorySlug },
    {
      $setOnInsert: {
        storeId,
        name: categoryName,
        slug: categorySlug,
        status: "Active",
      },
    },
    { new: true, upsert: true }
  );

  return category;
}

async function resolveModifierGroups(values: any[] = []) {
  const ids: string[] = [];

  for (const item of values) {
    if (typeof item === "string" && isValidObjectId(item)) {
      ids.push(item);
      continue;
    }

    if (item?._id && isValidObjectId(item._id)) {
      ids.push(item._id);
    }
  }

  return ids;
}

async function resolveUpsellRules(values: any[] = []) {
  const ids: string[] = [];

  for (const item of values) {
    if (typeof item === "string" && isValidObjectId(item)) {
      ids.push(item);
      continue;
    }

    if (item?._id && isValidObjectId(item._id)) {
      ids.push(item._id);
    }
  }

  return ids;
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const storeId = searchParams.get("storeId");
    const category = searchParams.get("category");

    const query: any = {};

    // Important fix:
    // Agar storeId frontend se aaye tabhi filter karo.
    // Warna all stores ke products return honge.
    if (storeId && storeId !== "all") {
      query.storeId = storeId;
    }

    if (category && category !== "All Categories") {
      query.categoryName = category;
    }

    const products = await Product.find(query)
      .populate("category")
      .populate("modifierGroups")
      .populate("upsellRules")
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const category = await resolveCategory(body);
    const modifierGroups = await resolveModifierGroups(body.modifierGroups);
    const upsellRules = await resolveUpsellRules(body.upsellRules);

    const product = await Product.create({
      storeId: body.storeId || "towson",
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description || "",
      price: Number(body.price || 0),
      image: body.image || "",

      category: String(category._id),
      categoryId: String(category._id),
      categoryName: String(category.name || ""),

      modifierGroups,
      upsellRules,
      tags: Array.isArray(body.tags) ? body.tags : [],
      badge: body.badge || "",
      sortOrder: Number(body.sortOrder || 0),
      status: body.status || "Active",
    });

    const populatedProduct = await Product.findById(product._id)
      .populate("category")
      .populate("modifierGroups")
      .populate("upsellRules");

    return NextResponse.json(
      { success: true, data: populatedProduct },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST PRODUCT ERROR:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Product already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const category = await resolveCategory(body);
    const modifierGroups = await resolveModifierGroups(body.modifierGroups);
    const upsellRules = await resolveUpsellRules(body.upsellRules);

    const updateData = {
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description || "",
      price: Number(body.price || 0),
      image: body.image || "",

      category: String(category._id),
      categoryId: String(category._id),
      categoryName: String(category.name || ""),

      modifierGroups,
      upsellRules,
      tags: Array.isArray(body.tags) ? body.tags : [],
      badge: body.badge || "",
      sortOrder: Number(body.sortOrder || 0),
      status: body.status || "Active",
    };

    const product = await Product.findByIdAndUpdate(body.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("category")
      .populate("modifierGroups")
      .populate("upsellRules");

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("PATCH PRODUCT ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update product" },
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
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}