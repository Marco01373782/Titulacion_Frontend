    import { useEffect, useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import {
    Box, Typography, TextField, Button, FormControl, InputLabel,
    Select, MenuItem, CircularProgress, Paper, Avatar, useTheme, useMediaQuery, Alert
    } from '@mui/material';
    import { getPacientePorUsuario, fetchGender, updatePatient } from '../../../services/ApiService';
    import { uploadImageToCloudinary } from '../../../data/cloudinaryUpload';

    interface Patient {
    id: number;
    firstname: string;
    secondname?: string;
    surname: string;
    age: number;
    gender: string;
    photoUrl?: string;
    }

    const PatientEdit = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const [patient, setPatient] = useState<Patient | null>(null);
    const [genders, setGenders] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
        alert('Inicia sesión primero');
        navigate('/login');
        return;
        }

        Promise.all([
        getPacientePorUsuario(userId),
        fetchGender()
        ]).then(([patientRes, genderRes]) => {
        setPatient(patientRes.data);
        setImagePreview(patientRes.data.photoUrl || null);
        setGenders(genderRes.data);
        setLoading(false);
        }).catch(err => {
        console.error(err);
        setLoading(false);
        });
    }, [navigate]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setPatient(prev => prev ? { ...prev, [name]: value } : prev);
        setSubmitError('');
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
        if (!patient) return;

        if (!patient.firstname || !patient.surname || !patient.age || !patient.gender) {
        setSubmitError('Por favor completa todos los campos obligatorios.');
        return;
        }

        let imageUrl = patient.photoUrl || '';
        if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
        }

        try {
        await updatePatient(patient.id, {
            ...patient,
            photoUrl: imageUrl,
            age: parseInt(String(patient.age))
        });
        navigate('/user/patient-view');
        } catch (err) {
        console.error(err);
        alert('Error al actualizar el paciente');
        }
    };

    if (loading) {
        return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center"><CircularProgress /></Box>;
    }

    if (!patient) {
        return <Typography>No se encontró paciente</Typography>;
    }

    return (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" p={2}>
        <Paper elevation={4} sx={{ p: 4, maxWidth: 600, width: '100%', borderRadius: 3 }}>
            <Typography variant="h4" color="primary" mb={2} textAlign="center">
            Editar Paciente
            </Typography>

            <form onSubmit={handleSubmit}>
            <Box textAlign="center" mb={3}>
                <input type="file" accept="image/*" id="upload-photo" style={{ display: 'none' }} onChange={handleImageChange} />
                <label htmlFor="upload-photo" style={{ cursor: 'pointer' }}>
                <Avatar
                    src={imagePreview || ''}
                    sx={{ width: isMobile ? 150 : 200, height: isMobile ? 150 : 200, bgcolor: theme.palette.grey[300], mx: 'auto' }}
                >
                    {!imagePreview && 'Foto'}
                </Avatar>
                </label>
            </Box>

            <TextField label="Primer Nombre *" name="firstname" value={patient.firstname} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Segundo Nombre" name="secondname" value={patient.secondname} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Apellido *" name="surname" value={patient.surname} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Edad *" name="age" type="number" value={patient.age} onChange={handleChange} fullWidth margin="normal" />

            <FormControl fullWidth margin="normal">
                <InputLabel>Género *</InputLabel>
                <Select name="gender" value={patient.gender} label="Género *" onChange={handleChange}>
                <MenuItem value=""><em>Selecciona</em></MenuItem>
                {genders.map((g) => (
                    <MenuItem key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>

            {submitError && <Alert severity="error" sx={{ mt: 2 }}>{submitError}</Alert>}

            <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ mt: 3 }}>
                Guardar Cambios
            </Button>
            </form>
        </Paper>
        </Box>
    );
    };

    export default PatientEdit;
