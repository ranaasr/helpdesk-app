// src/pages/NotifikasiAdmin.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import ModalCRUD from "../components/ModalCRUD";
import ToastHelpdesk from "../components/ToastHelpdesk";
import {
  ambilSemuaNotifications,
  tambahMenjadiFakta,
  hapusNotification,
  tandaiNotificationSebagaiDibaca,
} from "../database/notificationService";
import "./styles/NotifikasiAdmin.css";

const NotifikasiAdmin = () => {
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState("");
  const [notifikasi, setNotifikasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [error, setError] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const inputRef = useRef(null);

  const { updateUnreadCount } = useOutletContext();

  const handleClose = () => {
    setModalShow(false);
    setDescription("");
    setError("");
  };

  const handleAddShow = (notif) => {
    setSelectedNotif(notif);
    setDescription(notif.description);
    setModalType("tambah");
    setModalShow(true);
  };

  const handleDeleteShow = (notif) => {
    setSelectedNotif(notif);
    setModalType("hapus");
    setModalShow(true);
  };

  const handleDelete = async () => {
    try {
      await hapusNotification(selectedNotif, setToastMessage, handleClose);
      setToastShow(true);
    } catch (e) {
      setError("Error dalam menghapus notifikasi.");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await tambahMenjadiFakta(
        description,
        selectedNotif,
        setToastMessage,
        handleClose
      );
      setToastShow(true);
    } catch (e) {
      setError(e.message);
    }
  };

  const markAsRead = async (id) => {
    try {
      await tandaiNotificationSebagaiDibaca(id, setToastMessage);
      setToastShow(true);
    } catch (e) {
      setError("Error marking notification as read.");
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const options = { hour: "2-digit", minute: "2-digit" };

    if (date.toDateString() === now.toDateString()) {
      return `Hari ini, ${date.toLocaleTimeString([], options)}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Kemarin, ${date.toLocaleTimeString([], options)}`;
    } else {
      return date.toLocaleDateString([], {
        day: "2-digit",
        month: "long",
        year: "numeric",
        ...options,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = ambilSemuaNotifications(
      setNotifikasi,
      setLoading,
      updateUnreadCount
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (show) {
      inputRef.current.focus();
    }
  }, [show]);

  const renderNotifikasi = () => {
    const unreadNotifikasi = notifikasi.filter((notif) => !notif.isRead);
    const readNotifikasi = notifikasi.filter((notif) => notif.isRead);

    return (
      <>
        {unreadNotifikasi.length > 0 && (
          <>
            <h3>Notifikasi belum dibaca</h3>
            {unreadNotifikasi.map((notif) => (
              <div key={notif.id} className="notifikasi-card">
                <div className="notifikasi-content">
                  <div className="notifikasi-header">
                    <p className="notifikasi-description">
                      {notif.description}
                    </p>
                  </div>
                  <p className="notifikasi-meta">
                    {formatDate(notif.createdAt)} oleh {notif.pengusulNama} -{" "}
                    {notif.pengusulNpm}
                  </p>
                  <div className="notifikasi-actions">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-top-add`}>Tambah</Tooltip>}
                    >
                      <Button
                        variant="primary"
                        onClick={() => handleAddShow(notif)}
                        className="mr-2"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-top-delete`}>Hapus</Tooltip>
                      }
                    >
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteShow(notif)}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>
                <div className="notification-icon">
                  <span className="material-symbols-outlined unread-icon">
                    notifications_unread
                  </span>
                  <Button
                    variant="primary"
                    onClick={() => markAsRead(notif.id)}
                  >
                    Tandai telah dibaca
                  </Button>
                  {notif.status && <p>Status: {notif.status}</p>}
                </div>
              </div>
            ))}
            <hr className="notifikasi-divider" />
          </>
        )}

        {readNotifikasi.length > 0 && (
          <>
            <h3>Notifikasi telah dibaca</h3>
            {readNotifikasi.map((notif) => (
              <div key={notif.id} className="notifikasi-card">
                <div className="notifikasi-content">
                  <div className="notifikasi-header">
                    <p className="notifikasi-description">
                      {notif.description}
                    </p>
                  </div>
                  <p className="notifikasi-meta">
                    {formatDate(notif.createdAt)} oleh {notif.pengusulNama} -{" "}
                    {notif.pengusulNpm}
                  </p>
                  <div className="notifikasi-actions">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-top-add`}>Tambah</Tooltip>}
                    >
                      <Button
                        variant="primary"
                        onClick={() => handleAddShow(notif)}
                        className="mr-2"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-top-delete`}>Hapus</Tooltip>
                      }
                    >
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteShow(notif)}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>
                <div className="notification-icon">
                  {notif.status && <p>Status: {notif.status}</p>}
                </div>
              </div>
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <div className="notifikasi-admin">
      <div className="content">
        <div className="header">
          <span className="material-symbols-outlined">notifications</span>
          <h1>Notifikasi</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : notifikasi.length === 0 ? (
          <p>Tidak ada notifikasi</p>
        ) : (
          <div className="notifikasi-list">{renderNotifikasi()}</div>
        )}
      </div>

      <ModalCRUD
        item="Fakta"
        show={modalShow}
        handleClose={handleClose}
        handleSubmit={modalType === "hapus" ? handleDelete : handleAddSubmit}
        title={
          modalType === "hapus"
            ? "Konfirmasi Hapus Notifikasi"
            : "Tambah sebagai Fakta Baru"
        }
        buttonLabel={modalType === "hapus" ? "Hapus" : "Simpan"}
        nama={description}
        setNama={setDescription}
        error={error}
        setError={setError}
        inputRef={inputRef}
        type={modalType}
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

export default NotifikasiAdmin;
