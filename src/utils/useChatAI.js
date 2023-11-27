// utils/useChatAI.js

import { useState } from "react";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { StringOutputParser } from "langchain/schema/output_parser";
import { combineDocuments } from "./combineDocuments";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "langchain/schema/runnable";
import { formatConvHistory } from "./formatConvHistory";
import { retriever } from "./retriever";
import { standaloneQuestionPrompt, answerPrompt } from "./prompts";

export function useChatAI() {
  const [convHistory, setConvHistory] = useState([]);
  const openAIApiKey = import.meta.env.VITE_OPEN_AI_API_KEY;
  const llm = new ChatOpenAI({
    openAIApiKey: openAIApiKey,
    modelName: "gpt-4",
    temperature: 0.9,
  });

  const standaloneQuestionChain = standaloneQuestionPrompt
    .pipe(llm)
    .pipe(new StringOutputParser());

  const retrieverChain = RunnableSequence.from([
    (prevResult) => prevResult.standalone_question,
    retriever,
    combineDocuments,
  ]);
  const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

  const chain = RunnableSequence.from([
    {
      standalone_question: standaloneQuestionChain,
      original_input: new RunnablePassthrough(),
    },
    {
      context: retrieverChain,
      question: ({ original_input }) => original_input.question,
      conv_history: ({ original_input }) => original_input.conv_history,
    },
    answerChain,
  ]);

  const progressConversation = async (userInput) => {
    // Step 1: Add user's message to the conversation history immediately
    setConvHistory((prevHistory) => [
      ...prevHistory,
      { type: "human", text: userInput },
    ]);

    const response = await chain.invoke({
      question: userInput,
      conv_history: formatConvHistory(convHistory),
    });

    // Step 2: Add AI's response to the conversation history after receiving it
    setConvHistory((prevHistory) => [
      ...prevHistory,
      { type: "ai", text: response },
    ]);

    return response;
  };

  return {
    convHistory,
    progressConversation,
  };
}
