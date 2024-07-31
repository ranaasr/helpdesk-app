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
  getDoc
} from "firebase/firestore";

const studentManagementCollection = collection(db, "users");

export const tambahStudent = async (nama) => {
  const timestamp = new Date();
  const docRef = await addDoc(studentManagementCollection, {
    nama: nama.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return docRef.id;
};

export const editStudent = async (id, nama) => {
  const timestamp = new Date();
  const docRef = doc(db, "users", id);
  await updateDoc(docRef, {
    nama: nama.trim(),
    updatedAt: timestamp,
  });
};

export const hapusStudent = async (id) => {
  // Delete the fact document
  await deleteDoc(doc(db, "users", id));
};

export const ambilSemuaStudent = (callback) => {
  const q = query(studentManagementCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};

// Fungsi untuk mengambil data dari satu dokumen users berdasarkan ID
export const ambilSatuStudent = async (id) => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Dokumen tidak ditemukan");
  }
};
