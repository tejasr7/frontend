import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore();

export const fetchSpacesFromFirestore = async () => {
    const snapshot = await getDocs(collection(db, "chatSpaces"));
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: new Date(doc.data().updatedAt.seconds * 1000),
    }));   
}