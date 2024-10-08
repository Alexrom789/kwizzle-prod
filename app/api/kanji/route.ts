import { kanjiSchema } from "@/ValidationSchemas/kanji";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

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

export async function POST(request: NextRequest) {
  const body: KanjiBody = await request.json();
  const validation = kanjiSchema.safeParse(body);

  if (!validation.success) {
    console.error("Validation error:", validation.error.format());
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const newKanji = await prisma.kanji.create({
    data: {
      kanji: body.kanji,
      description: body.description,
      onyomi: {
        create: body.onyomi?.map((o) => ({ value: o.value })),
      },
      kunyomi: {
        create: body.kunyomi?.map((k) => ({ value: k.value })),
      },
      meanings: {
        create: body.meanings?.map((m) => ({ value: m.value })),
      },
      similarKanji: {
        create: body.similarKanji?.map((s) => ({ value: s.value })),
      },
    },
  });

  return NextResponse.json(newKanji, { status: 201 });
}
