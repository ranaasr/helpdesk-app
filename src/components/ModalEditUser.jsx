/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ModalEditUser = ({
  type,
  show,
  handleClose,
  handleSubmit,
  nidn,
  namaLengkap,
  setNamaLengkap,
  password,
  setPassword,
  includePassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const namaInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    if (show) {
      namaInputRef.current.focus();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{`Edit ${type}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNIDN">
            <Form.Label>{`ID ${type} / ${
              type === "Admin" ? "NIDN" : "NIM"
            }`}</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type="text"
                value={nidn}
                readOnly
                style={{ color: "black", flex: 1 }}
              />
              <FontAwesomeIcon icon={faLock} style={{ marginLeft: "10px" }} />
            </div>
          </Form.Group>
          <Form.Group controlId="formNamaLengkap">
            <Form.Label>Nama Lengkap</Form.Label>
            <Form.Control
              type="text"
              placeholder="Masukkan nama lengkap"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              ref={namaInputRef}
              required
              style={{ color: "black" }}
            />
          </Form.Group>
          {includePassword && (
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  ref={passwordInputRef}
                  required
                  style={{ color: "black" }}
                />
                <Button
                  variant="link"
                  className="position-absolute end-0 top-50 translate-middle-y"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </Button>
              </div>
            </Form.Group>
          )}
          <Button variant="primary" type="submit" className="mt-3">
            Simpan
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalEditUser;
