import React from "react";
import DataTable from "./DataTable";
import prisma from "@/prisma/db";

const Kanji = async () => {
  const kanji = await prisma.kanji.findMany({
    include: {
      kunyomi: true,
      onyomi: true,
      meanings: true,
      similarKanji: true,
    },
  });
  const users = await prisma.user.findMany({
    include: {
      kanjiProgress: true,
    },
  });
  return (
    <DataTable kanji={kanji} kanjiProgress={users[0].kanjiProgress}></DataTable>
  );
};

export default Kanji;
