// 获取Id列表
export const fetchChatIds = async () => {
  try {
    const res = await fetch(`http://localhost:8080/ai/history/chat`);
    let data: string[] = await res.json();
    data = data.filter((id) => id && id.trim() !== "");
    console.log(data);
    return data;
    // if (data.length > 0) {
    //   setCurrentChatId(data[0]); // 默认选中第一个
    // }
  } catch (err) {
    console.error("Failed to load chat IDs:", err);
  }
};

// 获取chatId对应的聊天历史
export const fetchMessages = async (chatId: string) => {
  const res = await fetch(`http://localhost:8080/ai/history/chat/${chatId}`);
  const data: { role: string; content: string }[] = await res.json();

  return data;
};

// 发送聊天消息
export const sendChatMessage = async (prompt: string, chatId: string) => {
  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("chatId", chatId);

  const response = await fetch("http://localhost:8080/ai/chat", {
    method: "POST",
    body: formData,
  });

  return response;
};
