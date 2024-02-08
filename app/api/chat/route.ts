import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import {
  StringOutputParser,
  BytesOutputParser,
} from "@langchain/core/output_parsers";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import type { DocumentInterface } from "@langchain/core/documents";

const chatModel = new ChatOpenAI({
  temperature: 0.8,
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
});
const client = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
  client,
  tableName: "documents",
  queryName: "match_documents",
});

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    if (message.role === "user") {
      return `Human: ${message.content}`;
    } else if (message.role === "assistant") {
      return `Assistant: ${message.content}`;
    } else {
      return `${message.role}: ${message.content}`;
    }
  });
  return formattedDialogueTurns.join("\n");
};

const combineDocumentsFn = (docs: DocumentInterface<Record<string, any>>[]) => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join("\n\n");
};

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.
  
  <chat_history>
    {chat_history}
  </chat_history>
  
  Follow Up Input: {question}
  Standalone question:`;
const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE
);

const ANSWER_TEMPLATE = `You are an expert in Emora Health, a telehealth pediatric mental health provider.

Answer the question based only on the following context and chat history. Only output the answer, make no mention of the context. Be friendly. 
<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
`;
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

export async function POST(request: NextRequest) {
  const body = await request.json();
  const messages = body.messages ?? [];
  const previousMessages = messages.slice(0, -1);
  const currentMessageContent = messages[messages.length - 1].content;

  const standaloneQuestionChain = RunnableSequence.from([
    condenseQuestionPrompt,
    chatModel,
    new StringOutputParser(),
  ]);

  let resolveWithDocuments: (
    value: DocumentInterface<Record<string, any>>[]
  ) => void;
  const documentPromise = new Promise<DocumentInterface<Record<string, any>>[]>(
    (resolve) => {
      resolveWithDocuments = resolve;
    }
  );

  const retriever = vectorstore.asRetriever({
    callbacks: [
      {
        handleRetrieverEnd(documents) {
          resolveWithDocuments(documents);
        },
      },
    ],
  });

  const retrievalChain = retriever.pipe(combineDocumentsFn);

  const answerChain = RunnableSequence.from([
    {
      context: RunnableSequence.from([
        (input) => input.question,
        retrievalChain,
      ]),
      chat_history: (input) => input.chat_history,
      question: (input) => input.question,
    },
    answerPrompt,
    chatModel,
  ]);

  const conversationalRetrievalQAChain = RunnableSequence.from([
    {
      question: standaloneQuestionChain,
      chat_history: (input) => input.chat_history,
    },
    answerChain,
    new StringOutputParser(),
  ]);

  const stream = await conversationalRetrievalQAChain.stream({
    question: currentMessageContent,
    chat_history: formatVercelMessages(previousMessages),
  });

  return new StreamingTextResponse(stream);
}
