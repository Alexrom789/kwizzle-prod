"use client";
import React, { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { kanjiSchema } from "@/ValidationSchemas/kanji";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Button } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Kanji, Kunyomi, Onyomi, Meaning, SimilarKanji } from "@prisma/client";

type KanjiFormData = z.infer<typeof kanjiSchema>;

interface KanjiWithRelations extends Kanji {
  kunyomi: Kunyomi[];
  onyomi: Onyomi[];
  meanings: Meaning[];
  similarKanji: SimilarKanji[];
}

interface Props {
  kanji: KanjiWithRelations;
}

const KanjiForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const form = useForm<KanjiFormData>({
    resolver: zodResolver(kanjiSchema),
  });

  async function onSubmit(values: z.infer<typeof kanjiSchema>) {
    try {
      setIsSubmitting(true);
      setError("");
      // if (kanji) {
      //   await axios.patch("/api/kanji/" + kanji.id, values);
      // } else {
      //   await axios.post("/api/kanji", values);
      // }
      //     await axios.post("/api/kanji/", values);
      //     setIsSubmitting(false);
      //     router.push("/kanji");
      //     router.refresh();
      //   } catch (error) {
      //     setError("Unknown Error Occured. ");
      //     setIsSubmitting(false);
      //   }
      // }

      const transformedValues = {
        kanji: values.kanji,
        description: values.description,
        onyomi: values.onyomi || [],
        kunyomi: values.kunyomi || [],
        meanings: values.meanings || [],
        similarKanji: values.similarKanji || [],
      };

      console.log("error", error);

      await axios.post("/api/kanji", transformedValues);
      setIsSubmitting(false);
      router.push("/kanji");
      router.refresh();
    } catch (error) {
      setError("Unknown Error Occured. ");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border w-full p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:flex md:w-full md:space-x-4">
            <FormField
              control={form.control}
              name="kanji"
              // defaultValue={kanji.kanji}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kanji Character</FormLabel>
                  <FormControl>
                    <Input placeholder="Kanji Character..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Onyomi</FormLabel>
              <Controller
                name="onyomi"
                control={form.control}
                render={({ field }) => (
                  <FormControl>
                    <Input
                      placeholder="Onyomi readings (comma-separated)..."
                      value={
                        field.value
                          ? field.value.map((o) => o.value).join(", ")
                          : ""
                      }
                      onChange={(e) => {
                        const updatedValue = e.target.value
                          .split(",")
                          .map((value) => value.trim())
                          .filter((value) => value.length > 0)
                          .map((value) => ({ value })); // Wrap each value in an object
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                )}
              />
            </FormItem>

            <FormItem>
              <FormLabel>Kunyomi</FormLabel>
              <Controller
                name="kunyomi"
                control={form.control}
                render={({ field }) => (
                  <FormControl>
                    <Input
                      placeholder="Kunyomi readings (comma-separated)..."
                      value={
                        field.value
                          ? field.value.map((k) => k.value).join(", ")
                          : ""
                      }
                      onChange={(e) => {
                        const updatedValue = e.target.value
                          .split(",")
                          .map((value) => value.trim())
                          .filter((value) => value.length > 0)
                          .map((value) => ({ value })); // Wrap each value in an object
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                )}
              />
            </FormItem>

            <FormItem>
              <FormLabel>Meanings</FormLabel>
              <Controller
                name="meanings"
                control={form.control}
                render={({ field }) => (
                  <FormControl>
                    <Input
                      placeholder="Meanings (comma-separated)..."
                      value={
                        field.value
                          ? field.value.map((m) => m.value).join(", ")
                          : ""
                      }
                      onChange={(e) => {
                        const updatedValue = e.target.value
                          .split(",")
                          .map((value) => value.trim())
                          .filter((value) => value.length > 0)
                          .map((value) => ({ value })); // Wrap each value in an object
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                )}
              />
            </FormItem>

            <FormItem>
              <FormLabel>Similar Kanji</FormLabel>
              <Controller
                name="similarKanji"
                control={form.control}
                render={({ field }) => (
                  <FormControl>
                    <Input
                      placeholder="Similar Kanji (comma-separated)..."
                      value={
                        field.value
                          ? field.value.map((s) => s.value).join(", ")
                          : ""
                      }
                      onChange={(e) => {
                        const updatedValue = e.target.value
                          .split(",")
                          .map((value) => value.trim())
                          .filter((value) => value.length > 0)
                          .map((value) => ({ value })); // Wrap each value in an object
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                )}
              />
            </FormItem>
          </div>
          <Controller
            name="description"
            // defaultValue={kanji?.description}
            control={form.control}
            render={({ field }) => (
              <SimpleMDE placeholder="Description" {...field} />
            )}
          />
          {/* <Button type="submit">{kanji ? "Update Kanji" : "Add Kanji"}</Button> */}
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isValid}
          >
            Add Kanji
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default KanjiForm;
