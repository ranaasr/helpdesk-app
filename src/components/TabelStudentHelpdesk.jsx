/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Table, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/TabelStudentHelpdesk.css"; // Tambahkan custom styles di sini

const TabelStudentHelpdesk = ({
  item,
  daftarData,
  handleEditShow,
  handleDeleteShow,
  nidnAkun,
}) => {
  const [visiblePasswords, setVisiblePasswords] = useState({});

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

  const getCreatedAtAkun = () => {
    const akun = daftarData.find((data) => data.nidn === nidnAkun);
    return akun ? akun.createdAt : null;
  };

  const createdAtAkun = getCreatedAtAkun();

  const isActivateDisabled = (createdAt) => {
    return (
      createdAtAkun &&
      new Date(createdAt.seconds * 1000) <
        new Date(createdAtAkun.seconds * 1000)
    );
  };

  const togglePasswordVisibility = (index) => {
    setVisiblePasswords((prevVisiblePasswords) => ({
      ...prevVisiblePasswords,
      [index]: !prevVisiblePasswords[index],
    }));
  };

  return (
    <Table responsive className="table-modern">
      <thead className="thead-modern">
        <tr>
          <th className="no">No</th>
          <th className="admin-name">{"Nama Lengkap"}</th>
          <th className="ID">{`ID ${item} / NPM`}</th>
          <th className="waktu">Waktu Registrasi</th>
          <th className="password">Kata Sandi</th>
          <th className="aksi">Aksi</th> {/* Tambahkan kolom aksi */}
        </tr>
      </thead>
      <tbody>
        {daftarData.map((data, index) => (
          <tr key={data.id} className="align-middle">
            <td className="no">{index + 1}</td>
            <td className="name">{data.nama}</td>
            <td className="ID">{item === "Admin" ? data.nidn : data.npm}</td>
            <td className="tanggal">{formatDate(data.createdAt)}</td>
            <td className="password">
              <div className="password-container">
                <span className="password-text">
                  {visiblePasswords[index] ? data.password : "********"}
                </span>
                <button
                  className="btn-show-password"
                  onClick={() => togglePasswordVisibility(index)}
                >
                  <FontAwesomeIcon
                    icon={visiblePasswords[index] ? faEyeSlash : faEye}
                  />
                </button>
              </div>
            </td>
            <td className="aksi">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top-edit`}>Edit</Tooltip>}
              >
                <Button
                  variant="warning"
                  onClick={() =>
                    handleEditShow(data.id, data.npm, data.nama, data.password)
                  }
                  className="me-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top-delete`}>Hapus</Tooltip>}
              >
                <Button
                  variant="danger"
                  onClick={() => handleDeleteShow(data.id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </OverlayTrigger>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TabelStudentHelpdesk;
