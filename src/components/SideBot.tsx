import { useState, useRef, useEffect } from "react";
import { fetchMessages, sendChatMessage } from "../apis/chat";
import { Button, Spin } from "antd";
import { Forward } from "lucide-react";

interface Message {
  sender: "user" | "bot"; // 前端内部用 sender，bot 对应后端的 assistant
  content: string;
}

export default function SideBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const messagesBoxRef = useRef<HTMLDivElement | null>(null);
  const hasFetchedRef = useRef(false); // 防止重复 fetch

  // 自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 初次挂载：获取对话 ID 列表，只执行一次
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    startNewChat();
  }, []);

  // 监听 currentChatId 改变，加载对应聊天记录
  useEffect(() => {
    try {
      const loadMessages = async (chatId: string) => {
        const data = await fetchMessages(chatId);
        const mapped: Message[] = data.map((msg) => ({
          sender: msg.role === "assistant" ? "bot" : "user",
          content: msg.content,
        }));
        setMessages(mapped);
      };
      if (currentChatId) {
        loadMessages(currentChatId);
      }
    } catch (err) {
      console.error("Failed to load chat messages:", err);
      setMessages([]);
    }
  }, [currentChatId]);

  // 发送消息
  const handleSend = async () => {
    if (!input.trim() || !currentChatId) return;

    setMessages((prev) => [...prev, { sender: "user", content: input }]);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await sendChatMessage(input, currentChatId);

      if (!response.body) {
        const text = await response.text();
        setMessages((prev) => [...prev, { sender: "bot", content: text }]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let botMessage = "";
      setMessages((prev) => {
        if (prev.length === 0 || prev[prev.length - 1].sender !== "bot") {
          return [...prev, { sender: "bot", content: "" }];
        }
        return prev;
      });

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        botMessage += chunk;

        setMessages((prev) => {
          const lastIndex = prev.length - 1;
          if (prev[lastIndex].sender === "bot") {
            const copy = prev.slice();
            copy[lastIndex] = { sender: "bot", content: botMessage };
            return copy;
          } else {
            return [...prev, { sender: "bot", content: botMessage }];
          }
        });
      }
    } catch (error) {
      console.error("Error streaming chat:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "Error: could not get response." },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  // 开始新对话
  const startNewChat = () => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    setMessages([]);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 消息区 */}
      <div
        ref={messagesBoxRef}
        className=" h-[500px] overflow-y-auto border rounded p-1 space-y-3 bg-gray-50"
      >
        {messages.length === 0 && (
          <div className="text-gray-400">Type and send to start the chat.</div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[85%] whitespace-pre-wrap break-words p-3 rounded ${
              msg.sender === "user"
                ? "bg-blue-600 text-white ml-auto"
                : "bg-gray-200 text-black mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* 输入区 */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="w-[180px] border rounded px-3 py-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <Button
          onClick={handleSend}
          disabled={isStreaming}
          className="px-2 py-5 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isStreaming ? <Spin /> : <Forward />}
        </Button>
      </div>
    </div>
  );
}
