import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import PasswordField from "../components/PasswordField";
import "bootstrap/dist/css/bootstrap.min.css";
import "../admin/styles/Login.css";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Form } from "react-bootstrap";

const RegisterMahasiswa = () => {
  const [nama, setNama] = useState("");
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check if NIM is numeric
    const numericRegex = /^[0-9]+$/;
    if (!numericRegex.test(npm)) {
      setError("ID Student / NIM harus berupa angka.");
      return;
    }

    const timestamp = new Date();

    try {
      // Check if NIM is already registered
      const userQuery = query(collection(db, "users"), where("npm", "==", npm));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        setError("ID Student / NIM sudah terdaftar.");
        return;
      }

      // Save user data to Firestore
      await addDoc(collection(db, "users"), {
        nama: nama,
        npm: npm,
        password: password,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      setSuccess("Pendaftaran berhasil.");
    } catch (error) {
      console.error("Error saving user data to Firestore:", error);
      setError(error.message);
    }
  };

  return (
    <div className="full-body">
      <div className="container">
        <LogoHeader role="Student" />
        <div className="card p-5 shadow-sm" style={{ width: "100%" }}>
          <h2 className="card-title text-center mb-4">Daftar</h2>
          {success && (
            <div className="alert alert-success" role="alert">
              {success} Mohon{" "}
              <Link to="/login" className="alert-link">
                login
              </Link>{" "}
              untuk melanjutkan
            </div>
          )}
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <Form.Control
                type="text"
                className="form-control bg-transparent mt-3"
                placeholder="Nama Lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
              <div className="invalid-feedback">Nama Lengkap dibutuhkan.</div>
            </div>
            <div className="form-group">
              <Form.Control
                type="text"
                className="form-control bg-transparent"
                placeholder="ID Student / NIM"
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
                required
              />
              <div className="invalid-feedback">
                ID Student / NIM dibutuhkan.
              </div>
            </div>
            <div className="form-group">
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="invalid-feedback">Kata sandi dibutuhkan.</div>
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-3">
              Daftar
            </button>
          </form>
          <p className="mt-3 text-center">
            Sudah punya akun? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterMahasiswa;
