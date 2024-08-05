/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { ambilSatuStudent } from "../database/studentManagementService";
import "./styles/ModalDetailHistory.css"; // Import custom CSS file for modal styling

const ModalDetailHistory = ({ show, handleClose, data }) => {
  const [userName, setUserName] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (data.user) {
      ambilSatuStudent(data.user).then((user) => {
        setUserName(user ? `${user.nama} (${user.npm})` : "Unknown");
      });
    }

    if (data.createdAt) {
      const date = new Date(data.createdAt.seconds * 1000);
      setFormattedDate(
        date.toLocaleDateString([], {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  }, [data]);

  const solutionsFound = data?.fullData?.solutionsFound || [];
  const partialSolutionsFound = data?.fullData?.partialSolutionsFound || [];

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      className="modal-detail-history"
    >
      <Modal.Header closeButton>
        <Modal.Title>Detail Riwayat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-header-info">
          <h5>Pengguna: {userName}</h5>
          <p>Waktu: {formattedDate}</p>
        </div>
        {(solutionsFound.length > 0 || partialSolutionsFound.length > 0) && (
          <div className="solution-section mt-5">
            {solutionsFound.map((solution, index) => (
              <div key={index} className="solution-item">
                <h3>Penyelesaian {index + 1}</h3>
                <hr />
                <div>
                  <h4>Fakta Permasalahan:</h4>
                  <ul>
                    {solution.facts.map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Kesimpulan:</h4>
                  <p>{solution.conclusion}</p>
                </div>
                <div>
                  <h4>Solusi:</h4>
                  <p>{solution.solution}</p>
                </div>
              </div>
            ))}

            {partialSolutionsFound.map((solution, index) => (
              <div key={index} className="solution-item">
                <h3>Penyelesaian {index + solutionsFound.length + 1}</h3>
                <hr />
                <div>
                  <h4>Fakta Permasalahan:</h4>
                  <ul>
                    {solution.factsUnmatched.map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Kemungkinan Kesimpulan:</h4>
                  <p>{solution.conclusion}</p>
                </div>
                <div>
                  <h4>Kemungkinan Solusi:</h4>
                  <p>{solution.solution}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetailHistory;
