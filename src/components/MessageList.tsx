import { useEffect, useRef } from "react";

interface Message {
  sender: "user" | "bot";
  content: string;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 当 messages 改变时自动滚到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto border rounded p-3 space-y-3 bg-gray-50 min-h-0">
      {messages.length === 0 && (
        <div className="text-gray-400">Type and send to start the chat.</div>
      )}

      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`max-w-[85%] break-words break-all whitespace-pre-wrap p-3 rounded ${
            msg.sender === "user"
              ? "bg-blue-600 text-white ml-auto"
              : "bg-gray-200 text-black mr-auto"
          }`}
        >
          {msg.content}
        </div>
      ))}

      {/* 占位元素，用于滚动到底部 */}
      <div ref={chatEndRef} />
    </div>
  );
}
