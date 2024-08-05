import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import LogoHeader from "../components/LogoHeader";
import PasswordField from "../components/PasswordField";
import "bootstrap/dist/css/bootstrap.min.css";
import "../admin/styles/Login.css";
import ModalWarning from "../components/ModalWarning";
import { Form } from "react-bootstrap";
import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

const LoginMahasiswa = () => {
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cookies, setCookie] = useCookies(["user"]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Query Firestore to find the user
      const userQuery = query(
        collection(db, "users"),
        where("npm", "==", npm)
      );
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        setError("Akun tidak tersedia.");
        return;
      }

      // Assuming only one document per NPM
      const userDoc = querySnapshot.docs[0].data();
      if (userDoc.password !== password) {
        setError("Kata sandi salah.");
        return;
      }

      // User authenticated successfully
      console.log("User logged in:", userDoc);
      const userData = {
        uid: querySnapshot.docs[0].id,
        email: `${npm}@mhs.com`,
        role: "user",
      };
      setCookie("user", userData, { path: "/" });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleShowModal = () => setShowModal(true); // Function to show modal
  const handleCloseModal = () => setShowModal(false); // Function to close modal

  return (
    <div className="full-body">
      <div className="container">
        <LogoHeader role="Student" />
        <div className="card p-5 shadow-sm" style={{ width: "100%" }}>
          <h2 className="card-title text-center mb-4">Login</h2>
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <Form.Control
                type="text"
                className="form-control bg-transparent mt-3"
                placeholder="ID Student or NIM"
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p>
                <a href="#" onClick={handleShowModal}>
                  Lupa Kata Sandi?
                </a>
              </p>
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-3">
              Login
            </button>
          </form>
          <p className="mt-3 text-center">
            Belum punya akun? <Link to="/register">Daftar</Link>
          </p>
        </div>
      </div>

      <ModalWarning
        show={showModal}
        handleClose={handleCloseModal}
        title="Lupa Kata Sandi"
        message="Silakan hubungi operator kampus untuk mengatur ulang kata sandi Anda."
      />
    </div>
  );
};

export default LoginMahasiswa;
