import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "@/ValidationSchemas/users";
import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";
import { KanjiLevel } from "@prisma/client";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not Admin" }, { status: 401 });
  }

  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }
  const duplicate = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });

  if (duplicate) {
    return NextResponse.json(
      { message: "Duplicate Username" },
      { status: 409 }
    );
  }

  const hashPassword = await bcrypt.hash(body.password, 10);
  body.password = hashPassword;

  const newUser = await prisma.user.create({
    data: { ...body },
  });

  const kanjiList = await prisma.kanji.findMany({
    take: 10,
  });

  // Create UserKanjiProgress entries for the new user
  const userProgressData = kanjiList.map((kanji) => ({
    level: KanjiLevel.NEW,
    kanjiId: kanji.id,
    userId: newUser.id,
  }));

  await prisma.userKanjiProgress.createMany({
    data: userProgressData,
  });

  return NextResponse.json(newUser, { status: 201 });
}

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      kanjiProgress: true,
    },
  });

  return NextResponse.json(users);
}
