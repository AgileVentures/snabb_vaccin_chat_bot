import React from "react";
import send from "../assets/send.svg";

const Chatbot = () => {
  return (
    <main>
      <section className="chatbot-container">
        <div className="chatbot-header">
          <p className="sub-heading">Knowledge Bank</p>
        </div>
        <div
          className="chatbot-conversation-container"
          id="chatbot-conversation-container"
        ></div>
        <form id="form" className="chatbot-input-container">
          <input name="user-input" type="text" id="user-input" required />
          <button id="submit-btn" className="submit-btn">
            <img
              src={send}
              className="send-btn-icon"
              alt="Send Icon"
            />
          </button>
        </form>
      </section>
    </main>
  );
};

export default Chatbot;
