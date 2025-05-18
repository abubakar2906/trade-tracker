// lib/actions.ts
"use server"; // Marks all exports in this file as Server Actions

import { z } from "zod";
import { TradeSchema, TradeFormValues } from "../types/trade"; // Adjust path if needed
// import { auth } from "@/auth"; // Your authentication mechanism (e.g., NextAuth.js)
// import prisma from "@/lib/prisma"; // Your Prisma client or other DB client

export interface ActionResponse {
  success: boolean;
  message?: string;
  errors?: z.ZodIssue[]; // For field-specific errors
  tradeId?: string;
}

export async function addTradeAction(
  values: TradeFormValues
): Promise<ActionResponse> {
  // 1. Validate the input using Zod on the server
  const validatedFields = TradeSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error("Server Validation Failed:", validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Invalid trade data. Please check your inputs.",
      errors: validatedFields.error.issues,
    };
  }

  const tradeData = validatedFields.data;

  // 2. Get authenticated user (example)
  // const session = await auth();
  // if (!session?.user?.id) {
  //   return { success: false, message: "User not authenticated." };
  // }
  // const userId = session.user.id;
  const userId = "mock-user-id"; // Replace with actual user ID logic

  try {
    // 3. Prepare data for database insertion
    const dataToSave = {
      ...tradeData,
      userId,
      // Convert date string to Date object if your DB expects it
      date: new Date(tradeData.date), 
      // Ensure optional fields that are empty strings become null or are omitted
      exitPrice: tradeData.exitPrice || null,
      stopLoss: tradeData.stopLoss || null,
      takeProfit: tradeData.takeProfit || null,
      strategyId: tradeData.strategyId || null,
      rationale: tradeData.rationale || null,
      tags: tradeData.tags || [],
    };

    console.log("SERVER: Saving trade data:", dataToSave);

    // 4. Save to database (example with Prisma)
    // const newTrade = await prisma.trade.create({
    //   data: dataToSave,
    // });
    // console.log("SERVER: Trade saved successfully:", newTrade);
    // return { success: true, message: "Trade added successfully!", tradeId: newTrade.id };

    // Mock success response for now
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate DB call
    return { success: true, message: "Trade added successfully!", tradeId: `mock-${Date.now()}` };

  } catch (error) {
    console.error("SERVER: Error adding trade:", error);
    return { success: false, message: "Failed to add trade. Please try again." };
  }
}