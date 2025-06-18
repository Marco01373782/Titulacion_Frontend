import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './patientRegister.css';
import {
  fetchGender,
  createPatient
} from '../../../services/ApiService';
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
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Inicia sesión primero');
      return;
    }

    if (!form.firstname || !form.surname || !form.age || !form.gender) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const requestBody: any = {
        firstname: form.firstname,
        secondname: form.secondname,
        surname: form.surname,
        age: parseInt(form.age),
        gender: form.gender,
        userId: parseInt(userId),
        photoUrl: imageUrl,
      };

      const response = await createPatient(requestBody);
      console.log('Paciente creado:', response.data);
      navigate('/user/dashboard');
    } catch (error: any) {
      console.error('Error al registrar paciente:', error);
      alert('Hubo un error al registrar el paciente. Revisa la consola para más detalles.');
    }
  };

  return (
    <div className="container-registerpatient">
      <p className="text-welcome">
        Ayúdanos a conocer a tu paciente para brindarle un acompañamiento único y adaptado a sus necesidades
      </p>
      <form className="form-registerpatient" onSubmit={handleSubmit}>
        <h2 className="title-register">Registro del Paciente</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Primer Nombre</label>
            <input
              type="text"
              name="firstname"
              placeholder="Primer Nombre"
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
              placeholder="Segundo Nombre"
              value={form.secondname}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="surname"
              placeholder="Apellido"
              value={form.surname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Edad</label>
            <input
              type="number"
              name="age"
              placeholder="Edad"
              value={form.age}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Género</label>
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

          <div className="form-group">
            <label>Foto del Paciente</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <button type="submit" className="btn-submit">Registrar Paciente</button>
      </form>
    </div>
  );
};

export default RegisterPatient;
