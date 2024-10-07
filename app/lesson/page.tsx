"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Kanji {
  id: number;
  kanji: string; // The kanji character
}

interface Meaning {
  id: number;
  value: string; // The meaning of the kanji
}

interface UserKanjiProgress {
  id: number;
  level: string; // The current level of the kanji
  kanji: {
    id: number;
    kanji: string; // The kanji character
    description: string;
    meanings: Meaning[]; // Include meaning as an array
    kunyomi: Array<{ id: number; value: string }>; // Update kunyomi type if necessary
    onyomi: Array<{ id: number; value: string }>; // Update onyomi type if necessary
    similarKanji: Array<{ id: number; value: string }>; // Update similarKanji type if necessary
  };
}

export default function Lesson() {
  const [kanjiList, setKanjiList] = useState<UserKanjiProgress[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentKanji, setCurrentKanji] = useState<UserKanjiProgress | null>(
    null
  );
  const [userInput, setUserInput] = useState("");
  const [attempts, setAttempts] = useState(0); // Track the number of attempts
  const [message, setMessage] = useState<string | null>(null); // To display retry messages
  const [isLessonComplete, setIsLessonComplete] = useState(false); // Track if the lesson is complete

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
      setAttempts(0); // Reset attempts for each new kanji
      setMessage(null); // Reset message for each new kanji
    }
  }, [kanjiList, currentIndex]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    if (!currentKanji) return;

    // Extract the correct meaning from the current kanji object
    const correctMeaning = currentKanji.kanji.meanings[0]?.value.toLowerCase(); // Get the first meaning

    // Check if the user's input matches the correct meaning
    const isCorrect = userInput.trim().toLowerCase() === correctMeaning;

    try {
      if (isCorrect) {
        // If the answer is correct, update the level
        const response = await fetch("/api/kanji-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kanjiId: currentKanji.kanji.id }), // Send kanji ID
        });

        const data = await response.json();
        console.log("Response from server:", data);

        // Move to the next kanji or mark the lesson as complete
        if (currentIndex === kanjiList.length - 1) {
          setIsLessonComplete(true); // Mark lesson complete when the last kanji is reached
        } else {
          setCurrentIndex((prev) => prev + 1);
        }

        setUserInput("");
        setAttempts(0); // Reset attempts for next kanji
        setMessage(null); // Clear any messages
      } else {
        // If the answer is wrong
        if (attempts === 0) {
          // First wrong attempt, allow a retry
          setMessage("That's not quite right. Try Again!");
          setAttempts(1); // Increment attempts to track second chance
        } else {
          // Second wrong attempt, move on without updating level
          setMessage(null); // Clear any message
          if (currentIndex === kanjiList.length - 1) {
            setIsLessonComplete(true); // Mark lesson complete when the last kanji is reached
          } else {
            setCurrentIndex((prev) => prev + 1);
          }
          setUserInput("");
          setAttempts(0); // Reset attempts for next kanji
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
      setIsLessonComplete(false); // Reset lesson completion
      setUserInput("");
      setAttempts(0);
    };
  }, []);

  console.log("Kanji List", kanjiList);

  return (
    <div className="p-8">
      {!isLessonComplete && currentKanji && (
        <Card>
          <CardContent>
            <h2 className="text-2xl">{currentKanji.kanji.kanji}</h2>
            {message && <p className="text-red-500">{message}</p>}{" "}
            {/* Display message */}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter the meaning"
                className="border p-2 mt-2 w-full"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Submit
              </button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLessonComplete && (
        <div>
          <h2 className="text-2xl mb-4">Lesson Complete!</h2>
          <Link href="/">Back to Dashboard</Link>
        </div>
      )}
    </div>
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";

// interface Kanji {
//   id: number;
//   kanji: string; // The kanji character
// }

// interface Meaning {
//   id: number;
//   value: string; // The meaning of the kanji
// }

// interface UserKanjiProgress {
//   id: number;
//   level: string; // The current level of the kanji
//   kanji: {
//     id: number;
//     kanji: string; // The kanji character
//     description: string;
//     meaning: Meaning[]; // Include meaning as an array
//     kunyomi: Array<{ id: number; value: string }>; // Update kunyomi type if necessary
//     onyomi: Array<{ id: number; value: string }>; // Update onyomi type if necessary
//     similarKanji: Array<{ id: number; value: string }>; // Update similarKanji type if necessary
//   };
// }

// export default function Lesson() {
//   const [kanjiList, setKanjiList] = useState<UserKanjiProgress[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [currentKanji, setCurrentKanji] = useState<UserKanjiProgress | null>(
//     null
//   );
//   const [userInput, setUserInput] = useState("");
//   const [attempts, setAttempts] = useState(0); // Track the number of attempts
//   const [message, setMessage] = useState<string | null>(null); // To display retry messages

//   useEffect(() => {
//     const fetchKanjiProgress = async () => {
//       const response = await fetch("/api/kanji-progress");
//       const data = await response.json();
//       setKanjiList(data);
//     };

//     fetchKanjiProgress();
//   }, []);

//   useEffect(() => {
//     if (kanjiList.length > 0) {
//       setCurrentKanji(kanjiList[currentIndex]);
//       setAttempts(0); // Reset attempts for each new kanji
//       setMessage(null); // Reset message for each new kanji
//     }
//   }, [kanjiList, currentIndex]);

//   const handleSubmit = async (event) => {
//     event.preventDefault(); // Prevent default form submission

//     if (!currentKanji) return;

//     // Extract the correct meaning from the current kanji object
//     const correctMeaning = currentKanji.kanji.meaning[0]?.value.toLowerCase(); // Get the first meaning

//     // Check if the user's input matches the correct meaning
//     const isCorrect = userInput.trim().toLowerCase() === correctMeaning;

//     try {
//       if (isCorrect) {
//         // If the answer is correct, update the level
//         const response = await fetch("/api/kanji-progress", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ kanjiId: currentKanji.kanji.id }), // Send kanji ID
//         });

//         const data = await response.json();
//         console.log("Response from server:", data);

//         // Move to the next kanji
//         setCurrentIndex((prev) => Math.min(prev + 1, kanjiList.length - 1));
//         setUserInput("");
//         setAttempts(0); // Reset attempts for next kanji
//         setMessage(null); // Clear any messages
//       } else {
//         // If the answer is wrong
//         if (attempts === 0) {
//           // First wrong attempt, allow a retry
//           setMessage("That's not quite right. Try Again!");
//           setAttempts(1); // Increment attempts to track second chance
//         } else {
//           // Second wrong attempt, move on without updating level
//           setMessage(null); // Clear any message
//           setCurrentIndex((prev) => Math.min(prev + 1, kanjiList.length - 1));
//           setUserInput("");
//           setAttempts(0); // Reset attempts for next kanji
//         }
//       }
//     } catch (error) {
//       console.error("Error updating kanji progress:", error);
//     }
//   };

//   console.log("Kanji List", kanjiList);

//   return (
//     <div className="p-8">
//       {currentKanji && (
//         <Card>
//           <CardContent>
//             <h2 className="text-2xl">{currentKanji.kanji.kanji}</h2>
//             {message && <p className="text-red-500">{message}</p>}{" "}
//             {/* Display message */}
//             <form onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//                 placeholder="Enter the meaning"
//                 className="border p-2 mt-2 w-full"
//                 required
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
//               >
//                 Submit
//               </button>
//             </form>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
