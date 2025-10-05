import { useState, useRef, useEffect } from "react";
import { fetchMessages, sendChatMessage } from "../apis/chat";
import { Button, Spin, Avatar } from "antd";
import { SendOutlined, UserOutlined, RobotOutlined } from "@ant-design/icons";

interface Message {
  sender: "user" | "bot";
  content: string;
}

export default function SideBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const messagesBoxRef = useRef<HTMLDivElement | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    startNewChat();
  }, []);

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

  const startNewChat = () => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    setMessages([]);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Area */}
      <div
        ref={messagesBoxRef}
        className="flex-1 overflow-y-auto p-3 space-y-4 bg-gradient-to-b from-white to-gray-50 rounded-xl"
        style={{ minHeight: '450px', maxHeight: '520px' }}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-4">
              <RobotOutlined className="text-purple-600 text-2xl" />
            </div>
            <p className="text-gray-500 font-medium mb-2">How can I assist you?</p>
            <p className="text-gray-400 text-sm">
              Ask me anything about your prescription
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <Avatar
              size={32}
              icon={msg.sender === "user" ? <UserOutlined /> : <RobotOutlined />}
              style={{
                backgroundColor: msg.sender === "user" ? "#667eea" : "#f093fb",
                flexShrink: 0,
              }}
            />
            <div
              className={`max-w-[75%] whitespace-pre-wrap break-words px-4 py-3 rounded-2xl shadow-sm ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-tr-sm"
                  : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isStreaming) handleSend();
            }}
          />
          <Button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            type="primary"
            size="large"
            icon={isStreaming ? <Spin size="small" /> : <SendOutlined />}
            className="premium-button flex-shrink-0"
            style={{
              background: isStreaming || !input.trim() 
                ? '#d1d5db' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              width: '56px',
              height: '48px',
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          AI Assistant • Powered by Advanced AI
        </p>
      </div>
    </div>
  );
}
