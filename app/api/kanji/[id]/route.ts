import { kanjiSchema } from "@/ValidationSchemas/kanji";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

interface Props {
  params: { id: string };
}

// export async function POST(request: NextRequest) {
//   const body = await request.json();
//   const validation = kanjiSchema.safeParse(body);

//   if (!validation.success) {
//     console.error("Validation error:", validation.error.format());
//     return NextResponse.json(validation.error.format(), { status: 400 });
//   }

//   const newKanji = await prisma.kanji.create({
//     data: { ...body },
//   });

//   return NextResponse.json(newKanji, { status: 201 });
// }

export async function DELETE(request: NextRequest, { params }: Props) {
  const kanji = await prisma.kanji.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!kanji) {
    return NextResponse.json({ error: "Kanji Not Found" }, { status: 404 });
  }

  await prisma.kanji.delete({
    where: { id: kanji.id },
  });

  return NextResponse.json({ message: "Kanji Deleted" });
}
