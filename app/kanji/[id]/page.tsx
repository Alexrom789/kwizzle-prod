import React from "react";
import prisma from "@/prisma/db";
import KanjiDetail from "./KanjiDetail";

interface Props {
  params: { id: string };
}

const ViewKanji = async ({ params }: Props) => {
  const kanji = await prisma.kanji.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      meanings: true,
      kunyomi: true,
      onyomi: true,
      similarKanji: true,
    },
  });

  const users = await prisma.user.findMany({
    where: { id: 1 },
    include: {
      kanjiProgress: true,
    },
  });

  if (!kanji) {
    return <p className=" text-destructive">Kanji Not Found!</p>;
  }

  return <KanjiDetail kanji={kanji} kanjiProgress={users[0].kanjiProgress} />;
};

export default ViewKanji;
