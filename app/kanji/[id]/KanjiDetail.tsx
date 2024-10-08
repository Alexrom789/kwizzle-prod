import {
  Kanji,
  UserKanjiProgress,
  Kunyomi,
  Onyomi,
  Meaning,
  SimilarKanji,
} from "@prisma/client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import KanjiStatusBadge from "@/components/KanjiStatusBadge";
import DeleteButton from "./DeleteButton";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface KanjiWithRelations extends Kanji {
  kunyomi: Kunyomi[];
  onyomi: Onyomi[];
  meanings: Meaning[];
  similarKanji: SimilarKanji[];
}

interface Props {
  kanji: KanjiWithRelations;
  kanjiProgress: UserKanjiProgress[];
}

const KanjiDetail = ({ kanji, kanjiProgress }: Props) => {
  const getKanjiProgressLevel = (
    kanjiId: number
  ): UserKanjiProgress["level"] => {
    const progress = kanjiProgress.find(
      (progress) => progress.kanjiId === kanjiId
    );
    return progress ? progress.level : "NEW"; // Default to "NEW" if no progress found
  };

  return (
    <div className="lg:grid lg:grid-cols-4">
      <Card className="mx-4 mb-4 lg:col-span-3 lg:mr-4">
        <CardHeader>
          <div className="flex justify-between mb-3">
            <KanjiStatusBadge status={getKanjiProgressLevel(kanji.id)} />
          </div>
          <CardTitle>{kanji.kanji}</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <CardDescription className="mb-2">
            {"Meanings: "}
            {kanji.meanings.map((meaning) => (
              <span key={meaning.id}>{meaning.value}</span>
            ))}
          </CardDescription>
          <div className="flex gap-4">
            <CardDescription className="mb-2">
              {"Onyomi:  "}
              {kanji.onyomi.length > 0
                ? kanji.onyomi.map((onyomi, index) => (
                    <span key={onyomi.id}>
                      {onyomi.value}
                      {index < kanji.onyomi.length - 1 && <span>,&nbsp;</span>}
                    </span>
                  ))
                : "No Onyomi"}
            </CardDescription>
            <CardDescription>
              {"Kunyomi: "}
              {kanji.kunyomi.length > 0
                ? kanji.kunyomi.map((k, index) => (
                    <span key={k.id}>
                      {k.value}
                      {index < kanji.kunyomi.length - 1 && <span>,&nbsp;</span>}
                    </span>
                  ))
                : "No Onyomi"}
            </CardDescription>
          </div>
          <CardDescription className="mb-2">
            {`Description: ${kanji.description}`}
          </CardDescription>
          <CardDescription className="mb-2">
            {"Similar Kanji: "}
            {kanji.similarKanji.length > 0
              ? kanji.similarKanji.map((s, index) => (
                  <span key={s.id}>
                    {s.value}
                    {index < kanji.similarKanji.length - 1 && (
                      <span>,&nbsp;</span>
                    )}
                  </span>
                ))
              : "No Onyomi"}
          </CardDescription>
        </CardContent>
      </Card>
      <div className="mx-4 flex flex-col lg:flex-col lg:mx-0 gap-2">
        <Link
          href={`/kanji/edit/${kanji.id}`}
          className={`${buttonVariants({
            variant: "default",
          })}`}
        >
          Edit Kanji
        </Link>
        <DeleteButton kanjiId={kanji.id} />
      </div>
    </div>
  );
};

export default KanjiDetail;
