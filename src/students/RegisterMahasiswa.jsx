import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import PasswordField from "../components/PasswordField";
import "bootstrap/dist/css/bootstrap.min.css";
import "../admin/styles/Login.css";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { Form } from "react-bootstrap";

const RegisterMahasiswa = () => {
  const [nama, setNama] = useState("");
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    const timestamp = new Date();
    createUserWithEmailAndPassword(auth, `${npm}@mhs.com`, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Simpan data pengguna ke Firestore
        addDoc(collection(db, "users"), {
          uid: user.uid,
          nama: nama,
          npm: npm,
          password: password,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
          .then(() => {
            console.log("User registered:", user);
            setSuccess(true);
          })
          .catch((error) => {
            console.error("Error saving user data to Firestore:", error);
            setError(error.message);
          });
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="full-body">
      <div className="container">
        <LogoHeader role="Student" />
        <div className="card p-5 shadow-sm" style={{ width: "100%" }}>
          <h2 className="card-title text-center mb-4">Register</h2>
          {success && (
            <div className="alert alert-success" role="alert">
              Registration successful. Please{" "}
              <Link to="/login" className="alert-link">
                login
              </Link>{" "}
              to continue
            </div>
          )}
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <Form.Control
                type="text"
                className="form-control bg-transparent mt-3"
                placeholder="Full Name"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
              <div className="invalid-feedback">Full Name is required.</div>
            </div>
            <div className="form-group">
              <Form.Control
                type="text"
                className="form-control bg-transparent"
                placeholder="ID Student or NPM"
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
                required
              />
              <div className="invalid-feedback">
                ID Student or NPM is required.
              </div>
            </div>
            <div className="form-group">
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="invalid-feedback">Password is required.</div>
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-3">
              Register
            </button>
          </form>
          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterMahasiswa;
