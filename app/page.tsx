import prisma from "@/prisma/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import DashChart from "@/components/DashChart";
import PieChart from "@/components/PieChart";
import { getServerSession } from "next-auth";
import options from "./api/auth/[...nextauth]/options";

export default async function Dashboard() {
  const session = await getServerSession(options);

  if (!session || !session.user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen pb-56">
        <h1 className="text-2xl">Welcome to Kwizzle!</h1>
        <p className="mt-1">
          Your personal spaced repetition language learning app.
        </p>
        <Link
          href="/api/auth/signin"
          className={`${buttonVariants({ variant: "default" })} mt-4`}
        >
          Login
        </Link>
      </div>
    );
  }

  const kanjiProgress = await prisma.userKanjiProgress.findMany({
    where: { userId: session.user.id },
    include: {
      kanji: true,
    },
  });

  const categories = [
    { name: "New", level: "NEW", color: "bg-green-600" },
    { name: "Learning", level: "LEARNING", color: "bg-yellow-500" },
    { name: "Mastered", level: "MASTERED", color: "bg-orange-500" },
    { name: "Ingrained", level: "INGRAINED", color: "bg-red-500" },
  ];

  const kanjiByLevel = (level: string) =>
    kanjiProgress.filter((progress) => progress.level === level).length;

  // Prepare chart data
  const chartData = categories.map((category) => ({
    name: category.level,
    total: kanjiByLevel(category.level),
  }));

  return (
    <div className="flex flex-col p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Study Progress Dashboard</h1>
        <Link
          href="/lesson"
          className={`${buttonVariants({ variant: "default" })}`}
        >
          Start Lesson
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-6">
        <div className="flex-[1] flex flex-col gap-4 w-full md:w-1/3">
          {categories.map((category) => (
            <Card key={category.name} className={`${category.color} h-24`}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{kanjiByLevel(category.level)} kanji</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex-[2] flex flex-col gap-4 w-full md:w-2/3">
          <div className="flex h-full gap-2">
            <div className="flex-1">
              <DashChart data={chartData} />
            </div>
            <div className="flex-1">
              <PieChart data={chartData} />
            </div>
          </div>
        </div>
      </div>
      {/* TODO: Implement recently studied kanji feature on dashboard. <div className="mb-4">
      <h2 className="text-xl font-semibold mb-4">Recently Studied Kanji</h2>
      {kanjiProgress.length > 0 ? (
        <ul>
          {kanjiProgress.map((progress) => (
            <li key={progress.kanji.id} className="mb-2">
              {progress.kanji.kanji}
            </li>
          ))}
        </ul>
      ) : (
        <p>No kanji studied yet.</p>
      )}
    </div> */}
    </div>
  );
}
