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

export const fetchMessages = async (chatId: string) => {
  const res = await fetch(`http://localhost:8080/ai/history/chat/${chatId}`);
  const data: { role: string; content: string }[] = await res.json();

  return data;
};
