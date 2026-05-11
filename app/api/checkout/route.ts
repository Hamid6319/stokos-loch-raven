import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { items, slug } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const cleanOrigin = origin.replace(/\/$/, "");

    const lineItems = items.map((item: any) => {
      const descriptionParts: string[] = [];

      if (item.size?.label) {
        descriptionParts.push(`Size: ${item.size.label}`);
      }

      if (item.toppings && Object.keys(item.toppings).length > 0) {
        descriptionParts.push(
          `Toppings: ${Object.entries(item.toppings)
            .map(([name, side]) => `${name} (${side})`)
            .join(", ")}`
        );
      }

      if (item.sauces && item.sauces.length > 0) {
        descriptionParts.push(`Sauces: ${item.sauces.join(", ")}`);
      }

      if (item.note) {
        descriptionParts.push(`Note: ${item.note}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: descriptionParts.join(" | ") || undefined,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      // Force only USD. No PKR currency selector.
      adaptive_pricing: {
        enabled: false,
      },

      // Optional: keeps checkout cleaner for demo
      payment_method_types: ["card"],

      line_items: lineItems,

      success_url: `${cleanOrigin}/store/${slug}/success`,
      cancel_url: `${cleanOrigin}/store/${slug}?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE ERROR:", error);

    return NextResponse.json(
      { error: "Stripe checkout failed" },
      { status: 500 }
    );
  }
}