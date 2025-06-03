    import { useEffect, useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import './patientRegister.css';
    import ApiService from '../../../services/ApiService'; // ajusta la ruta si es diferente

    const RegisterPatient = () => {
        const navigate = useNavigate();

        const [genders, setGenders] = useState<string[]>([]);
        const [form, setForm] = useState({
            firstname: '',
            secondname: '',
            surname: '',
            age: '',
            gender: '', // nota: ya no es gender_id sino gender
        });

        useEffect(() => {
            ApiService.get('/enums/gender')
                .then((res) => setGenders(res.data))
                .catch((err) => console.error('Error al cargar géneros:', err));
        }, []);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setForm({ ...form, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            try {
                // OBTIENE ID DEL USUARIO LOGUEADO desde localStorage, JWT o como lo tengas
                const userId = localStorage.getItem('userId'); // o usa un hook si tienes auth context
                if (!userId) throw new Error('Usuario no autenticado');

                const requestBody = {
                    ...form,
                    age: parseInt(form.age),
                    gender: form.gender, // enum como string
                    user_id: parseInt(userId), // backend lo relacionará
                };

                const response = await ApiService.post('/patients', requestBody);
                console.log('Paciente creado:', response.data);
                navigate('/user/dashboard');
            } catch (error) {
                console.error('Error al registrar paciente:', error);
            }
        };

        return (
            <div className="container-registerpatient">
                <p className='text-welcome'>
                    Ayúdanos a conocer a tu paciente para brindarle un acompañamiento único y adaptado a sus necesidades
                </p>
                <form className="form-registerpatient" onSubmit={handleSubmit}>
                    <h2 className="title-register">Registro del Paciente</h2>

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
                                    {g.charAt(0) + g.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn-submit">Registrar Paciente</button>
                </form>
            </div>
        );
    };

    export default RegisterPatient;
