import React from "react";
import DataTable from "./DataTable";
import prisma from "@/prisma/db";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

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
      <h1 className="text-xl md:text-2xl">Kanji Database</h1>
      <DataTable
        kanji={kanji}
        kanjiProgress={users[0].kanjiProgress}
      ></DataTable>
      <div className="flex justify-between">
        <Pagination
          itemCount={kanjiCount}
          pageSize={pageSize}
          currentPage={page}
        />
        <Link
          href="/kanji/new/"
          className={`mt-4 ${buttonVariants({ variant: "default" })}`}
        >
          New Kanji
        </Link>
      </div>
    </div>
  );
};

export default Kanji;
