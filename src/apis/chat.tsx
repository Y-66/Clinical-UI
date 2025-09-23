// import { request } from "../utils/request";

// export const sendMessageAPI = (
//   prompt: string,
//   chatId: string,
//   files?: File[]
// ) => {
//   const formData = new FormData();
//   formData.append("prompt", prompt);
//   formData.append("chatId", chatId);

//   if (files && files.length > 0) {
//     files.forEach((file) => formData.append("files", file));
//   }

//   return request({
//     url: "/ai/chat",
//     method: "POST",
//     data: formData, // 使用 FormData 上传文件
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//     // responseType: "stream", // 如果你想处理流式返回
//     responseType: "text", // 改成 text
//   });
// };
