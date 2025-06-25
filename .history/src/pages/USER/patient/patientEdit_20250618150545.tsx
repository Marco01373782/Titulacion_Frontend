import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Select, MenuItem, InputLabel,
  FormControl, FormHelperText, useTheme, useMediaQuery, Avatar, Alert, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getPacientePorUsuario, updatePatient, fetchGender } from '../../../services/ApiService';
import { uploadImageToCloudinary } from '../../../data/cloudinaryUpload';
import { SelectChangeEvent } from '@mui/material/Select';

const PatientEdit = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState<number | null>(null);
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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(true);

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
    ])
      .then(([patientRes, genderRes]) => {
        const data = patientRes.data;
        setPatientId(data.id); // Aquí está el ID real del paciente
        setForm({
          firstname: data.firstname,
          secondname: data.secondname || '',
          surname: data.surname,
          age: data.age.toString(),
          gender: data.gender,
        });
        setImagePreview(data.photoUrl || null);
        setGenders(genderRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar datos:', err);
        alert('Error al cargar los datos');
        setLoading(false);
      });
  }, [navigate]);

  // Handlers separados para TextField y Select (MUI)
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormErrors((prev) => ({ ...prev, imageFile: '' }));
      setSubmitError('');
    }
  };

  const validateForm = () => {
    let errors: { [key: string]: string } = {};
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

    if (!patientId) {
      alert('No se encontró el ID del paciente');
      return;
    }

    try {
      let imageUrl = imagePreview || '';
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const requestBody = {
        ...form,
        age: parseInt(form.age),
        photoUrl: imageUrl,
      };

      await updatePatient(patientId, requestBody);
      alert('Paciente actualizado correctamente');
      navigate('/user/patient-view');
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      alert('Error al actualizar paciente');
    }
  };

  if (loading) {
    return (
      <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        p: 3,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
        backgroundColor: theme.palette.background.default,
      }}
      component="form"
      onSubmit={handleSubmit}
      noValidate
    >
      <Typography variant="h4" color="primary" mb={2}>
        Editar Paciente
      </Typography>

      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <input
          accept="image/*"
          type="file"
          id="upload-photo"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <label htmlFor="upload-photo" style={{ cursor: 'pointer' }}>
          <Avatar
            src={imagePreview || ''}
            alt="Foto del paciente"
            sx={{
              width: isMobile ? 150 : 200,
              height: isMobile ? 150 : 200,
              mb: 1,
              bgcolor: theme.palette.grey[200],
            }}
          >
            {!imagePreview && 'Subir Foto'}
          </Avatar>
        </label>
      </Box>

      <Box
        sx={{
          width: '100%',
          maxWidth: 650,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          label="Primer Nombre *"
          name="firstname"
          value={form.firstname}
          onChange={handleTextChange}
          error={!!formErrors.firstname}
          helperText={formErrors.firstname}
          fullWidth
          required
        />
        <TextField
          label="Segundo Nombre"
          name="secondname"
          value={form.secondname}
          onChange={handleTextChange}
          fullWidth
        />
        <TextField
          label="Apellido *"
          name="surname"
          value={form.surname}
          onChange={handleTextChange}
          error={!!formErrors.surname}
          helperText={formErrors.surname}
          fullWidth
          required
        />
        <TextField
          label="Edad *"
          name="age"
          type="number"
          inputProps={{ min: 0 }}
          value={form.age}
          onChange={handleTextChange}
          error={!!formErrors.age}
          helperText={formErrors.age}
          fullWidth
          required
        />
        <FormControl fullWidth error={!!formErrors.gender} required>
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
                {g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()}
              </MenuItem>
            ))}
          </Select>
          {formErrors.gender && <FormHelperText>{formErrors.gender}</FormHelperText>}
        </FormControl>
      </Box>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2, maxWidth: 650 }}>
          {submitError}
        </Alert>
      )}

      <Button variant="contained" color="primary" size="large" sx={{ width: 200, borderRadius: 2 }} type="submit">
        Guardar Cambios
      </Button>
    </Box>
  );
};

export default PatientEdit;
