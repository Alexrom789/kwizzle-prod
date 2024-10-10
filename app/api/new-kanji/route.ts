import { NextResponse } from "next/server";
import prisma from "../../../prisma/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const count = parseInt(url.searchParams.get("count") || "10");

  try {
    const newKanji = await prisma.kanji.findMany({
      where: {
        userProgress: {
          none: {}, // Kanji that no user has studied yet
        },
      },
      take: count,
    });

    return NextResponse.json(newKanji);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
