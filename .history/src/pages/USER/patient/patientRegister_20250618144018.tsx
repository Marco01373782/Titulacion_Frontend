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
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchGender, createPatient } from '../../../services/ApiService';
import { uploadImageToCloudinary } from '../../../data/cloudinaryUpload';
import { SelectChangeEvent } from '@mui/material/Select';

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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchGender()
      .then((res) => setGenders(res.data))
      .catch((err) => console.error('Error al cargar géneros:', err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 1,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 700,
          height: isMobile ? '95%' : '90%',
          p: isMobile ? 2 : 4,
          borderRadius: 4,
          backgroundColor: theme.palette.grey[100],
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h5" color="primary" mb={isMobile ? 1 : 2} textAlign="center">
          Registro del Paciente
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={isMobile ? 2 : 3} textAlign="center">
          Completa todos los datos requeridos para registrar al paciente.
        </Typography>

        {/* Imagen */}
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
                width: isMobile ? 160 : 180,
                height: isMobile ? 160 : 180,
                mb: 1,
                bgcolor: theme.palette.grey[300],
                border: `2px dashed ${theme.palette.primary.main}`,
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

        {/* Formulario */}
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            label="Primer Nombre *"
            name="firstname"
            value={form.firstname}
            onChange={handleInputChange}
            error={!!formErrors.firstname}
            helperText={formErrors.firstname}
            fullWidth
            required
          />
          <TextField
            label="Segundo Nombre"
            name="secondname"
            value={form.secondname}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Apellido *"
            name="surname"
            value={form.surname}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            {formErrors.gender && (
              <FormHelperText>{formErrors.gender}</FormHelperText>
            )}
          </FormControl>
        </Box>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {submitError}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ width: isMobile ? '100%' : 200, borderRadius: 3 }}
          type="submit"
        >
          Registrar Paciente
        </Button>
      </Paper>
    </Box>
  );
};

export default RegisterPatient;
