import React, { useState } from "react";
import "./register.css";
import { registerUser, loginUser } from "../../services/ApiService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    repeatPassword: "",
    parentesco: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { repeatPassword, ...userData } = formData;

    if (formData.password !== formData.repeatPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await registerUser(userData);
      await loginUser({ email: userData.email, password: userData.password });
      navigate("/app/inicio");
    } catch (error) {
      alert("Hubo un error al registrar");
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Crear cuenta</h2>
          <div className="register-row">
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
            </div>
          </div>

          <div className="register-row">
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Repetir contraseña</label>
              <input type="password" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Parentesco</label>
            <input type="text" name="parentesco" value={formData.parentesco} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-submit">Registrarse</button>
        </form>
      </div>
      <div className="register-right">
        <h2>Bienvenido a nuestra app</h2>
        <p>Estimulación cognitiva para todas las edades</p>
      </div>
    </div>
  );
};

export default Register;
