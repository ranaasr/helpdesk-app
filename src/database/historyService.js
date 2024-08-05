// ruleService.js
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const historyCollection = collection(db, "history");

export const tambahHistory = async (fakta, user) => {
  const timestamp = new Date();
  const docRef = await addDoc(historyCollection, {
    ...fakta,
    user: user,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return docRef.id;
};

export const editHistory = async (id, fakta, user) => {
  const timestamp = new Date();
  const docRef = doc(db, "history", id);
  await updateDoc(docRef, {
    ...fakta,
    user,
    updatedAt: timestamp,
  });
};

export const hapusHistory = async (id) => {
  await deleteDoc(doc(db, "history", id));
};

export const ambilSemuaHistory = (callback) => {
  const q = query(historyCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};
