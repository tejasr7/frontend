// firebase/spaces.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase"; // adjust as needed
import { ChatSpace } from "@/models/chat";

export const getUserSpaces = async (userId: string): Promise<ChatSpace[]> => {
  const spacesRef = collection(db, "chat_history", userId, "spaces");
  const querySnapshot = await getDocs(spacesRef);

  const spaces: ChatSpace[] = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "Untitled",
      messages: [], // load messages later separately
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    };
  });

  return spaces;
};


// // firebase/spaces.ts
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase/firebase"; // your Firebase config

// export const getUserSpaces = async (userId: string) => {
//   const spacesRef = collection(db, "chat_history", userId, "spaces");
//   const querySnapshot = await getDocs(spacesRef);

//   const spaces = querySnapshot.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data(),
//   }));

//   return spaces;
// };
