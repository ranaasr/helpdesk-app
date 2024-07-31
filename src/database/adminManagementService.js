import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const adminManagementCollection = collection(db, "admin");

export const tambahAdmin = async (nama) => {
  const timestamp = new Date();
  const docRef = await addDoc(adminManagementCollection, {
    nama_fakta: nama.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return docRef.id;
};

export const editAdmin = async (id, nama) => {
  const timestamp = new Date();
  const docRef = doc(db, "admin", id);
  await updateDoc(docRef, {
    nama_fakta: nama.trim(),
    updatedAt: timestamp,
  });
};

export const editStatusAdmin = async (id) => {
  const timestamp = new Date();
  const docRef = doc(db, "admin", id);
  await updateDoc(docRef, {
    status: "aktif",
    updatedAt: timestamp,
  });
};

export const hapusAdmin = async (id) => {
  // Delete the fact document
  await deleteDoc(doc(db, "admin", id));
};

export const ambilSemuaAdmin = (callback) => {
  const q = query(adminManagementCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};
