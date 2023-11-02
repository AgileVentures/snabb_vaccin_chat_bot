/* eslint-disable no-undef */
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import fs from "fs/promises";
import path from "path";
import dotenv from 'dotenv';
dotenv.config();

try {
  const sbApiKey = process.env.SUPABASE_API_KEY;
  const sbUrl = process.env.SUPABASE_URL_CHATBOT;
  const openAIApiKey = process.env.OPEN_AI_API_KEY;

  const client = createClient(sbUrl, sbApiKey);
  const currentDir = path.dirname(new URL(import.meta.url).pathname);
  const filePath = path.join(currentDir, "assets", "tbe_faq.txt");
  const text = await fs.readFile(filePath, "utf-8");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: ["\n\n", "\n", " ", ""],
    chunkOverlap: 50,
  });
  const output = await splitter.createDocuments([text]);
  const resp = await SupabaseVectorStore.fromDocuments(
    output,
    new OpenAIEmbeddings({ openAIApiKey }),
    { client, tableName: "documents" }
  );

  console.log(resp);
} catch (err) {
  console.log(err);
}
