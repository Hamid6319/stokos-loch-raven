import mongoose, { Schema } from "mongoose";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const UpsellRuleSchema = new Schema(
  {
    storeId: {
      type: String,
      required: true,
      default: "towson",
      index: true,
    },

    name: {
      type: String,
      trim: true,
      default: "",
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },

    trigger: {
      type: String,
      default: "",
    },

    offer: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    appliesToCategories: {
      type: [String],
      default: [],
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Paused", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
    collection: "upsellrules",
  }
);

UpsellRuleSchema.pre("validate", function (next) {
  const doc = this as any;

  if (!doc.offer && doc.name) {
    doc.offer = doc.name;
  }

  if (!doc.name && doc.offer) {
    doc.name = doc.offer;
  }

  if (!doc.slug && (doc.name || doc.offer)) {
    doc.slug = slugify(doc.name || doc.offer);
  }

  if (!doc.trigger) {
    const categories = Array.isArray(doc.appliesToCategories)
      ? doc.appliesToCategories
      : [];

    doc.trigger =
      categories.length > 0
        ? categories.map((item: string) => `Any ${item}`).join(", ")
        : "Any Product";
  }

  next();
});

UpsellRuleSchema.index({ storeId: 1, slug: 1 }, { unique: true });

const UpsellRule =
  mongoose.models.UpsellRule ||
  mongoose.model("UpsellRule", UpsellRuleSchema);

export default UpsellRule;