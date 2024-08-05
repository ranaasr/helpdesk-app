import React, { useState, useEffect, useRef } from "react";
import {
  editStatusAdmin,
  editAdmin,
  ambilSemuaAdmin,
  hapusAdmin,
} from "../database/adminManagementService";
import ToastHelpdesk from "../components/ToastHelpdesk";
import TabelAdminHelpdesk from "../components/TabelAdminHelpdesk";
import "./styles/Content.css";
import ModalCRUD from "../components/ModalCRUD";
import ModalEditUser from "../components/ModalEditUser";
import { useCookies } from "react-cookie";

const AdminManagement = () => {
  const [show, setShow] = useState(false);
  const [activateShow, setActivateShow] = useState(false);
  const [inactivateShow, setInactivateShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [faktaPermasalahan, setFaktaPermasalahan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activateId, setActivateId] = useState(null);
  const [inactivateId, setInactivateId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [editNidn, setEditNidn] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editId, setEditId] = useState(null);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const inputRef = useRef(null);
  const [cookies] = useCookies(["user"]);
  const nidnAkun = cookies.user.email.split("@")[0];

  const showToast = (message) => {
    setToastMessage(message);
    setToastShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setActivateShow(false);
    setInactivateShow(false);
    setDeleteShow(false);
    setEditShow(false);
  };

  const handleActivateShow = (id) => {
    setActivateId(id);
    setActivateShow(true);
  };

  const handleInactivateShow = (id) => {
    setInactivateId(id);
    setInactivateShow(true);
  };

  const handleDeleteShow = (id) => {
    setDeleteId(id);
    setDeleteShow(true);
  };

  const handleEditShow = (id, nidn, nama, password) => {
    setEditId(id);
    setEditNama(nama);
    setEditNidn(nidn);
    setEditPassword(password);
    setEditShow(true);
  };

  const confirmActivate = async () => {
    try {
      await editStatusAdmin(activateId, "aktif");
      handleClose();
      showToast("Admin berhasil diaktifkan!");
      // Update data
      const updatedData = faktaPermasalahan.map((item) =>
        item.id === activateId ? { ...item, status: "aktif" } : item
      );
      setFaktaPermasalahan(updatedData);
    } catch (e) {
      console.error("Error activating admin: ", e);
      showToast("Terjadi kesalahan saat mengaktifkan admin.");
    }
  };

  const confirmInactivate = async () => {
    try {
      await editStatusAdmin(inactivateId, "nonaktif");
      handleClose();
      showToast("Admin berhasil dinonaktifkan!");
      // Update data
      const updatedData = faktaPermasalahan.map((item) =>
        item.id === inactivateId ? { ...item, status: "nonaktif" } : item
      );
      setFaktaPermasalahan(updatedData);
    } catch (e) {
      console.error("Error inactivating admin: ", e);
      showToast("Terjadi kesalahan saat meng-nonaktifkan admin.");
    }
  };

  const confirmDelete = async () => {
    try {
      await hapusAdmin(deleteId);
      handleClose();
      showToast("Admin berhasil dihapus!");
      // Remove the deleted admin from state
      setFaktaPermasalahan(
        faktaPermasalahan.filter((item) => item.id !== deleteId)
      );
    } catch (e) {
      console.error("Error deleting admin: ", e);
      showToast("Terjadi kesalahan saat menghapus admin.");
    }
  };

  const confirmEdit = async (e) => {
    e.preventDefault();
    try {
      await editAdmin(editId, editNama, editPassword);
      handleClose();
      showToast("Admin berhasil diedit!");
    } catch (e) {
      console.error("Error editing admin: ", e);
      showToast("Terjadi kesalahan saat mengedit admin.");
    }
  };

  useEffect(() => {
    const unsubscribe = ambilSemuaAdmin((data) => {
      setFaktaPermasalahan(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (show) {
      inputRef.current.focus();
    }
  }, [show]);

  return (
    <div className="fakta-permasalahan">
      <div className="content">
        <div className="header">
          <span className="material-symbols-outlined">supervisor_account</span>
          <h1>Manajemen Admin</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : faktaPermasalahan.length === 0 ? (
          <p>Tidak ada admin</p>
        ) : (
          <TabelAdminHelpdesk
            item="Admin"
            daftarData={faktaPermasalahan}
            handleActivateShow={handleActivateShow}
            handleInactivateShow={handleInactivateShow}
            handleEditShow={handleEditShow}
            handleDeleteShow={handleDeleteShow}
            nidnAkun={nidnAkun}
          />
        )}
      </div>

      <ModalCRUD
        item="Admin"
        show={activateShow}
        handleClose={handleClose}
        handleSubmit={confirmActivate}
        title="Konfirmasi Aktivasi"
        buttonLabel="Aktifkan"
        type="aktivasi"
      />

      <ModalCRUD
        item="Admin"
        show={inactivateShow}
        handleClose={handleClose}
        handleSubmit={confirmInactivate}
        title="Konfirmasi In-Aktivasi"
        buttonLabel="Nonaktifkan"
        type="in-aktivasi"
      />

      <ModalCRUD
        item="Admin"
        show={deleteShow}
        handleClose={handleClose}
        handleSubmit={confirmDelete}
        title="Konfirmasi Hapus"
        buttonLabel="Hapus"
        type="hapus"
      />

      <ModalEditUser
        type="Admin"
        show={editShow}
        handleClose={handleClose}
        handleSubmit={confirmEdit}
        nidn={editNidn}
        namaLengkap={editNama}
        setNamaLengkap={setEditNama}
        includePassword={true}
        password={editPassword}
        setPassword={setEditPassword}
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

export default AdminManagement;
