/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Form, Button} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const PasswordField = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form.Group controlId="formPassword">
      <div className="input-group">
        <Form.Control
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={value}
          onChange={onChange}
          className="bg-transparent"
          required
        />
        <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
          <span className="material-symbols-outlined">
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        </Button>
      </div>
    </Form.Group>
  );
};

export default PasswordField;
