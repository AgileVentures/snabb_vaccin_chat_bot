import { useState, useRef, useEffect } from "react";
import send from "../assets/send.svg";

import logo from "../assets/logo_small.png";
import LoadingDots from "./LoadingDots";
import { useChatAI } from "../utils/useChatAI";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatbotContainerRef = useRef(null);
  const chatContainerRef = useRef(null);
  const userInputRef = useRef(null);
  const { convHistory, progressConversation } = useChatAI();

  useEffect(() => {
    const setVHHeight = () => {
      if (window.innerWidth <= 600) {
        const vh = window.innerHeight - 20;
        if (chatbotContainerRef.current) {
          chatbotContainerRef.current.style.height = `${vh}px`;
        }
      } else if (chatbotContainerRef.current) {
        chatbotContainerRef.current.style.height = "auto";
      }
    };
    setVHHeight();
    window.addEventListener("resize", setVHHeight);
    return () => {
      window.removeEventListener("resize", setVHHeight);
    };
  }, []);

  useEffect(() => {
    const chatbotConversation = chatContainerRef.current;

    const adjustScroll = () => {
      chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
    };

    adjustScroll();

}, [convHistory, isSubmitting]);


  // useEffect(() => {
  //   const chatbotConversation = chatContainerRef.current;
  //   const lastBubble = chatbotConversation.lastChild;

  //   const adjustScroll = () => {
  //     if (
  //       lastBubble &&
  //       lastBubble.offsetHeight > chatbotConversation.offsetHeight
  //     ) {
  //       chatbotConversation.scrollTop = lastBubble.offsetTop - 20; // 20px från toppen
  //     } else {
  //       chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
  //     }
  //   };

  //   // Add a slight delay before adjusting the scroll position
  //   setTimeout(adjustScroll, 50); // 50ms should be enough, but you can adjust as needed
  // }, [convHistory, isSubmitting]);

  function adjustTextareaHeight(textarea) {
    textarea.style.height = "auto"; // Reset height to auto
    textarea.style.height = textarea.scrollHeight + "px"; // Set to scroll height
  }

  async function handleUserInputSubmission(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setUserInput("");
    userInputRef.current.style.height = "";
    // Get AI's response and add it to the conversation
    await progressConversation(userInput);
    setIsSubmitting(false);
  }
  return (
    <main>
      <section className="chatbot-container" ref={chatbotContainerRef}>
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
              <LoadingDots />
            </div>
          )}
        </div>
        <form
          className="chatbot-input-container"
          onSubmit={(event) => handleUserInputSubmission(event)}
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
