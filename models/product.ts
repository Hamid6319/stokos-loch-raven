import mongoose, { Schema } from "mongoose";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ProductSchema = new Schema(
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

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    modifierGroups: {
      type: [String],
      default: [],
    },

    relatedUpsells: {
      type: [String],
      default: [],
    },

    upsell: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    badge: {
      type: String,
      default: "",
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Draft", "Hidden", "Inactive"],
      default: "Active",
    },

    updatedAt: {
      type: String,
      default: "Today",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "lastSavedAt",
    },
    collection: "products",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.virtual("upsellRules", {
  ref: "UpsellRule",
  localField: "relatedUpsells",
  foreignField: "_id",
  justOne: false,
});

ProductSchema.pre("validate", function () {
  const doc = this as any;

  if (!doc.slug && doc.name) {
    doc.slug = slugify(doc.name);
  }

  if (!doc.updatedAt) {
    doc.updatedAt = "Today";
  }
});

ProductSchema.index({ storeId: 1, slug: 1 }, { unique: true });

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;