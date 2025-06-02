    import './patientRegister.css';
    import { useState } from 'react';

    const RegisterPatient = () => {
        const navigate us
    const [form, setForm] = useState({
        firstname: '',
        secondname: '',
        surname: '',
        age: '',
        gender_id: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Formulario enviado:', form);
        // Aquí va tu lógica con Axios o fetch
    };

    return (
        <div className="container-registerpatient">
            <p className='text-welcome'>Ayúdanos a conocer a tu paciente para brindarle un acompañamiento único y adaptado a sus necesidades</p>
            <form className="form-registerpatient" onSubmit={handleSubmit}>
                <h2 className="title-register">Registro del Paciente</h2>
                <div className="form-group">
            <label>Primer Nombre</label>
            <input
                type="text"
                name="firstname"
                placeholder='Primer Nombre'
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
                placeholder='Segundo Nombre'
                value={form.secondname}
                onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label>Apellido</label>
            <input
                type="text"
                name="surname"
                placeholder='Apellido'
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
                placeholder='Edad'
                value={form.age}
                onChange={handleChange}
                required
                min="0"
            />
            </div>

            <div className="form-group">
            <label>Género</label>
            <select
                name="gender_id"
                value={form.gender_id}
                onChange={handleChange}
                
                required
            >
                <option value="">Selecciona</option>
                <option value="1">Masculino</option>
                <option value="2">Femenino</option>
                <option value="3">Otro</option>
            </select>
            </div>

            <button type="submit" className="btn-submit">Registrar Paciente</button>
        </form>
        </div>
    );
    };

    export default RegisterPatient;
