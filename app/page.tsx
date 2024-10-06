import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Server component to fetch kanji progress
export default async function Dashboard() {
  // Fetch kanji progress for the mock user (e.g., userId = 1)
  const kanjiProgress = await prisma.userKanjiProgress.findMany({
    where: { userId: 1 }, // Replace this with dynamic user logic if needed
    include: {
      kanji: true, // Include kanji details
    },
  });

  // Categories for kanji levels
  const categories = [
    { name: "New", level: "NEW", color: "bg-blue-300" },
    { name: "Learning", level: "LEARNING", color: "bg-yellow-300" },
    { name: "Mastered", level: "MASTERED", color: "bg-green-300" },
    { name: "Ingrained", level: "INGRAINED", color: "bg-purple-300" },
  ];

  // Function to calculate kanji count by level
  const kanjiByLevel = (level: string) =>
    kanjiProgress.filter((progress) => progress.level === level).length;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Your Kanji Dashboard</h1>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {categories.map((category) => (
          <Card key={category.name} className={category.color}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{kanjiByLevel(category.level)} kanji</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recently Studied Kanji */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Recently Studied Kanji</h2>
        {/* You can add client-side logic for recently studied kanji here */}
        <p>No kanji studied yet.</p>
      </div>

      {/* Start Lesson Button */}
      <a href="/lesson" className="bg-blue-500 text-white px-4 py-2 rounded">
        Start Lesson
      </a>
    </div>
  );
}
