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

const adminManagementCollection = collection(db, "admin");

export const tambahAdmin = async (nama) => {
  const timestamp = new Date();
  const docRef = await addDoc(adminManagementCollection, {
    nama: nama.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return docRef.id;
};

export const editAdmin = async (id, nama, password) => {
  const timestamp = new Date();
  const docRef = doc(db, "admin", id);
  await updateDoc(docRef, {
    nama: nama.trim(),
    updatedAt: timestamp,
    password: password
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

// Fungsi untuk mengambil data dari satu dokumen admin berdasarkan ID
export const ambilSatuAdmin = async (id) => {
  const docRef = doc(db, "admin", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Dokumen tidak ditemukan");
  }
};
