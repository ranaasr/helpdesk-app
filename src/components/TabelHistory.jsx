/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Button, Tooltip, OverlayTrigger, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { ambilSatuStudent } from "../database/studentManagementService";
import "./styles/TabelHistory.css"; // Import custom CSS file

const TabelHistory = ({ daftarData, handleDeleteShow, handleDetailShow }) => {
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const fetchUserNames = async () => {
      const names = {};
      for (const data of daftarData) {
        if (!userNames[data.user]) {
          const user = await ambilSatuStudent(data.user);
          names[data.user] = user ? `${user.nama} (${user.npm})` : "Unknown";
        }
      }
      setUserNames((prevNames) => ({ ...prevNames, ...names }));
    };

    fetchUserNames();
  }, [daftarData]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const options = { hour: "2-digit", minute: "2-digit" };
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "long",
      year: "numeric",
      ...options,
    });
  };

  const formatConclusionsAndSolutions = (fullData) => {
    const fixConclusions = new Set();
    const partialConclusions = new Set();
    const fixSolutions = new Set();
    const partialSolutions = new Set();

    // Extract conclusions and solutions from solutionsFound
    fullData.solutionsFound.forEach((solution) => {
      fixConclusions.add(solution.conclusion);
      fixSolutions.add(solution.solution);
    });

    // Extract conclusions and solutions from partialSolutionsFound
    fullData.partialSolutionsFound.forEach((partialSolution) => {
      partialConclusions.add(partialSolution.conclusion);
      partialSolutions.add(partialSolution.solution);
    });

    return {
      fixConclusions: Array.from(fixConclusions),
      partialConclusions: Array.from(partialConclusions),
      fixSolutions: Array.from(fixSolutions),
      partialSolutions: Array.from(partialSolutions),
    };
  };

  const renderList = (items, label) => {
    return (
      <div className="list-container">
        <span className="list-label">{label}:</span>
        <ul className="list-items">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Table responsive className="table-modern">
      <thead className="thead-modern">
        <tr>
          <th className="no">No</th>
          <th className="user-history">User</th>
          <th className="kesimpulan-history">Kesimpulan</th>
          <th className="solusi-history">Solusi</th>
          <th className="waktu-history">Waktu Pencarian</th>
          <th className="aksi-history">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {daftarData.map((data, index) => {
          const {
            fixConclusions,
            partialConclusions,
            fixSolutions,
            partialSolutions,
          } = formatConclusionsAndSolutions(data.fullData);

          return (
            <tr key={data.id} className="align-middle">
              <td className="no">{index + 1}</td>
              <td className="user-history">
                {userNames[data.user] || "Loading..."}
              </td>
              <td className="kesimpulan-history">
                {fixConclusions.length > 0 &&
                  renderList(fixConclusions, "Kesimpulan")}
                {partialConclusions.length > 0 &&
                  renderList(partialConclusions, "Kemungkinan Kesimpulan")}
              </td>
              <td className="solusi-history">
                {fixSolutions.length > 0 && renderList(fixSolutions, "Solusi")}
                {partialSolutions.length > 0 &&
                  renderList(partialSolutions, "Kemungkinan Solusi")}
              </td>
              <td className="tanggal-history">{formatDate(data.createdAt)}</td>
              <td className="aksi-history">
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-top-detail`}>Lihat Detail</Tooltip>
                  }
                >
                  <Button
                    variant="info"
                    onClick={() => handleDetailShow(data)}
                    className="me-2 btn-modern"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top-delete`}>Hapus</Tooltip>}
                >
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteShow(data.id)}
                    className="me-2 btn-modern"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default TabelHistory;