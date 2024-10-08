import { z } from "zod";

export const kanjiSchema = z.object({
  kanji: z.string().min(1, "Character is required.").max(10),
  description: z.string().min(1, "Description is required.").max(65535),
  onyomi: z.array(
    z.object({
      value: z.string().min(1, "Onyomi is required."),
    })
  ),
  kunyomi: z
    .array(
      z.object({
        value: z.string().min(1, "Kunyomi is required."),
      })
    )
    .optional(),
  meanings: z.array(
    z.object({
      value: z.string().min(1, "Meaning is required."),
    })
  ),
  similarKanji: z
    .array(
      z.object({
        value: z.string().min(1, "Similar Kanji is required."),
      })
    )
    .optional(),
});
