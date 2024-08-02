import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import LogoHeader from "../components/LogoHeader";
import PasswordField from "../components/PasswordField";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/Login.css";
import { Form } from "react-bootstrap";
import { db } from "../firebaseConfig"; // Pastikan Anda sudah mengimpor konfigurasi Firestore
import { collection, query, where, getDocs } from "firebase/firestore";

const LoginAdmin = () => {
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cookies, setCookie] = useCookies(["user"]);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const q = query(collection(db, "admin"), where("nidn", "==", npm));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Akun tidak tersedia.");
      } else {
        const doc = querySnapshot.docs[0];
        const data = doc.data();

        if (data.password !== password) {
          setError("Password salah.");
        } else if (data.status !== "aktif") {
          setError("Akun belum aktif.");
        } else {
          const userData = {
            uid: doc.id,
            email: `${npm}@admin.com`,
            role: "admin",
          };
          setCookie("user", userData, { path: "/" });
          navigate("/admin/dashboard");
        }
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="full-body">
      <div className="container">
        <LogoHeader role="Admin" />
        <div className="card p-5 shadow-sm" style={{ width: "100%" }}>
          <h2 className="card-title text-center mb-4">Login Admin</h2>
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <Form.Control
                type="text"
                className="form-control bg-transparent mt-3"
                placeholder="ID Admin / NIDN"
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-3">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
