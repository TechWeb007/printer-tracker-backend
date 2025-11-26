import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { stickerId, brand, model, customerName } = body;

    if (!stickerId) {
      return NextResponse.json({ error: "stickerId is required" }, { status: 400 });
    }

    // Find existing customer by name, or create
    let customer = await prisma.customer.findFirst({
      where: { name: customerName || "Unknown" },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName || "Unknown",
        },
      });
    }

    // Create the printer
    const printer = await prisma.printer.create({
      data: {
        stickerId,
        brand: brand || "Unknown",
        model: model || "Unknown",
        customerId: customer.id,
      },
    });

    return NextResponse.json({ ok: true, printer });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
