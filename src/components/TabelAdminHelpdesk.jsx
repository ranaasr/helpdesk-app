/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Button, Tooltip, OverlayTrigger, Badge, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faUser,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/TabelAdminHelpdesk.css"; // Tambahkan custom styles di sini

const TabelAdminHelpdesk = ({
  item,
  daftarData,
  handleActivateShow,
  nidnAkun,
}) => {
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

  return (
    <Table responsive className="table-modern">
      <thead className="thead-modern">
        <tr>
          <th className="no">No</th>
          <th className="admin-name">{`Username ${item}`}</th>
          <th className="ID">{`ID ${item}`}</th>
          <th className="waktu">Waktu Registrasi</th>
          <th className="aksi">Action</th>
        </tr>
      </thead>
      <tbody>
        {daftarData.map((data, index) => (
          <tr key={data.id} className="align-middle">
            <td className="no">{index + 1}</td>
            <td className="name">
              {data.nama}
              {data.nidn === nidnAkun && (
                <Badge bg="info" className="ms-2 badge-modern">
                  <FontAwesomeIcon icon={faUser} /> Ini akunmu
                </Badge>
              )}
            </td>
            <td className="ID">{item == "Admin" ? data.nidn : data.npm}</td>
            <td className="tanggal">{formatDate(data.createdAt)}</td>
            <td className="aksi">
              {data.status === "aktif" ? (
                <Badge bg="dark" className="badge-modern p-2">
                  <FontAwesomeIcon icon={faCheckCircle} /> Akun Aktif
                </Badge>
              ) : (
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-top-activate`}>Aktifkan!</Tooltip>
                  }
                >
                  <Button
                    variant="success"
                    onClick={() =>
                      handleActivateShow(data.id, data.password, data.nidn)
                    }
                    disabled={isActivateDisabled(data.createdAt)}
                    className="me-2 btn-modern"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} /> Aktifkan!
                  </Button>
                </OverlayTrigger>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TabelAdminHelpdesk;
