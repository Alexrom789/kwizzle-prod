import React from "react";
import DataTable from "./DataTable";
import prisma from "@/prisma/db";
import Pagination from "@/components/Pagination";

interface SearchParams {
  page: string;
}

const Kanji = async ({ searchParams }: { searchParams: SearchParams }) => {
  const pageSize = 10;
  const page = parseInt(searchParams.page) || 1;
  const kanjiCount = await prisma.kanji.count();

  const kanji = await prisma.kanji.findMany({
    include: {
      kunyomi: true,
      onyomi: true,
      meanings: true,
      similarKanji: true,
    },

    take: pageSize,
    skip: (page - 1) * pageSize,
  });
  const users = await prisma.user.findMany({
    include: {
      kanjiProgress: true,
    },
  });

  return (
    <div>
      <DataTable
        kanji={kanji}
        kanjiProgress={users[0].kanjiProgress}
      ></DataTable>
      <Pagination
        itemCount={kanjiCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </div>
  );
};

export default Kanji;
