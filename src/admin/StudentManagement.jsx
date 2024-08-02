import React, { useState, useEffect, useRef } from "react";
import {
  ambilSemuaStudent,
  editStudent,
  hapusStudent,
} from "../database/studentManagementService";
import ToastHelpdesk from "../components/ToastHelpdesk";
import TabelStudentHelpdesk from "../components/TabelStudentHelpdesk";
import "./styles/Content.css";
import ModalEditUser from "../components/ModalEditUser"; // Import ModalEditUser
import ModalCRUD from "../components/ModalCRUD";
import { useCookies } from "react-cookie";

const StudentManagement = () => {
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [faktaPermasalahan, setFaktaPermasalahan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editPassword, setEditPassword] = useState("");
  const [editNpm, setEditNpm] = useState(null);
  const [editNama, setEditNama] = useState(""); // New state for name
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [cookies] = useCookies(["user"]);
  const nidnAkun = cookies.user.email.split("@")[0];

  const showToast = (message) => {
    setToastMessage(message);
    setToastShow(true);
  };

  const handleClose = () => {
    setEditShow(false);
    setDeleteShow(false);
  };

  const handleEditShow = (id, nidn, nama, password) => {
    setEditId(id);
    setEditNpm(nidn);
    setEditNama(nama);
    setEditPassword(password);
    setEditShow(true);
  };

  const handleDeleteShow = (id) => {
    setDeleteId(id);
    setDeleteShow(true);
  };

  const confirmEdit = async (e) => {
    e.preventDefault();
    try {
      await editStudent(editId, editNama, editPassword);
      handleClose();
      showToast("User berhasil diedit!");
    } catch (e) {
      console.error("Error editing user: ", e);
      showToast("Terjadi kesalahan saat mengedit user.");
    }
  };

  const confirmDelete = async () => {
    try {
      await hapusStudent(deleteId);
      handleClose();
      showToast("User berhasil dihapus!");
      // Remove the deleted user from state
      setFaktaPermasalahan(
        faktaPermasalahan.filter((item) => item.id !== deleteId)
      );
    } catch (e) {
      console.error("Error deleting user: ", e);
      showToast("Terjadi kesalahan saat menghapus user.");
    }
  };

  useEffect(() => {
    const unsubscribe = ambilSemuaStudent((data) => {
      setFaktaPermasalahan(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="fakta-permasalahan">
      <div className="content">
        <div className="header">
          <span className="material-symbols-outlined">school</span>
          <h1>Manajemen User</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : faktaPermasalahan.length === 0 ? (
          <p>Tidak ada user</p>
        ) : (
          <TabelStudentHelpdesk
            item="Mahasiswa"
            daftarData={faktaPermasalahan}
            handleEditShow={handleEditShow}
            handleDeleteShow={handleDeleteShow} // Add handleDeleteShow as needed
            nidnAkun={nidnAkun}
          />
        )}
      </div>

      <ModalEditUser
        type="User"
        show={editShow}
        handleClose={handleClose}
        handleSubmit={confirmEdit}
        nidn={editNpm}
        namaLengkap={editNama}
        setNamaLengkap={setEditNama}
        password={editPassword}
        setPassword={setEditPassword}
        includePassword={true} // Set to true if you want the password field to be included
      />

      <ModalCRUD
        item="User"
        show={deleteShow}
        handleClose={handleClose}
        handleSubmit={confirmDelete}
        title="Konfirmasi Hapus"
        buttonLabel="Hapus"
        type="hapus"
      />

      <ToastHelpdesk
        show={toastShow}
        message={toastMessage}
        duration={3000}
        onClose={() => setToastShow(false)}
      />
    </div>
  );
};

export default StudentManagement;
