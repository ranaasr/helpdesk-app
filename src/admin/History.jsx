import React, { useState, useEffect } from "react";
import { ambilSemuaHistory, hapusHistory } from "../database/historyService";
import ToastHelpdesk from "../components/ToastHelpdesk";
import TabelHistory from "../components/TabelHistory";
import "./styles/Content.css";
import ModalCRUD from "../components/ModalCRUD";
import CekKesimpulanSolusi from "../components/CekKesimpulanSolusi";
import ModalDetailHistory from "../components/ModalDetailHistory";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [detailHistoryData, setDetailHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteShow, setDeleteShow] = useState(false);
  const [detailShow, setDetailShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastShow(true);
  };

  const handleClose = () => {
    setDeleteShow(false);
    setDetailShow(false);
  };

  const handleDeleteShow = (id) => {
    setDeleteId(id);
    setDeleteShow(true);
  };

  const handleDetailShow = (data) => {
    setDetailHistoryData(data);
    setDetailShow(true);
    console.log(data);
  };

  const confirmDelete = async () => {
    try {
      await hapusHistory(deleteId);
      handleClose();
      showToast("Riwayat berhasil dihapus!");
      setHistoryData(historyData.filter((item) => item.id !== deleteId));
    } catch (e) {
      console.error("Error deleting history: ", e);
      showToast("Terjadi kesalahan saat menghapus riwayat.");
    }
  };

  useEffect(() => {
    const fetchHistoryData = async () => {
      const unsubscribe = ambilSemuaHistory(async (data) => {
        const updatedData = await Promise.all(
          data.map(async (item) => {
            const [solutionsFound, partialSolutionsFound] =
              await CekKesimpulanSolusi(item.fakta);
            return {
              ...item,
              fullData: { solutionsFound, partialSolutionsFound },
            };
          })
        );
        setHistoryData(updatedData);
        setLoading(false);
      });
      return () => unsubscribe();
    };

    fetchHistoryData();
  }, []);

  return (
    <div className="history-management">
      <div className="content">
        <div className="header">
          <span className="material-symbols-outlined">history</span>
          <h1>Manajemen Riwayat</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : historyData.length === 0 ? (
          <p>Tidak ada riwayat</p>
        ) : (
          <TabelHistory
            daftarData={historyData}
            handleDeleteShow={handleDeleteShow}
            handleDetailShow={handleDetailShow}
          />
        )}
      </div>

      <ModalDetailHistory
        show={detailShow}
        handleClose={handleClose}
        data={detailHistoryData}
      />

      <ModalCRUD
        item="History"
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

export default History;
