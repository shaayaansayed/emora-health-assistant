import { marked } from "marked";

import MessageType from "../types/message-type";

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div
      className={`flex w-full bg-transparent mt-2 mb-2 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`rounded-md ml-2 mr-2 p-2 px-3 text-sm flex flex-col gap-1 ${message.role === "assistant" ? "bg-gray-100 text-gray-700" : "bg-blue-300 text-white"}`}
      >
        <div dangerouslySetInnerHTML={{ __html: marked(message.content) }} />
      </div>
    </div>
  );
};

export default Message;
