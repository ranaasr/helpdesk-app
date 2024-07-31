import React, { useState, useEffect, useRef } from "react";
import {
  tambahAdmin,
  editStatusAdmin,
  hapusAdmin,
  ambilSemuaAdmin,
} from "../database/adminManagementService";
import { Button } from "react-bootstrap";
import ToastHelpdesk from "../components/ToastHelpdesk";
import TabelAdminHelpdesk from "../components/TabelAdminHelpdesk";
import "./styles/Content.css";
import ModalCRUD from "../components/ModalCRUD";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useCookies } from "react-cookie";

const AdminManagement = () => {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [activateShow, setActivateShow] = useState(false);
  const [nama, setNama] = useState("");
  const [editNama, setEditNama] = useState("");
  const [faktaPermasalahan, setFaktaPermasalahan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [activateId, setActivateId] = useState(null);
  const [activatePassword, setActivatePassword] = useState(null);
  const [activateNidn, setActivateNidn] = useState(null);
  const [error, setError] = useState("");
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
    setEditShow(false);
    setDeleteShow(false);
    setActivateShow(false);
    setNama("");
    setEditNama("");
    setError("");
  };

  const handleShow = () => setShow(true);

  const handleEditShow = (id, nama) => {
    setEditId(id);
    setEditNama(nama);
    setEditShow(true);
  };

  const handleDeleteShow = (id) => {
    setDeleteId(id);
    setDeleteShow(true);
  };

  const handleActivateShow = (id, password, nidn) => {
    setActivateId(id);
    setActivatePassword(password);
    setActivateNidn(nidn);
    setActivateShow(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedNamaFakta = nama.trim();
    if (!trimmedNamaFakta) {
      setError("The facta's name cannot consist only of spaces!");
      return;
    }
    try {
      await tambahAdmin(trimmedNamaFakta);
      setNama("");
      handleClose();
      showToast("Fact added successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // const handleEditSubmit = async (e) => {
  //   e.preventDefault();
  //   const trimmedEditNamaFakta = editNama.trim();
  //   if (!trimmedEditNamaFakta) {
  //     setError("The facta's name cannot consist only of spaces!");
  //     return;
  //   }
  //   try {
  //     await editAdmin(editId, trimmedEditNamaFakta);
  //     handleClose();
  //     showToast("Fact successfully edited!");
  //   } catch (e) {
  //     console.error("Error editing document: ", e);
  //   }
  // };

  const confirmDelete = async () => {
    try {
      await hapusAdmin(deleteId);
      handleClose();
      showToast(`Fact successfully deleted!`);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const confirmActivate = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        `${activateNidn}@admin.com`,
        activatePassword
      );
      await editStatusAdmin(activateId);
      handleClose();
      showToast(`Fact successfully deleted!`);
    } catch (e) {
      console.error("Error deleting document: ", e);
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
    if (show || editShow) {
      inputRef.current.focus();
    }
  }, [show, editShow]);

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
          <p>No Facts of the Problem</p>
        ) : (
          <TabelAdminHelpdesk
            item="Admin"
            daftarData={faktaPermasalahan}
            handleEditShow={handleEditShow}
            handleDeleteShow={handleDeleteShow}
            handleActivateShow={handleActivateShow}
            nidnAkun={nidnAkun}
          />
        )}
      </div>

      <ModalCRUD
        item="Admin"
        show={deleteShow}
        handleClose={handleClose}
        handleSubmit={confirmDelete}
        title="Delete Confirmation"
        buttonLabel="Delete"
        type="delete"
      />

      <ModalCRUD
        item="Admin"
        show={activateShow}
        handleClose={handleClose}
        handleSubmit={confirmActivate}
        title="Activate Confirmation"
        buttonLabel="Activate"
        type="activate"
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
