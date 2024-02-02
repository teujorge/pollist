"use server"

import { db } from "@/database/db";
import { redirect } from "next/navigation";
import { CreatePollFields } from "./validation";

export async function createPoll(fields:CreatePollFields) {
    

    

    if (fields.title === "") return;
    if (fields.description === "") return;

    const createdPoll = await db.poll.create({
      data: {
        title:fields.title,
        description:fields.description??"",
        options: {
          create: [{ text: fields.option1 }, { text: fields.option2 }],
        },
      },
    });

    if (createdPoll) {
      redirect(`/post/${createdPoll.id}`);
    }
  }