import mongoose, { Schema } from "mongoose";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ModifierGroupSchema = new Schema(
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

    appliesTo: {
      type: String,
      default: "",
      trim: true,
    },

    options: {
      type: [String],
      default: [],
    },

    required: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
    collection: "modifiergroups",
  }
);

ModifierGroupSchema.pre("validate", function () {
  const doc = this as any;

  if (!doc.slug && doc.name) {
    doc.slug = slugify(doc.name);
  }
});

ModifierGroupSchema.index({ storeId: 1, slug: 1 }, { unique: true });

const ModifierGroup =
  mongoose.models.ModifierGroup ||
  mongoose.model("ModifierGroup", ModifierGroupSchema);

export default ModifierGroup;