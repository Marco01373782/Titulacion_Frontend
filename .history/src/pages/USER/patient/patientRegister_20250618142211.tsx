  import React, { useEffect, useState } from 'react';
  import {
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText,
    useTheme,
    useMediaQuery,
    Avatar,
    Alert,
  } from '@mui/material';
  import { useNavigate } from 'react-router-dom';
  import { fetchGender, createPatient } from '../../../services/ApiService';
  import { uploadImageToCloudinary } from '../../../data/cloudinaryUpload';

  const RegisterPatient = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

    // Validación visual
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
      fetchGender()
        .then((res) => setGenders(res.data))
        .catch((err) => console.error('Error al cargar géneros:', err));
    }, []);

    const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
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
      if (!imageFile) errors.imageFile = 'Foto del paciente es obligatoria';

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

      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Inicia sesión primero');
        return;
      }

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
        navigate('/user/patient-flow');
      } catch (error) {
        console.error('Error al registrar paciente:', error);
        alert('Error al registrar paciente');
      }
    };

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
          Registro del Paciente
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4} maxWidth={600} textAlign="center">
          Completa la información para crear el perfil del paciente.
        </Typography>

        {/* Imagen + error */}
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
          {formErrors.imageFile && (
            <FormHelperText error sx={{ mt: 1 }}>
              {formErrors.imageFile}
            </FormHelperText>
          )}
        </Box>

        {/* Campos */}
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
            onChange={handleChange}
            error={!!formErrors.firstname}
            helperText={formErrors.firstname}
            fullWidth
            required
          />
          <TextField
            label="Segundo Nombre"
            name="secondname"
            value={form.secondname}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Apellido *"
            name="surname"
            value={form.surname}
            onChange={handleChange}
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
            onChange={handleChange}
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
              onChange={handleChange}
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
            {formErrors.gender && (
              <FormHelperText>{formErrors.gender}</FormHelperText>
            )}
          </FormControl>
        </Box>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2, maxWidth: 650 }}>
            {submitError}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ width: 180, borderRadius: 2 }}
          type="submit"
        >
          Registrar Paciente
        </Button>
      </Box>
    );
  };

  export default RegisterPatient;
