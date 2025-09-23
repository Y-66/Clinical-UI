const BASE_URL: string = "http://localhost:8080";

// 获取Id列表
export const fetchChatIds = async () => {
  try {
    const res = await fetch(`${BASE_URL}/ai/history/chat`);
    const data: string[] = await res.json();

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
  const res = await fetch(`${BASE_URL}/ai/history/chat/${chatId}`);
  const data: { role: string; content: string }[] = await res.json();

  return data;
};

// 发送聊天消息
export const sendChatMessage = async (prompt: string, chatId: string) => {
  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("chatId", chatId);

  const response = await fetch(`${BASE_URL}/ai/chat`, {
    method: "POST",
    body: formData,
  });

  return response;
};

// 删除某个 chatId 的对话记录
export const deleteChatById = async (chatId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/ai/history/chat/${chatId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Delete API Error:", error);
    return false;
  }
};
