import { useState, useRef, useEffect } from "react";
import send from "../assets/send.svg";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";

import { combineDocuments } from "../utils/combineDocuments";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "langchain/schema/runnable";
import { formatConvHistory } from "../utils/formatConvHistory";
import { retriever } from "../utils/retriever";
import logo from "../assets/logo_small.png";

const Chatbot = () => {
  const [convHistory, setConvHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatContainerRef = useRef(null);
  const userInputRef = useRef(null);

  const openAIApiKey = import.meta.env.VITE_OPEN_AI_API_KEY;
  const llm = new ChatOpenAI({ openAIApiKey });

  const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question. 
conversation history: {conv_history}
question: {question} 
standalone question:`;
  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about TBE vaccin based on the context provided and the conversation history. Try to find the answer in the context. If the answer is not given in the context, find the answer in the conversation history if possible. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@snabbvaccin.se. Don't try to make up an answer. Always speak as if you were chatting to a friend and always answer in Swedish.
context: {context}
conversation history: {conv_history}
question: {question}
answer: `;
  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

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

  useEffect(() => {
    const chatbotConversation = chatContainerRef.current;
    const lastBubble = chatbotConversation.lastChild;

    if (
      lastBubble &&
      lastBubble.offsetHeight > chatbotConversation.offsetHeight
    ) {
      chatbotConversation.scrollTop = lastBubble.offsetTop - 20; // 20px från toppen
    } else {
      chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
    }
  }, [convHistory]);

  function adjustTextareaHeight(textarea) {
    textarea.style.height = "auto"; // Reset height to auto
    textarea.style.height = textarea.scrollHeight + "px"; // Set to scroll height
  }

  async function progressConversation(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setUserInput("");
    userInputRef.current.style.height = "";

    // Add human message
    setConvHistory((prevHistory) => [
      ...prevHistory,
      { type: "human", text: userInput },
    ]);

    const response = await chain.invoke({
      question: userInput,
      conv_history: formatConvHistory(convHistory),
    });

    // Add AI message
    setConvHistory((prevHistory) => [
      ...prevHistory,
      { type: "ai", text: response },
    ]);

    setIsSubmitting(false);
  }

  return (
    <main>
      <section className="chatbot-container">
        <div className="chatbot-header">
          <img src={logo} className="logo" />
          <p className="sub-heading">Ställ frågor om TBE och vaccin...</p>
        </div>
        <div className="chatbot-conversation-container" ref={chatContainerRef}>
          {convHistory.map((message, index) => (
            <div
              key={index}
              className={`speech speech-${message.type} fade-in`}
            >
              {message.text}
            </div>
          ))}
          {isSubmitting && (
            <div className={`speech speech-ai fade-in`}>
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
            </div>
          )}
        </div>
        <form
          className="chatbot-input-container"
          onSubmit={(event) => progressConversation(event)}
        >
          <textarea
            ref={userInputRef}
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
              adjustTextareaHeight(e.target);
            }}
            required
            rows="1"
            style={{ resize: "none", overflowY: "hidden" }}
            disabled={isSubmitting}
            onFocus={(e) => adjustTextareaHeight(e.target)} // Adjust height on focus
          />
          <button
            id="submit-btn"
            className="submit-btn"
            disabled={isSubmitting}
          >
            <img src={send} className="send-btn-icon" alt="Send Icon" />
          </button>
        </form>
        {convHistory && (
          <div className="ai-notice">
            Svar från AI-bot bör alltid kontrolleras. Uppsök en läkare för
            videre vägledning innan du påbörjar en beahandling.
          </div>
        )}
      </section>
    </main>
  );
};

export default Chatbot;
