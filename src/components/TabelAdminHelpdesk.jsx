/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";

const TabelAdminHelpdesk = ({
  item,
  daftarData,
  handleEditShow,
  handleDeleteShow,
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

  const isDeleteDisabled = (createdAt) => {
    return (
      createdAtAkun &&
      new Date(createdAt.seconds * 1000) <
        new Date(createdAtAkun.seconds * 1000)
    );
  };

  return (
    <table className="table">
      <thead>
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
          <tr key={data.id}>
            <td className="no">{index + 1}</td>
            <td className="name">{data.nama}</td>
            <td className="ID">{data.nidn}</td>
            <td className="tanggal">{formatDate(data.createdAt)}</td>
            <td className="aksi">
              {data.nidn === nidnAkun ? (
                <strong>*Ini akunmu</strong>
              ) : data.status === "aktif" ? (
                <>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-top-delete`}>Delete</Tooltip>
                    }
                  >
                    <span className="d-inline-block">
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteShow(data.id)}
                        className="me-2"
                        disabled={isDeleteDisabled(data.createdAt)}
                        style={
                          isDeleteDisabled(data.createdAt)
                            ? { pointerEvents: "none" }
                            : {}
                        }
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </Button>
                    </span>
                  </OverlayTrigger>
                </>
              ) : (
                <>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-top-activate`}>Activate</Tooltip>
                    }
                  >
                    <Button
                      variant="success"
                      onClick={() =>
                        handleActivateShow(data.id, data.password, data.nidn)
                      }
                      disabled={isDeleteDisabled(data.createdAt)}
                        style={
                          isDeleteDisabled(data.createdAt)
                            ? { pointerEvents: "none" }
                            : {}
                        }
                      className="me-2"
                    >
                      <span className="material-symbols-outlined">
                        check_circle
                      </span>
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-top-delete`}>Delete</Tooltip>
                    }
                  >
                    <span className="d-inline-block">
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteShow(data.id)}
                        disabled={isDeleteDisabled(data.createdAt)}
                        style={
                          isDeleteDisabled(data.createdAt)
                            ? { pointerEvents: "none" }
                            : {}
                        }
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </Button>
                    </span>
                  </OverlayTrigger>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TabelAdminHelpdesk;
