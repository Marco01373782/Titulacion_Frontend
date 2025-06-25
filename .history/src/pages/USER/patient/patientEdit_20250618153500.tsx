    import React, { useEffect, useState } from 'react';
    import {
    Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl,
    FormHelperText, Avatar, Alert, useTheme, useMediaQuery,
    } from '@mui/material';
    import { useNavigate } from 'react-router-dom';
    import { SelectChangeEvent } from '@mui/material/Select';
    import { fetchGender, getFullPatientByUserId, updatePatient } from '../../../services/ApiService';
    import { uploadImageToCloudinary } from '../../../data/cloudinaryUpload';

    interface Patient {
    id: number;
    firstname: string;
    secondname?: string;
    surname: string;
    age: number;
    gender: string;
    photoUrl?: string;
    userId: number;
    }

    const PatientEdit = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const [genders, setGenders] = useState<string[]>([]);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [form, setForm] = useState({
        firstname: '',
        secondname: '',
        surname: '',
        age: '',
        gender: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchGender()
        .then(res => setGenders(res.data))
        .catch(err => console.error('Error cargando géneros:', err));

        const userId = localStorage.getItem('userId');
        if (!userId) {
        alert('Inicia sesión primero');
        navigate('/login');
        return;
        }

        getFullPatientByUserId(parseInt(userId))
        .then(res => {
            const p = res.data as Patient;
            console.log('Paciente recibido:', res.data);
            setPatient(p);
            setForm({
            firstname: p.firstname,
            secondname: p.secondname || '',
            surname: p.surname,
            age: p.age.toString(),
            gender: p.gender,
            });
            setImagePreview(p.photoUrl || null);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error cargando paciente:', err);
            alert('Error al cargar los datos del paciente');
            setLoading(false);
        });
    }, [navigate]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: '' }));
        setSubmitError('');
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: '' }));
        setSubmitError('');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setFormErrors(prev => ({ ...prev, imageFile: '' }));
        setSubmitError('');
        }
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        if (!form.firstname.trim()) errors.firstname = 'Primer nombre es obligatorio';
        if (!form.surname.trim()) errors.surname = 'Apellido es obligatorio';
        if (!form.age.trim()) errors.age = 'Edad es obligatoria';
        else if (isNaN(Number(form.age)) || Number(form.age) <= 0) errors.age = 'Edad debe ser un número positivo';
        if (!form.gender.trim()) errors.gender = 'Género es obligatorio';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');
        if (!validateForm()) {
        setSubmitError('Por favor completa todos los campos obligatorios.');
        return;
        }
        if (!patient) {
        alert('No se encontró paciente para actualizar');
        return;
        }
        setSaving(true);

        try {
        let imageUrl = patient.photoUrl || '';
        if (imageFile) {
            imageUrl = await uploadImageToCloudinary(imageFile);
        }

        const updatedData = {
            ...form,
            age: Number(form.age),
            photoUrl: imageUrl,
            userId: patient.userId,
        };

        await updatePatient(patient.id, updatedData);
        navigate('/user/patient-view');
        } catch (error) {
        console.error('Error al actualizar paciente:', error);
        setSubmitError('Error al actualizar paciente.');
        } finally {
        setSaving(false);
        }
    };

    if (loading) {
        return (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
            <Typography>Cargando datos...</Typography>
        </Box>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
        p: 3,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 3,
        }} noValidate>
        <Typography variant="h4" mb={3} textAlign="center" color="primary">
            Editar Paciente
        </Typography>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
            <input
            accept="image/*"
            id="upload-photo"
            type="file"
            style={{ display: 'none' }}
            onChange={handleImageChange}
            />
            <label htmlFor="upload-photo" style={{ cursor: 'pointer' }}>
            <Avatar
                src={imagePreview || ''}
                sx={{
                width: isMobile ? 140 : 180,
                height: isMobile ? 140 : 180,
                mx: 'auto',
                bgcolor: theme.palette.grey[300],
                mb: 1,
                }}
            >
                {!imagePreview && 'Subir Foto'}
            </Avatar>
            </label>
            {formErrors.imageFile && (
            <FormHelperText error>{formErrors.imageFile}</FormHelperText>
            )}
        </Box>

        <TextField
            label="Primer Nombre *"
            name="firstname"
            fullWidth
            value={form.firstname}
            onChange={handleChange}
            error={!!formErrors.firstname}
            helperText={formErrors.firstname}
            sx={{ mb: 2 }}
        />

        <TextField
            label="Segundo Nombre"
            name="secondname"
            fullWidth
            value={form.secondname}
            onChange={handleChange}
            sx={{ mb: 2 }}
        />

        <TextField
            label="Apellido *"
            name="surname"
            fullWidth
            value={form.surname}
            onChange={handleChange}
            error={!!formErrors.surname}
            helperText={formErrors.surname}
            sx={{ mb: 2 }}
        />

        <TextField
            label="Edad *"
            name="age"
            type="number"
            inputProps={{ min: 1 }}
            fullWidth
            value={form.age}
            onChange={handleChange}
            error={!!formErrors.age}
            helperText={formErrors.age}
            sx={{ mb: 2 }}
        />

        <FormControl fullWidth error={!!formErrors.gender} sx={{ mb: 3 }} required>
            <InputLabel id="gender-label">Género *</InputLabel>
            <Select
            labelId="gender-label"
            label="Género *"
            name="gender"
            value={form.gender}
            onChange={handleSelectChange}
            >
            <MenuItem value="">
                <em>Selecciona</em>
            </MenuItem>
            {genders.map((g) => (
                <MenuItem key={g} value={g}>
                {g.charAt(0) + g.slice(1).toLowerCase()}
                </MenuItem>
            ))}
            </Select>
            {formErrors.gender && (
            <FormHelperText>{formErrors.gender}</FormHelperText>
            )}
        </FormControl>

        {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
            </Alert>
        )}

        <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={saving}
            size="large"
        >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        </Box>
    );
    };

    export default PatientEdit;
