import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, phone, customerCode } = await req.json();

    if (!customerCode) {
      return NextResponse.json({ error: "customerCode is required" }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        name: name || "Unknown",
        email,
        phone,
        customerCode
      }
    });

    return NextResponse.json({ ok: true, customer });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
