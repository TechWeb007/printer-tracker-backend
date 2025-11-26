import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { stickerId, brand, model, customerCode } = body;

    if (!stickerId) {
      return NextResponse.json({ error: "stickerId is required" }, { status: 400 });
    }

    if (!customerCode) {
      return NextResponse.json({ error: "customerCode is required" }, { status: 400 });
    }

    // Correct customer lookup (using customerCode)
    const customer = await prisma.customer.findFirst({
      where: { customerCode }
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 400 }
      );
    }

    // Create the printer under this customer
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
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
