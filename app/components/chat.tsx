"use client";

import { useState } from "react";
import { useChat } from "ai/react";

import Message from "../components/message";
import Header from "./header";
import MessageBox from "./message-box";

interface ChatProps {}

export const Chat: React.FC<ChatProps> = ({}) => {
  const [message, setMessage] = useState("");

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
    setMessages,
  } = useChat({});

  console.log(messages);

  return (
    <div
      id="chatContainer"
      className="fixed flex flex-col bottom-24 right-6 w-[450px] h-[650px] rounded-lg z-50 shadow-lg opacity-100 transition-all duration-200 ease-in-out"
    >
      <Header />
      <div
        id="messageContainer"
        className="flex flex-col flex-1 overflow-hidden"
      >
        {messages.map((message, index) => (
          <Message
            key={message.id}
            message={{
              role: message.role == "assistant" ? "assistant" : "user",
              content: message.content,
            }}
          />
        ))}
      </div>
      <div id="footerContainer" className="">
        <MessageBox
          input={input}
          onChange={handleInputChange}
          handleSubmit={handleSubmit}
          setMessageValue={setMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
