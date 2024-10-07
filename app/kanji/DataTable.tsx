import KanjiStatusBadge from "@/components/KanjiStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Kanji,
  Kunyomi,
  Onyomi,
  Meaning,
  SimilarKanji,
  UserKanjiProgress,
} from "@prisma/client";
import Link from "next/link";
import React from "react";

interface KanjiWithRelations extends Kanji {
  kunyomi: Kunyomi[];
  onyomi: Onyomi[];
  meanings: Meaning[];
  similarKanji: SimilarKanji[];
}

interface Props {
  kanji: KanjiWithRelations[];
  kanjiProgress: UserKanjiProgress[];
}

const DataTable = ({ kanji, kanjiProgress }: Props) => {
  // Helper function to get kanji progress level for a kanji id
  const getKanjiProgressLevel = (
    kanjiId: number
  ): UserKanjiProgress["level"] => {
    const progress = kanjiProgress.find(
      (progress) => progress.kanjiId === kanjiId
    );
    return progress ? progress.level : "NEW"; // Default to "NEW" if no progress found
  };
  return (
    <div className="w-full mt-5">
      <div className="rounded-md sm:border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {" "}
                <div className="flex justify-center">Character</div>
              </TableHead>
              <TableHead>
                {" "}
                <div className="flex justify-center">Onyomi Readings</div>
              </TableHead>
              <TableHead>
                {" "}
                <div className="flex justify-center">Kunyomi Readings</div>
              </TableHead>
              <TableHead>
                {" "}
                <div className="flex justify-center">Status</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kanji
              ? kanji.map((kanji) => (
                  <TableRow key={kanji.id} data-href="/">
                    <TableCell>
                      <Link
                        className="flex justify-center"
                        href={`/kanji/${kanji.id}`}
                      >
                        {kanji.kanji}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        {kanji.onyomi.length > 0
                          ? kanji.onyomi.map((onyomi, index) => (
                              <span key={onyomi.id}>
                                {onyomi.value}
                                {index < kanji.onyomi.length - 1 && (
                                  <span>,&nbsp;</span>
                                )}
                              </span>
                            ))
                          : "No Onyomi"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        {kanji.kunyomi.length > 0
                          ? kanji.kunyomi.map((kunyomi, index) => (
                              <span key={kunyomi.id}>
                                {kunyomi.value}
                                {index < kanji.kunyomi.length - 1 && (
                                  <span>,&nbsp;</span>
                                )}
                              </span>
                            ))
                          : "No kunyomi"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <KanjiStatusBadge
                          status={getKanjiProgressLevel(kanji.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
