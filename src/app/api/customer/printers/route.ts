import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { ok: false, error: "Missing customer code" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { customerCode: code },
      include: { printers: true }
    });

    if (!customer) {
      return NextResponse.json(
        { ok: false, error: "Invalid customer code" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      printers: customer.printers
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
