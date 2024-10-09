import { kanjiSchema } from "@/ValidationSchemas/kanji";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import options from "../../auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

interface KanjiBody {
  kanji: string;
  description: string;
  onyomi?: { value: string }[];
  kunyomi?: { value: string }[];
  meanings?: { value: string }[];
  similarKanji?: { value: string }[];
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  const body: KanjiBody = await request.json();
  const validation = kanjiSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const kanji = await prisma.kanji.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      onyomi: true,
      kunyomi: true,
      meanings: true,
      similarKanji: true,
    },
  });

  if (!kanji) {
    return NextResponse.json({ error: "Kanji Not Found" }, { status: 404 });
  }

  const updateTicket = await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      kanji: body.kanji,
      description: body.description,
      onyomi: {
        deleteMany: {}, // Delete existing ones first
        create: body.onyomi?.map((o) => ({ value: o.value })),
      },
      kunyomi: {
        deleteMany: {}, // Delete existing ones first
        create: body.kunyomi?.map((k) => ({ value: k.value })),
      },
      meanings: {
        deleteMany: {}, // Delete existing ones first
        create: body.meanings?.map((m) => ({ value: m.value })),
      },
      similarKanji: {
        deleteMany: {}, // Delete existing ones first
        create: body.similarKanji?.map((s) => ({ value: s.value })),
      },
    },
  });

  return NextResponse.json(updateTicket);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

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
