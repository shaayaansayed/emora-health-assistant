import dotenv from "dotenv";
import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

async function loadMarkdownFile(filePath: string): Promise<string> {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    const data = await fs.readFile(fullPath, "utf8");
    return data;
  } catch (error) {
    console.error("Error reading the markdown file:", error);
    throw error;
  }
}

async function main() {
  try {
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 256,
      chunkOverlap: 20,
    });

    const text = await loadMarkdownFile("emora-health.md");
    const splitDocuments = await splitter.createDocuments([text]);

    const vectorstore = await SupabaseVectorStore.fromDocuments(
      splitDocuments,
      new OpenAIEmbeddings(),
      {
        client,
        tableName: "documents",
      }
    );

    console.log("Operation successful", vectorstore);
  } catch (e: any) {
    console.error("An error occurred:", e.message);
  }
}

main();
