/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  tambahKesimpulan,
  editKesimpulan,
  hapusKesimpulan,
  ambilSemuaKesimpulan,
} from "../database/kesimpulanService";
import { Button } from "react-bootstrap";
import ToastHelpdesk from "../components/ToastHelpdesk";
import ModalCRUD from "../components/ModalCRUD";
import TabelContentHelpdesk from "../components/TabelContentHelpdesk";
import "./styles/Content.css";

const Kesimpulan = () => {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [nama, setNama] = useState("");
  const [editNama, setEditNama] = useState("");
  const [kesimpulan, setKesimpulan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const inputRef = useRef(null);

  const showToast = (message) => {
    setToastMessage(message);
    setToastShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setEditShow(false);
    setDeleteShow(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedNamaKesimpulan = nama.trim();
    if (!trimmedNamaKesimpulan) {
      setError("Nama kesimpulan tidak boleh hanya berisi spasi!");
      return;
    }
    try {
      const newId = await tambahKesimpulan(trimmedNamaKesimpulan);
      setKesimpulan([
        ...kesimpulan,
        { id: newId, nama_kesimpulan: trimmedNamaKesimpulan },
      ]);
      setNama("");
      handleClose();
      showToast("Kesimpulan berhasil ditambahkan!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const trimmedEditNamaKesimpulan = editNama.trim();
    if (!trimmedEditNamaKesimpulan) {
      setError("Nama kesimpulan tidak boleh hanya berisi spasi!");
      return;
    }
    try {
      await editKesimpulan(editId, trimmedEditNamaKesimpulan);
      setKesimpulan(
        kesimpulan.map((simpulan) =>
          simpulan.id === editId
            ? { ...simpulan, nama_kesimpulan: trimmedEditNamaKesimpulan }
            : simpulan
        )
      );
      setEditNama("");
      handleClose();
      showToast("Kesimpulan berhasil diedit!");
    } catch (e) {
      console.error("Error editing document: ", e);
    }
  };

  const confirmDelete = async () => {
    try {
      await hapusKesimpulan(deleteId);
      setKesimpulan(kesimpulan.filter((simpulan) => simpulan.id !== deleteId));
      handleClose();
      showToast(`Kesimpulan berhasil dihapus!`);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  useEffect(() => {
    const unsubscribe = ambilSemuaKesimpulan((data) => {
      setKesimpulan(data);
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
    <div className="kesimpulan">
      <div className="content">
        <div className="header">
          <span className="material-symbols-outlined">report_problem</span>
          <h1>Kesimpulan</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : kesimpulan.length === 0 ? (
          <p>Tidak ada kesimpulan</p>
        ) : (
          <TabelContentHelpdesk
            item="Kesimpulan"
            daftarData={kesimpulan}
            handleEditShow={handleEditShow}
            handleDeleteShow={handleDeleteShow}
          />
        )}
        <Button variant="primary" onClick={handleShow} className="add-button">
          Tambah Kesimpulan
        </Button>
      </div>

      <ModalCRUD
        item="Kesimpulan"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        title="Tambah Kesimpulan"
        buttonLabel="Simpan"
        nama={nama}
        setNama={setNama}
        error={error}
        setError={setError}
        inputRef={inputRef}
        type="tambah"
      />

      <ModalCRUD
        item="Kesimpulan"
        show={editShow}
        handleClose={handleClose}
        handleSubmit={handleEditSubmit}
        title="Edit Kesimpulan"
        buttonLabel="Simpan"
        nama={editNama}
        setNama={setEditNama}
        error={error}
        setError={setError}
        inputRef={inputRef}
        type="edit"
      />

      <ModalCRUD
        item="Kesimpulan"
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

export default Kesimpulan;
