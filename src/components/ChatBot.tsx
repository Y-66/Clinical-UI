import { useState, useRef, useEffect } from "react";
import {
  deleteChatById,
  fetchChatIds,
  fetchMessages,
  sendChatMessage,
} from "../apis/chat";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Spin } from "antd";
import { MessagesSquare, Forward } from "lucide-react";

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

    const loadChatIds = async () => {
      const res = await fetchChatIds();
      if (res) {
        setChatIds(res);
        // 可选：默认选中第一个
        // setCurrentChatId(res[0]);
      }
    };
    loadChatIds();
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

  // 处理删除对话
  const onDelete = async (chatId: string): Promise<void> => {
    await deleteChatById(chatId);
    setChatIds((prev) => prev.filter((id) => id !== chatId)); // 更新本地状态
  };

  // 开始新对话
  const startNewChat = () => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    setMessages([]);
    setChatIds((prev) => [newChatId, ...prev]);
  };

  return (
    <div className="flex max-w-5xl mx-auto border rounded bg-white ">
      {/* 侧边栏 */}
      <div className="w-55 h-[400px] overflow-y-auto border-r p-3 bg-gray-100 flex flex-col">
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
              className={`relative group cursor-pointer p-2 rounded text-sm truncate flex items-center gap-3 ${
                currentChatId === id
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              <MessagesSquare size={25} />
              <span>{id.slice(-4)}</span>
              <Popconfirm
                title="Delete the chat"
                description="Are you sure to delete this chat?"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                onConfirm={() => onDelete(id)}
              >
                <Button
                  type="text"
                  danger
                  size="small"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity !bg-transparent !shadow-none !text-gray-400 hover:!text-red-500"
                >
                  ×
                </Button>
              </Popconfirm>
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
          <Button
            onClick={handleSend}
            disabled={isStreaming}
            className="px-3 py-5 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {isStreaming ? <Spin /> : <Forward />}
          </Button>
        </div>
      </div>
    </div>
  );
}
