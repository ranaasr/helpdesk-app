/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  tambahSolusi,
  editSolusi,
  hapusSolusi,
  ambilSemuaSolusi,
} from "../database/solusiService";
import { Button } from "react-bootstrap";
import ToastHelpdesk from "../components/ToastHelpdesk";
import TabelContentHelpdesk from "../components/TabelContentHelpdesk";
import "./styles/Content.css";
import ModalCRUD from "../components/ModalCRUD";

const Solusi = () => {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [nama, setNama] = useState("");
  const [editNama, setEditNama] = useState("");
  const [solusi, setSolusi] = useState([]);
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
    const trimmedNamaSolusi = nama.trim();
    if (!trimmedNamaSolusi) {
      setError("Nama solusi tidak boleh hanya berisi spasi!");
      return;
    }
    try {
      const newId = await tambahSolusi(trimmedNamaSolusi);
      setSolusi([...solusi, { id: newId, nama_solusi: trimmedNamaSolusi }]);
      setNama("");
      handleClose();
      showToast("Solusi berhasil ditambahkan!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const trimmedEditNamaSolusi = editNama.trim();
    if (!trimmedEditNamaSolusi) {
      setError("Nama solusi tidak boleh hanya berisi spasi!");
      return;
    }
    try {
      await editSolusi(editId, trimmedEditNamaSolusi);
      setSolusi(
        solusi.map((solusiSatu) =>
          solusiSatu.id === editId
            ? { ...solusiSatu, nama_solusi: trimmedEditNamaSolusi }
            : solusiSatu
        )
      );
      setEditNama("");
      handleClose();
      showToast("Solusi berhasil diedit!");
    } catch (e) {
      console.error("Error editing document: ", e);
    }
  };

  const confirmDelete = async () => {
    try {
      await hapusSolusi(deleteId);
      setSolusi(solusi.filter((solusiSatu) => solusiSatu.id !== deleteId));
      handleClose();
      showToast("Solusi berhasil dihapus!");
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  useEffect(() => {
    const unsubscribe = ambilSemuaSolusi((data) => {
      setSolusi(data);
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
    <div className="solusii">
      <div className="content">
        <div className="header">
          <span className="material-symbols-outlined">report_problem</span>
          <h1>Solusi</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : solusi.length === 0 ? (
          <p>Tidak ada solusi</p>
        ) : (
          <TabelContentHelpdesk
            item="Solusi"
            daftarData={solusi}
            handleEditShow={handleEditShow}
            handleDeleteShow={handleDeleteShow}
          />
        )}
        <Button variant="primary" onClick={handleShow} className="add-button">
          Tambah Solusi
        </Button>
      </div>

      <ModalCRUD
        item="Solusi"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        title="Tambah Solusi"
        buttonLabel="Simpan"
        nama={nama}
        setNama={setNama}
        error={error}
        setError={setError}
        inputRef={inputRef}
        type="tambah"
      />

      <ModalCRUD
        item="Solusi"
        show={editShow}
        handleClose={handleClose}
        handleSubmit={handleEditSubmit}
        title="Edit Solusi"
        buttonLabel="Simpan"
        nama={editNama}
        setNama={setEditNama}
        error={error}
        setError={setError}
        inputRef={inputRef}
        type="edit"
      />

      <ModalCRUD
        item="Solusi"
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

export default Solusi;
