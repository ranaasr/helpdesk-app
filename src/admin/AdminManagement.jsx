import React, { useState, useEffect, useRef } from "react";
import {
  editStatusAdmin,
  ambilSemuaAdmin,
} from "../database/adminManagementService";
import ToastHelpdesk from "../components/ToastHelpdesk";
import TabelAdminHelpdesk from "../components/TabelAdminHelpdesk";
import "./styles/Content.css";
import ModalCRUD from "../components/ModalCRUD";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useCookies } from "react-cookie";

const AdminManagement = () => {
  const [show, setShow] = useState(false);
  const [activateShow, setActivateShow] = useState(false);
  const [faktaPermasalahan, setFaktaPermasalahan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activateId, setActivateId] = useState(null);
  const [activatePassword, setActivatePassword] = useState(null);
  const [activateNidn, setActivateNidn] = useState(null);
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
  };

  const handleActivateShow = (id, password, nidn) => {
    setActivateId(id);
    setActivatePassword(password);
    setActivateNidn(nidn);
    setActivateShow(true);
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
          <p>No Facts of the Problem</p>
        ) : (
          <TabelAdminHelpdesk
            item="Admin"
            daftarData={faktaPermasalahan}
            handleActivateShow={handleActivateShow}
            nidnAkun={nidnAkun}
          />
        )}
      </div>

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
