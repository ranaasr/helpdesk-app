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
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/TabelAdminHelpdesk.css"; // Tambahkan custom styles di sini

const TabelAdminHelpdesk = ({
  item,
  daftarData,
  handleActivateShow,
  handleInactivateShow,
  handleEditShow,
  handleDeleteShow,
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

  const isActionDisabled = (createdAt) => {
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
          <th className="admin-name">{"Nama Lengkap"}</th>
          <th className="ID-mng">{`ID ${item} / NIDN`}</th>
          <th className="waktu-mng">Waktu Registrasi</th>
          <th className="aksi-mng">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {daftarData.map((data, index) => (
          <tr key={data.id} className="align-middle">
            <td className="no">{index + 1}</td>
            <td className="admin-name">
              {data.nama}
              {data.nidn === nidnAkun && (
                <Badge bg="info" className="ms-2 badge-modern">
                  <FontAwesomeIcon icon={faUser} /> Ini akunmu
                </Badge>
              )}
            </td>
            <td className="ID-mng">
              {item === "Admin" ? data.nidn : data.npm}
            </td>
            <td className="waktu-mng">{formatDate(data.createdAt)}</td>
            <td className="aksi-mng">
              {data.nidn === nidnAkun ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top-edit`}>Edit</Tooltip>}
                >
                  <Button
                    variant="warning"
                    onClick={() =>
                      handleEditShow(
                        data.id,
                        data.nidn,
                        data.nama,
                        data.password
                      )
                    }
                    className="me-2 btn-modern"
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </Button>
                </OverlayTrigger>
              ) : (
                <>
                  {data.status === "aktif" ? (
                    <>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-top-inactivate`}>
                            Nonaktifkan!
                          </Tooltip>
                        }
                      >
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleInactivateShow(data.id, data.nidn)
                          }
                          className="me-2 btn-modern"
                          disabled={isActionDisabled(data.createdAt)}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} />
                        </Button>
                      </OverlayTrigger>
                    </>
                  ) : (
                    <>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-top-activate`}>
                            Aktifkan!
                          </Tooltip>
                        }
                      >
                        <Button
                          variant="success"
                          onClick={() =>
                            handleActivateShow(
                              data.id,
                              data.password,
                              data.nidn
                            )
                          }
                          disabled={isActionDisabled(data.createdAt)}
                          className="me-2 btn-modern"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </Button>
                      </OverlayTrigger>
                    </>
                  )}
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-top-edit`}>Edit</Tooltip>}
                  >
                    <Button
                      variant="warning"
                      onClick={() =>
                        handleEditShow(
                          data.id,
                          data.nidn,
                          data.nama,
                          data.password
                        )
                      }
                      className="me-2 btn-modern"
                      disabled={isActionDisabled(data.createdAt)}
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
                      className="me-2 btn-modern"
                      disabled={isActionDisabled(data.createdAt)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  </OverlayTrigger>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TabelAdminHelpdesk;
