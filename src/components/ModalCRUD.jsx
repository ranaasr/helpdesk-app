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
        {type !== "delete" && type !== "activate" ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNamaFakta">
              <Form.Label>{`Name of ${item}`}</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Enter the name of ${item}`}
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
          <p>{`Are you sure you want to ${type} this ${item}?`}</p>
        )}
      </Modal.Body>
      {(type === "delete" || type === "activate") && (
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant={type === "delete" ? "danger" : "success"}
            onClick={handleSubmit}
          >
            {type === "delete" ? "Delete" : "Activate"}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ModalCRUD;
