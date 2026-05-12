import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const {
      items,
      slug,
      orderType,
      deliveryAddress,
      orderDay,
      orderTime,
    } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!orderType) {
      return NextResponse.json(
        { error: "Order type is required" },
        { status: 400 }
      );
    }

    if (orderType === "delivery" && !deliveryAddress) {
      return NextResponse.json(
        { error: "Delivery address is required" },
        { status: 400 }
      );
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

      descriptionParts.push(
        `Order Type: ${orderType === "pickup" ? "Pickup / Carryout" : "Delivery"}`
      );

      if (deliveryAddress) {
        descriptionParts.push(`Address: ${deliveryAddress}`);
      }

      descriptionParts.push(`Day: ${orderDay || "Today"}`);
      descriptionParts.push(`Time: ${orderTime || "ASAP"}`);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: descriptionParts.join(" | "),
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      adaptive_pricing: {
        enabled: false,
      },

      payment_method_types: ["card"],

      line_items: lineItems,

      metadata: {
        store: slug || "towson",
        orderType,
        deliveryAddress: deliveryAddress || "",
        orderDay: orderDay || "Today",
        orderTime: orderTime || "ASAP",
      },

      success_url: `${cleanOrigin}/store/${slug || "towson"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cleanOrigin}/store/${slug || "towson"}?payment=cancelled`,
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