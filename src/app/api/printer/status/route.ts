import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getPrinterBySticker(stickerId: string) {
  return prisma.printer.findUnique({ where: { stickerId } });
}

export async function POST(req: Request) {
  try {
    const { stickerId } = await req.json();

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

    const lastStatus = await prisma.printerStatusHistory.findFirst({
      where: { printerId: printer.id },
      orderBy: { recordedAt: "desc" },
    });

    if (!lastStatus)
      return NextResponse.json(
        { error: "No status available" },
        { status: 404 }
      );

    return NextResponse.json({
      status: {
        black: lastStatus.blackLevel ?? 0,
        cyan: lastStatus.cyanLevel ?? 0,
        magenta: lastStatus.magentaLevel ?? 0,
        yellow: lastStatus.yellowLevel ?? 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
