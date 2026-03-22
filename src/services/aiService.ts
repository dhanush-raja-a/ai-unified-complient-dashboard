/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { Complaint } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateDraftResponse(complaint: Complaint): Promise<string> {
  const model = "gemini-3-flash-preview";
  const prompt = `
    You are a customer support agent. Generate a professional and empathetic draft response to the following complaint.
    Customer: ${complaint.customerName}
    Subject: ${complaint.subject}
    Description: ${complaint.description}
    Category: ${complaint.category}
    Sentiment: ${complaint.sentiment}
    
    Provide only the response text.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "I am looking into this for you.";
  } catch (error) {
    console.error("Error generating draft response:", error);
    return "I am looking into this for you.";
  }
}

export async function summarizeComplaint(complaint: Complaint): Promise<string> {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Summarize the following customer complaint in one short sentence.
    Subject: ${complaint.subject}
    Description: ${complaint.description}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || complaint.subject;
  } catch (error) {
    console.error("Error summarizing complaint:", error);
    return complaint.subject;
  }
}

export async function chatWithDatabase(query: string, complaints: Complaint[]): Promise<string> {
  const model = "gemini-3-flash-preview";
  const context = JSON.stringify(complaints.map(c => ({
    id: c.id,
    subject: c.subject,
    status: c.status,
    severity: c.severity,
    category: c.category,
    createdAt: c.createdAt
  })));

  const prompt = `
    You are an AI assistant for a customer complaint dashboard. You have access to the following complaint data:
    ${context}
    
    Answer the user's query based on this data. Be concise and professional.
    User Query: ${query}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "I'm sorry, I couldn't process that query.";
  } catch (error) {
    console.error("Error in chatbot:", error);
    return "I'm sorry, I'm having trouble accessing the data right now.";
  }
}
