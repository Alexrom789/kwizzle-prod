import prisma from "@/prisma/db";
import dynamic from "next/dynamic";
import React from "react";

interface Props {
  params: { id: string };
}

const KanjiForm = dynamic(() => import("@/components/KanjiForm"), {
  ssr: false,
});

const EditKanji = async ({ params }: Props) => {
  const kanji = await prisma?.kanji.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      meanings: true,
      kunyomi: true,
      onyomi: true,
      similarKanji: true,
    },
  });

  if (!kanji) {
    return <p className="text-destructive">Kanji not found!</p>;
  }
  return <KanjiForm kanji={kanji} />;
};

export default EditKanji;
