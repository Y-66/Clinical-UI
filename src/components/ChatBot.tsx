"use client";

import { Button } from "antd";
import { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "bot"; // 前端内部用 sender，bot 对应后端的 assistant
  content: string;
}

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatIds, setChatIds] = useState<string[]>([]);
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

    const fetchChatIds = async () => {
      try {
        const res = await fetch(`http://localhost:8080/ai/history/chat`);
        let data: string[] = await res.json();
        data = data.filter((id) => id && id.trim() !== "");
        console.log(data);
        setChatIds(data);
        // if (data.length > 0) {
        //   setCurrentChatId(data[0]); // 默认选中第一个
        // }
      } catch (err) {
        console.error("Failed to load chat IDs:", err);
      }
    };
    fetchChatIds();
  }, []);

  // 监听 currentChatId 改变，加载对应聊天记录
  useEffect(() => {
    const fetchMessages = async (chatId: string) => {
      try {
        const res = await fetch(
          `http://localhost:8080/ai/history/chat/${chatId}`
        );
        const data: { role: string; content: string }[] = await res.json();

        const mapped: Message[] = data.map((msg) => ({
          sender: msg.role === "assistant" ? "bot" : "user",
          content: msg.content,
        }));

        setMessages(mapped);
      } catch (err) {
        console.error("Failed to load chat messages:", err);
        setMessages([]);
      }
    };

    if (currentChatId) {
      fetchMessages(currentChatId);
    }
  }, [currentChatId]);

  // 发送消息
  const handleSend = async () => {
    if (!input.trim() || !currentChatId) return;

    setMessages((prev) => [...prev, { sender: "user", content: input }]);
    setInput("");
    setIsStreaming(true);

    const formData = new FormData();
    formData.append("prompt", input);
    formData.append("chatId", currentChatId);

    try {
      const response = await fetch("http://localhost:8080/ai/chat", {
        method: "POST",
        body: formData,
      });

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
    setChatIds((prev) => [newChatId, ...prev]);
  };

  return (
    <div className="flex max-w-5xl mx-auto border rounded bg-white">
      {/* 侧边栏 */}
      <div className="w-48 h-[400px] overflow-y-auto border-r p-3 bg-gray-100 flex flex-col">
        <h2 className="font-semibold text-gray-700">Conversations</h2>
        <Button onClick={startNewChat}>New Chat</Button>

        <div className="mt-2 flex-1 space-y-1 overflow-y-auto">
          {chatIds.length === 0 && (
            <div className="text-gray-400 text-sm">No chats found</div>
          )}
          {chatIds.map((id) => (
            <div
              key={id}
              onClick={() => setCurrentChatId(id)}
              className={`cursor-pointer p-2 rounded text-sm truncate ${
                currentChatId === id
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              {id}
            </div>
          ))}
        </div>
      </div>

      {/* 主聊天区 */}
      <div className="flex-1 flex flex-col p-4 h-[400px]">
        <div
          ref={messagesBoxRef}
          className="h-80 overflow-y-auto border rounded p-3 space-y-3 bg-gray-50"
        >
          {messages.length === 0 && (
            <div className="text-gray-400">
              Type and send to start the chat.
            </div>
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
            className="flex-1 border rounded px-3 py-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            onClick={handleSend}
            disabled={isStreaming}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {isStreaming ? "Streaming..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
