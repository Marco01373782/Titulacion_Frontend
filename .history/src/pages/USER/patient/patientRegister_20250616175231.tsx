import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './patientRegister.css';
import { fetchGender, createPatient } from '../../../services/ApiService';
import { uploadImageToCloudinary } from '../../../utils/cloudinaryUpload';

const RegisterPatient = () => {
  const navigate = useNavigate();

  const [genders, setGenders] = useState<string[]>([]);
  const [form, setForm] = useState({
    firstname: '',
    secondname: '',
    surname: '',
    age: '',
    gender: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchGender()
      .then((res) => setGenders(res.data))
      .catch((err) => console.error('Error al cargar géneros:', err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return alert('Inicia sesión primero');

    if (!form.firstname || !form.surname || !form.age || !form.gender)
      return alert('Por favor completa todos los campos obligatorios');

    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const requestBody = {
        ...form,
        age: parseInt(form.age),
        userId: parseInt(userId),
        photoUrl: imageUrl,
      };

      const response = await createPatient(requestBody);
      console.log('Paciente creado:', response.data);
      navigate('/user/dashboard');
    } catch (error) {
      console.error('Error al registrar paciente:', error);
      alert('Error al registrar paciente');
    }
  };

  return (
    <div className="container-registerpatient">
      <h2 className="title-register">Registro del Paciente</h2>
      <p className="text-welcome">
        Completa la información para crear el perfil del paciente.
      </p>

      <form className="form-registerpatient" onSubmit={handleSubmit}>
        <div className="photo-section">
          <div className="photo-preview">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" />
            ) : (
              <div className="photo-placeholder">Foto del Paciente</div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="photo-input"
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Primer Nombre *</label>
            <input
              type="text"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Segundo Nombre</label>
            <input
              type="text"
              name="secondname"
              value={form.secondname}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Apellido *</label>
            <input
              type="text"
              name="surname"
              value={form.surname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Edad *</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Género *</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona</option>
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn-submit">
          Registrar Paciente
        </button>
      </form>
    </div>
  );
};

export default RegisterPatient;
