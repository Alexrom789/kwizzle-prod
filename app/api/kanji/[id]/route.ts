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
  const kanjiId = parseInt(params.id);

  const kanji = await prisma.kanji.findUnique({
    where: { id: kanjiId },
  });

  if (!kanji) {
    return NextResponse.json({ error: "Kanji Not Found" }, { status: 404 });
  }

  // First, delete all related records
  await prisma.kunyomi.deleteMany({
    where: { kanjiId },
  });

  await prisma.onyomi.deleteMany({
    where: { kanjiId },
  });

  await prisma.meaning.deleteMany({
    where: { kanjiId },
  });

  await prisma.similarKanji.deleteMany({
    where: { kanjiId },
  });

  await prisma.userKanjiProgress.deleteMany({
    where: { kanjiId },
  });

  // Then, delete the Kanji
  await prisma.kanji.delete({
    where: { id: kanjiId },
  });

  return NextResponse.json({ message: "Kanji Deleted" });
}
