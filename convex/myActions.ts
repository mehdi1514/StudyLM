"use node";

import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
    args: {
        splittedText: v.array(v.string()),
        fileId: v.string(),
    },
    handler: async (ctx, args) => {
        await ConvexVectorStore.fromTexts(
            args.splittedText,
            Array(args.splittedText.length).fill({ fileId: args.fileId }),
            new GoogleGenerativeAIEmbeddings({
                apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
                model: "text-embedding-004", // 768 dimensions
                taskType: TaskType.RETRIEVAL_DOCUMENT,
                title: "Document title",
            }),
            { ctx }
        );
        return "Generated Embeddings for PDF";
    },
});
export const search = action({
    args: {
        query: v.string(),
        fileId: v.string()
    },
    handler: async (ctx, args) => {
        const vectorStore = new ConvexVectorStore(
            new GoogleGenerativeAIEmbeddings({
                apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
                model: "text-embedding-004", // 768 dimensions
                taskType: TaskType.RETRIEVAL_DOCUMENT,
                title: "Document title",
            }), { ctx });

        const resultOne = await (await vectorStore.similaritySearch(args.query, 16))
        .filter((q) => q.metadata.fileId == args.fileId);
        console.log(resultOne);
        return JSON.stringify(resultOne);
    },
});