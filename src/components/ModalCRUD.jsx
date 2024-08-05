/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalCRUD = ({
  item,
  show,
  handleClose,
  handleSubmit,
  title,
  buttonLabel,
  nama,
  setNama,
  error,
  setError,
  inputRef,
  type,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {type !== "hapus" && type !== "aktivasi" && type !== "in-aktivasi" ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNamaFakta">
              <Form.Label>{`Nama ${item}`}</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Masukkan nama ${item}`}
                value={nama}
                ref={inputRef}
                onChange={(e) => setNama(e.target.value)}
                required
                style={{ color: "black" }}
              />
              {error && <p className="text-danger mt-2">{error}</p>}
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {buttonLabel}
            </Button>
          </Form>
        ) : (
          <p>{`Apakah kamu ingin ${
            type === "hapus"
              ? "menghapus"
              : type === "aktivasi"
              ? "mengaktifkan"
              : "menonaktifkan"
          } ${item} ini?`}</p>
        )}
      </Modal.Body>
      {(type === "hapus" || type === "aktivasi" || type === "in-aktivasi") && (
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button
            variant={
              type === "hapus"
                ? "danger"
                : type === "aktivasi"
                ? "success"
                : "warning"
            }
            onClick={handleSubmit}
          >
            {type === "hapus"
              ? "Hapus"
              : type === "aktivasi"
              ? "Aktifkan"
              : "Nonaktifkan"}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ModalCRUD;
