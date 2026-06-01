import mongoose, { Schema } from "mongoose";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const CategorySchema = new Schema(
  {
    storeId: {
      type: String,
      required: true,
      default: "towson",
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Hidden", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

CategorySchema.pre("validate", function () {
  const doc = this as any;

  if (!doc.slug && doc.name) {
    doc.slug = slugify(doc.name);
  }
});

CategorySchema.index({ storeId: 1, slug: 1 }, { unique: true });

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;