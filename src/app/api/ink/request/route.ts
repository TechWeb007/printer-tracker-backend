import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getPrinterBySticker(stickerId: string) {
  return prisma.printer.findUnique({ where: { stickerId } });
}

export async function POST(req: Request) {
  try {
    const { stickerId, color } = await req.json();

    if (!stickerId)
      return NextResponse.json(
        { error: "Missing stickerId" },
        { status: 400 }
      );

    const printer = await getPrinterBySticker(stickerId);

    if (!printer)
      return NextResponse.json(
        { error: "Printer not registered" },
        { status: 404 }
      );

    await prisma.inkRequest.create({
      data: {
        printerId: printer.id,
        cartridgeType: color,
        quantity: 1,
        status: "new",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
