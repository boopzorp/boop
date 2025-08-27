"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Entry } from "@/types"

const formSchema = z.object({
  type: z.enum(["book", "movie", "music"]),
  title: z.string().min(1, "Title is required."),
  creator: z.string().min(1, "Creator is required."),
  notes: z.string().optional(),
})

type AddEntryFormProps = {
  onAddEntry: (entry: Omit<Entry, "id" | "addedAt" | "imageUrl">) => void;
  onFinished: () => void;
};

export function AddEntryForm({ onAddEntry, onFinished }: AddEntryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "book",
      title: "",
      creator: "",
      notes: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddEntry(values);
    onFinished();
  }

  const creatorLabel = form.watch("type");

  const getCreatorLabel = () => {
    switch (creatorLabel) {
      case 'book': return 'Author';
      case 'movie': return 'Director';
      case 'music': return 'Artist';
      default: return 'Creator';
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueeChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dune" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="creator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getCreatorLabel()}</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Frank Herbert" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your thoughts on this item... (supports simple markdown)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add to Shelf</Button>
      </form>
    </Form>
  )
}
