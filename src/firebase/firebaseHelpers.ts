// firebaseHelpers.js
import { doc, collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase"; // Adjust the path as needed


export const addMessageToSpace = async (
    userId: string,
    spaceId: string,
    message: string,
    isAi: boolean
  ) => {
    const messageRef = collection(
      db,
      "chat_history",
      userId,
      "messages",
      spaceId,
      "messages"
    );
  
    await addDoc(messageRef, {
      text: message,
      isAi,
      createdAt: serverTimestamp(),
    });
  };
  
// export const addMessageToSpace = async (userId, spaceId, message) => {
//   const messageRef = collection(
//     db,
//     "chat_history",
//     userId,
//     "messages",
//     spaceId,
//     "messages"
//   );

//   await addDoc(messageRef, {
//     text: message,
//     createdAt: serverTimestamp(),
//   });
// };

export const fetchMessagesFromSpace = async (userId, spaceId) => {
  const messagesRef = collection(
    db,
    "chat_history",
    userId,
    "messages",
    spaceId,
    "messages"
  );

  const q = query(messagesRef, orderBy("createdAt", "asc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
