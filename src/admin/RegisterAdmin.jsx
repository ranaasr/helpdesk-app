import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import PasswordField from "../components/PasswordField";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/Login.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { Form } from "react-bootstrap";

const RegisterAdmin = () => {
  const [nama, setNama] = useState("");
  const [nidn, setNidn] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adminExists, setAdminExists] = useState(false);
  const [nidnError, setNidnError] = useState("");
  const [nidnTaken, setNidnTaken] = useState(false);

  useEffect(() => {
    const checkAdminExists = async () => {
      const querySnapshot = await getDocs(collection(db, "admin"));
      setAdminExists(!querySnapshot.empty);
    };
    checkAdminExists();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const timestamp = new Date();

    if (nidnError || !nama || !nidn || !password) {
      setError("Please fix the errors before submitting.");
      return;
    }

    const checkNidnExists = async () => {
      const q = query(collection(db, "admin"), orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);
      const existingNidn = querySnapshot.docs.some(
        (doc) => doc.data().nidn === nidn
      );

      if (existingNidn) {
        setNidnTaken(true);
        setError("NIDN already exists.");
      } else {
        setNidnTaken(false);
        if (!adminExists) {
          try {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              `${nidn}@admin.com`,
              password
            );
            const user = userCredential.user;
            await addDoc(collection(db, "admin"), {
              uid: user.uid,
              nama: nama,
              password: password,
              status: "aktif",
              nidn: nidn,
              createdAt: timestamp,
              updatedAt: timestamp,
            });
            setSuccess(true);
            setError("");
          } catch (error) {
            console.error("Error registering user:", error);
            setError("Error registering user: " + error.message);
            setSuccess(false);
          }
        } else {
          try {
            await addDoc(collection(db, "admin"), {
              nama: nama.trim(),
              password: password,
              status: "nonaktif",
              nidn: nidn.trim(),
              createdAt: timestamp,
              updatedAt: timestamp,
            });
            setSuccess(true);
            setError("");
          } catch (error) {
            console.error("Error saving user data to Firestore:", error);
            setError("Error saving user data: " + error.message);
            setSuccess(false);
          }
        }
      }
    };

    await checkNidnExists();
  };

  const handleNidnChange = (e) => {
    const value = e.target.value;
    setNidn(value);
    const numberRegex = /^[0-9]*$/;
    if (!numberRegex.test(value)) {
      setNidnError("NIDN should only contain numbers.");
    } else {
      setNidnError("");
    }
  };

  return (
    <div className="full-body">
      <div className="container">
        <LogoHeader role="Admin" />
        <div className="card p-5 shadow-sm" style={{ width: "100%" }}>
          <h2 className="card-title text-center mb-4">Daftar Admin</h2>
          {success && (
            <div className="alert alert-success" role="alert">
              Registration successful. Please contact the operator to activate
              your account and you can{" "}
              <Link to="/admin/login" className="alert-link">
                login
              </Link>
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
              <div className="invalid-feedback">Harap isi bidang ini.</div>
            </div>
            <div className="form-group">
              <Form.Control
                type="text"
                className="form-control bg-transparent"
                placeholder="ID Admin / NIDN"
                value={nidn}
                onChange={handleNidnChange}
                required
              />
              <div className="invalid-feedback">
                {nidnError || (nidnTaken && "NIDN sudah ada.")}
              </div>
            </div>
            <div className="form-group">
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="invalid-feedback">Harap isi bidang ini.</div>
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-3">
              Daftar
            </button>
          </form>
          <p className="mt-3 text-center">
            Sudah punya akun? <Link to="/admin/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdmin;
