"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface Kanji {
  id: number;
  kanji: string;
}

interface Meaning {
  id: number;
  value: string; // The meaning of the kanji
}

interface UserKanjiProgress {
  id: number;
  level: string;
  kanji: {
    id: number;
    kanji: string;
    description: string;
    meanings: Meaning[];
    kunyomi: Array<{ id: number; value: string }>;
    onyomi: Array<{ id: number; value: string }>;
    similarKanji: Array<{ id: number; value: string }>;
  };
}

export default function Lesson() {
  const [kanjiList, setKanjiList] = useState<UserKanjiProgress[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentKanji, setCurrentKanji] = useState<UserKanjiProgress | null>(
    null
  );
  const [userInput, setUserInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  useEffect(() => {
    const fetchKanjiProgress = async () => {
      const response = await fetch("/api/kanji-progress");
      const data = await response.json();
      setKanjiList(data);
    };

    fetchKanjiProgress();
  }, []);

  useEffect(() => {
    if (kanjiList.length > 0 && currentIndex < kanjiList.length) {
      setCurrentKanji(kanjiList[currentIndex]);
      setAttempts(0);
      setMessage(null);
    }
  }, [kanjiList, currentIndex]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentKanji) return;

    const correctMeaning = currentKanji.kanji.meanings[0]?.value.toLowerCase(); // Get the first meaning

    const isCorrect = userInput.trim().toLowerCase() === correctMeaning;

    try {
      if (isCorrect) {
        const response = await fetch("/api/kanji-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kanjiId: currentKanji.kanji.id }),
        });

        const data = await response.json();

        // Move to the next kanji or mark the lesson as complete
        if (currentIndex === kanjiList.length - 1) {
          setIsLessonComplete(true);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }

        setUserInput("");
        setAttempts(0);
        setMessage(null);
      } else {
        if (attempts === 0) {
          // First wrong attempt, allow a retry
          setMessage("That's not quite right. Try Again!");
          setAttempts(1);
        } else {
          // Second wrong attempt, move on without updating level
          setMessage(null);
          if (currentIndex === kanjiList.length - 1) {
            setIsLessonComplete(true);
          } else {
            setCurrentIndex((prev) => prev + 1);
          }
          setUserInput("");
          setAttempts(0);
        }
      }
    } catch (error) {
      console.error("Error updating kanji progress:", error);
    }
  };

  // Reset the lesson state when the user navigates away (component unmount)
  useEffect(() => {
    return () => {
      setCurrentIndex(0);
      setIsLessonComplete(false);
      setUserInput("");
      setAttempts(0);
    };
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Kanji Lesson</h1>
        <p className="text-3xl">
          {currentIndex + 1}/{kanjiList.length}
        </p>
      </div>
      <div className="p-8">
        {!isLessonComplete && currentKanji && (
          <div>
            <Card>
              <CardContent className="text-center p-4">
                <h2 className="text-2xl">{currentKanji.kanji.kanji}</h2>
              </CardContent>
            </Card>
            <form onSubmit={handleSubmit}>
              {message && <p className="text-red-500 mt-2">{message}</p>}{" "}
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter the meaning"
                className="border p-2 mt-4 w-full text-center"
                required
              />
              <button
                type="submit"
                className={`${buttonVariants({
                  variant: "default",
                })} mt-4 w-full`}
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {isLessonComplete && (
          <div>
            <h2 className="text-2xl mb-4">Lesson Complete!</h2>
            <Link
              href="/"
              className={`${buttonVariants({
                variant: "default",
              })} mt-4`}
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
