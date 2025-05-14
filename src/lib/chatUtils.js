import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";

export async function getOrCreateChat(buyerId, sellerId, productId) {
  console.log('buyerId: ', buyerId);
  console.log('sellerId: ', sellerId);
  console.log('productId: ', productId);
  const chatQuery = query(
    collection(db, "chats"),
    where("buyerId", "==", buyerId),
    where("sellerId", "==", sellerId),
    where("productId", "==", productId)
  );

  const snapshot = await getDocs(chatQuery);
  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }

  const newChat = await addDoc(collection(db, "chats"), {
    buyerId,
    sellerId,
    productId,
    lastMessage: "",
    lastUpdated: new Date(),
  });

  return newChat.id;
}
