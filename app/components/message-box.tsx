import { useRef, useEffect, FormEvent, ChangeEvent } from "react";

interface MessageBoxProps {
  input: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setMessageValue: (message: string) => void;
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  input,
  onChange,
  handleSubmit,
  setMessageValue,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [input]);
  return (
    <form
      className="stretch flex flex-row grow items-center mx-2 mb-2"
      onSubmit={handleSubmit}
    >
      <div className="relative flex h-full flex-1 items-stretch">
        <div className="flex w-full items-center justify-between">
          <div className="overflow-hidden flex flex-col w-[390px] relative border rounded-2xl bg-gray-100">
            <textarea
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && "form" in e.target) {
                  e.preventDefault();
                  (e.target.form as HTMLFormElement).requestSubmit();
                }
              }}
              ref={textareaRef}
              onChange={onChange}
              placeholder="Ask the assistant..."
              className="text-sm text-gray-700 m-0 w-full focus:outline-none resize-none border-0 bg-transparent pl-2 pt-2 pb-2 pr-1 h-[32px] max-h-[128px] ring-white focus:ring-0 focus-visible:ring-0 overflow-y-hidden"
            ></textarea>
          </div>
          <button
            type="submit"
            className={`bg-blue-400 p-0.5 border border-blue-400 rounded-lg disabled:opacity-10 transition-colors`}
            disabled={input.length === 0}
          >
            <span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
              >
                <path
                  d="M7 11L12 6L17 11M12 18V7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default MessageBox;
