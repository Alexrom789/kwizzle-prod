import { NextResponse } from "next/server";
import prisma from "../../../prisma/db";
import { KanjiLevel } from "../../../lib/kanjiLevels";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]/options";

const levelMapping = {
  NEW: 1,
  LEARNING: 2,
  MASTERED: 3,
  INGRAINED: 4,
};

export async function GET(req: Request) {
  const session = await getServerSession(options);
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const userProgress = await prisma.userKanjiProgress.findMany({
      where: { userId },
      include: {
        kanji: {
          include: {
            meanings: true,
            kunyomi: true,
            onyomi: true,
            similarKanji: true,
          },
        },
      },
    });

    // Ensure the returned data structure fits what your frontend expects
    return NextResponse.json(userProgress);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(options); // Retrieve the session
  const userId = session?.user.id; // Access user id from the session

  if (!userId) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const { kanjiId } = await req.json();

    // Update the user's kanji progress
    const kanjiProgress = await prisma.userKanjiProgress.findFirst({
      where: { userId, kanjiId },
    });

    if (kanjiProgress) {
      const currentLevelIndex = levelMapping[kanjiProgress.level];
      const newLevelIndex = Math.min(
        currentLevelIndex + 1,
        Object.keys(levelMapping).length
      );

      // Update the level
      await prisma.userKanjiProgress.update({
        where: { id: kanjiProgress.id },
        data: {
          level: Object.keys(levelMapping)[newLevelIndex - 1] as KanjiLevel, // Convert back to string
        },
      });

      return NextResponse.json({ message: "Progress updated successfully" });
    } else {
      return NextResponse.json(
        { message: "Kanji progress not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
